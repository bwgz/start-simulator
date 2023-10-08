<script setup>
import { onMounted, ref } from "vue";
import * as THREE from "three";

import { MAKE, makeAllModels } from "@/three";
import { positionModels } from "./position";
import { CAMERA_NAMES, createCameras, updateCameras } from "./camera";
import { createLights } from "./lights";
import { useSettingsStore } from "@/simulator/settings";
import { STATE, useStateStore } from "@/simulator/state";
import { watchForChange } from "./change";
import { createDatGui } from "./gui";

const debug = ref(import.meta.env.MODE === "development");
const settings = useSettingsStore();
const state = useStateStore();

const progressBar = ref(null);
const worldView = ref(null);
const canvas = ref(null);
const datGui = ref(null);

const loading = ref(0);
const loaded = ref(0);
const showView = ref(false);

const world = {
    state: STATE.WAITING, // this is only used in the GUI for debugging
    models: null,
    camera: CAMERA_NAMES.STARTER,
    pool: null,
    swimmers: [],
    mixers: [],
};

const addHelpers = (pool, scene) => {
    if (false) {
        let axisHelper = new THREE.AxesHelper(2000);
        axisHelper.position.copy(POOL.rightLane);
        scene.add(axisHelper);
    }
};

const renderModels = (models) => {
    const { pool, blocks, swimmers } = models;

    const width = worldView.value.clientWidth;
    const height = worldView.value.clientHeight;

    const renderer = new THREE.WebGLRenderer({ canvas: canvas.value, antialias: true });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xcbe4f9);

    const ambient = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambient);

    const cameras = createCameras(pool.userData.specification, width, height);
    cameras.forEach((camera) => scene.add(camera));

    const lights = createLights(pool.userData.specification);
    lights.forEach((light) => scene.add(light));

    [pool].concat(blocks, swimmers).forEach((model) => scene.add(model));

    const onWindowResize = (event) => {
        if (worldView?.value) {
            const width = worldView.value.clientWidth;
            const height = worldView.value.clientHeight;

            if (width && height) {
                updateCameras(cameras, width, height);
                renderer.setSize(width, height);
            }
        }
    };
    window.addEventListener("resize", onWindowResize, false);

    const render = () => {
        renderer.render(scene, cameras[world.camera]);
    };

    const clock = new THREE.Clock();

    const animate = () => {
        requestAnimationFrame(animate);
        const delta = clock.getDelta();

        world.mixers.forEach((mixer) => mixer.update(delta));
        render();
    };

    animate();

    showView.value = true;
};

onMounted(() => {
    let gui;

    if (debug.value) {
        gui = createDatGui(datGui.value, world);
    }

    const manager = new THREE.LoadingManager();

    manager.onProgress = function (url, itemsLoaded, itemsTotal) {
        //console.log("Loading file: " + url + ".\nLoaded " + itemsLoaded + " of " + itemsTotal + " files.");
        loaded.value = itemsLoaded;
        loading.value = itemsTotal;
        if (progressBar.value) {
            progressBar.value.style.width = `${(itemsLoaded / itemsTotal) * 100}%`;
        }
    };


    makeAllModels(manager, settings)
        .then((models) => {
            const { pool } = models;
            positionModels(models);
            return models;
        })
        .then((models) => {
            renderModels(models);
            return models;
        })
        .then((models) => {
            const { pool, swimmers } = models;
            const { simulation } = settings;
            const { numberOfSwimmers } = simulation;

            world.pool = pool;
            world.swimmers = swimmers;
            world.swimmers.forEach((swimmer) => {
                const mixer = new THREE.AnimationMixer(swimmer);
                world.mixers.push(mixer);
            });
            settings.setNumberOfSwimmers(settings, Math.min(numberOfSwimmers, pool.userData.specification.lanes));
            watchForChange(settings, state, world, gui);
        });
});
</script>

<template>
    <div ref="worldView" style="height: 800px">
        <div v-if="!showView">
            <div class="d-flex flex-column align-items-center justify-content-center">
                <label class="display-3 p-20" for="progress-bar">Filling Up The Pool</label>
                <img class="p-2" src="/fill-pool.png" alt="fill the pool  pool" />
                <div id="progress-bar" class="progress" aria-busy="true" style="width: 400px">
                    <div ref="progressBar" class="progress-bar" role="progressBar"></div>
                </div>
                <div class="text-left text-dark">
                    <strong>Completed {{ loaded }} of {{ loading }}.</strong>
                </div>
            </div>
        </div>

        <div>
            <div v-if="debug" ref="datGui" />
            <canvas id="canvas" ref="canvas" class="h-auto d-inline-block" />
        </div>
    </div>
</template>
