<script setup>
import { onMounted, ref, watch } from "vue";
import * as THREE from "three";

import { useSettingsStore } from "@/simulator/settings";
import { createWorld } from "@/three";
import { POOL } from "./constants";
import { CAMERA_NAMES, createCameras, updateCameras } from "./camera";
import { populateWorld } from "./populate";
import { STATE, useStateStore } from "@/simulator/state";
import { createDatGui } from "./gui";
import { dumpGeometry } from "@/three/utils";

const debug = ref(true);
const state = useStateStore();

const settings = useSettingsStore();

const progressBar = ref(null);
const worldView = ref(null);
const canvas = ref(null);
const datGui = ref(null);

const loading = ref(0);
const loaded = ref(0);
const showView = ref(false);

const world = {
    state: STATE.WAITING,
    models: null,
    camera: CAMERA_NAMES.STARTER,
};

const renderWorld = (models) => {
    world.models = models;
    world.swimmers = models.swimmers;

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

    const cameras = createCameras(POOL, width, height);
    cameras.forEach((camera) => scene.add(camera));

    const { pool, chairs, blocks, swimmers } = models;
    [pool].concat(chairs, blocks, swimmers).forEach((model) => scene.add(model));

    populateWorld(POOL, blocks, chairs);

    if (debug.value) {
        let axisHelper = new THREE.AxesHelper(2000);
        axisHelper.position.copy(POOL.corner);
        scene.add(axisHelper);
    }

    {
        const boundingBox = new THREE.Box3();
        const size = new THREE.Vector3();
        boundingBox.setFromObject(swimmers[0]).getSize(size);

        const position = POOL.rightLane.clone();
        // x, y, z normalizes the block to the pool deck and
        const x = swimmers[0].position.x - 150;
        const y = 0;
        const z = 0; // this is edge of the pool and behind the block is lower
        position.add(new THREE.Vector3(x, y, z));

        // move the block to the center of the lane
        position.add(new THREE.Vector3(0, (POOL.laneWidth - size.y) / 2, 0));
        for (let swimmer of swimmers) {
            swimmer.position.copy(position);
            position.add(new THREE.Vector3(0, POOL.laneWidth, 0));
        }
    }

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

        //for (const mixer of mixers) mixer.update(delta);
        //controls.update();
        render();
    };

    animate();

    showView.value = true;
};

const onWaiting = () => {
    console.log("onWaiting");
    world.swimmers.forEach((swimmer) => {
        const position = swimmer.position.clone();
        position.sub(new THREE.Vector3(100, 0, 0));
        swimmer.position.copy(position);
    });
};

const onCommencement = () => {
    console.log("onCommencement");
    world.swimmers.forEach((swimmer) => {
        const position = swimmer.position.clone();
        position.add(new THREE.Vector3(100, 0, 0));
        swimmer.position.copy(position);
    });
};

const onOnPlatform = () => {
    console.log("onOnPlatform");
    world.swimmers.forEach((swimmer) => {
        const position = swimmer.position.clone();
        position.add(new THREE.Vector3(120, 70, 45));
        swimmer.position.copy(position);
    });
};

const onStartingPosition = () => {
    console.log("onStartingPosition");
    world.swimmers.forEach((swimmer) => {
        const position = swimmer.position.clone();
        position.add(new THREE.Vector3(12, 0, 0));
        swimmer.position.copy(position);
    });
};

const onRacing = () => {
    console.log("onRacing");
    world.swimmers.forEach((swimmer) => {
        const position = swimmer.position.clone();
        position.add(new THREE.Vector3(20, 0, 0));
        swimmer.position.copy(position);
    });
};

onMounted(() => {
    let gui;
    const manager = new THREE.LoadingManager();

    if (debug.value) {
        gui = createDatGui(datGui.value, world);
    }

    watch(state, (state) => {
        const { current } = state;
        world.state = current;

        if (gui) {
            gui.updateDisplay();
        }

        switch (current) {
            case STATE.WAITING:
                onWaiting();
                break;
            case STATE.COMMENCEMENT:
                onCommencement();
                break;
            case STATE.ON_PLATFORM:
                onOnPlatform();
                break;
            case STATE.STARTING_POSITION:
                onStartingPosition();
                break;
            case STATE.RACING:
                onRacing();
                break;
        }
    });

    createWorld(manager, settings.pool.lanes).then((models) => renderWorld(models));
});
</script>

<template>
    <div ref="worldView" style="height: 800px">
        <div v-if="!showView">
            <div class="d-flex flex-column align-items-center justify-content-center">
                <label class="display-3 p-20" for="progress-bar">Filling Up The Pool</label>
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
