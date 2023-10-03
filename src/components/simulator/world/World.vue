<script setup>
import { onMounted, ref, render } from "vue";
import * as THREE from "three";
import { useSettingsStore } from "@/simulator/settings";
import { createWorld } from "@/three";
import { POOL } from "./constants";
import { populateWorld } from "./populate";
import { dumpGeometry } from "@/three/utils";

const settings = useSettingsStore();

const progressBar = ref(null);
const worldView = ref(null);
const canvas = ref(null);

const loading = ref(0);
const loaded = ref(0);
const showView = ref(false);

const world = {
    models: null,
};

const renderWorld = (models) => {
    world.models = models;

    const width = worldView?.value.clientWidth;
    const height = worldView?.value.clientHeight;

    const renderer = new THREE.WebGLRenderer({ canvas: canvas.value, antialias: true });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xcbe4f9);

    const ambient = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambient);

    const camera = new THREE.PerspectiveCamera(70, width / height, 1, 7000);
    camera.up.set(0, 0, 1);
    scene.add(camera);
    //scene.add(new THREE.CameraHelper(camera));

    const overhead = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
    overhead.up.set(0, 0, 1);
    scene.add(overhead);
    //scene.add(new THREE.CameraHelper(overhead));

    const downLine = new THREE.PerspectiveCamera(45, width / height, 1, 7000);
    downLine.up.set(0, 0, 1);
    scene.add(downLine);
    //scene.add(new THREE.CameraHelper(downLine));

    if (false) {
        const axisHelper = new THREE.AxesHelper(200);
        axisHelper.position.copy(POOL.corner);
        scene.add(axisHelper);
    }

    const { pool, chairs, blocks, swimmers } = models;
    [pool].concat(chairs, blocks, swimmers).forEach((model) => scene.add(model));

    if (false) {
        const axisHelper = new THREE.AxesHelper(200);
        axisHelper.position.copy(POOL.rightLane);
        scene.add(axisHelper);
    }

    populateWorld(POOL, blocks, chairs)

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

    {
        downLine.position.set(POOL.corner.x, POOL.corner.y - 200, POOL.corner.z + 150);
        downLine.lookAt(POOL.corner.x, POOL.corner.y + 2000, POOL.corner.z);
    }
    {
        const position = POOL.corner.clone();
        position.add(new THREE.Vector3(150, -100, 150));
        camera.position.copy(position);
        camera.lookAt(POOL.corner.x - 70, POOL.rightLane.y + POOL.laneWidth * 3, POOL.corner.z + 100);

        if (false) {
            const axisHelper = new THREE.AxesHelper(1000);
            axisHelper.position.set(POOL.corner.x - 70, POOL.rightLane.y + POOL.laneWidth * 3, POOL.corner.z + 100);
            scene.add(axisHelper);
        }
    }

    {
        const position = POOL.rightLane.clone();
        position.add(new THREE.Vector3(0, POOL.laneWidth / 2, 0));

        overhead.position.set(position.x, position.y, position.z + 200);
        overhead.lookAt(position.x, position.y, position.z);
    }

    const onWindowResize = () => {
        const width = world?.value?.clientWidth;
        const height = world?.value?.clientHeight;

        if (width && height) {
            camera.aspect = width / height;
            camera.updateProjectionMatrix();

            renderer.setSize(width, height);
        }
    };
    window.addEventListener("resize", onWindowResize, false);

    const render = () => {
        renderer.render(scene, camera);
    };

    const clock = new THREE.Clock();

    const animate = () => {
        requestAnimationFrame(animate);
        const delta = clock.getDelta();

        //for (const mixer of mixers) mixer.update(delta);

        camera.updateProjectionMatrix();
        //controls.update();
        render();
    };

    animate();

    showView.value = true;
};

onMounted(() => {
    const manager = new THREE.LoadingManager();
    const models = [];

    /*
    manager.onProgress = function (url, itemsLoaded, itemsTotal) {
        //console.log("Loading file: " + url + ".\nLoaded " + itemsLoaded + " of " + itemsTotal + " files.");
        loaded.value = itemsLoaded;
        loading.value = itemsTotal;
        if (progressBar.value) {
            progressBar.value.style.width = `${(itemsLoaded / itemsTotal) * 100}%`;
        }
    };

    manager.onLoad = function () {
        console.log("models", models);
        console.log("Loading complete!");
    };
    */

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

        <canvas ref="canvas" class="h-auto d-inline-block" />
    </div>
</template>
