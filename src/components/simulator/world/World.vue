<script setup>
import { onMounted, ref, render } from "vue";
import * as THREE from "three";
import { useSettingsStore } from "@/simulator/settings";
import { loadModels, createWorld } from "@/three";
import { start } from "@popperjs/core";

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

const corner = new THREE.Vector3(1228.9, 1344.35, 295.3);

const renderWorld = (models) => {
    console.log("renderWorld", models);
    world.models = models;
    console.log("center", corner);

    const width = worldView.value.clientWidth;
    const height = worldView.value.clientHeight;

    const renderer = new THREE.WebGLRenderer({ canvas: canvas.value, antialias: true });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xcbe4f9);

    const axesHelper = new THREE.AxesHelper(1000);
    const ambient = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambient);

    const camera = new THREE.PerspectiveCamera(60, width / height, 1, 7000);
    camera.up.set(0, 0, 1);
    scene.add(camera);

    var axisHelper = new THREE.AxesHelper(200);
    axisHelper.position.copy(corner);
    scene.add(axisHelper);

    const { pool, chairs, blocks, swimmers } = models;
    [pool].concat(chairs, blocks, swimmers).forEach((model) => scene.add(model));

    camera.position.set(corner.x, corner.y, corner.z + 1000);
    camera.lookAt(corner.x, corner.y + 1000, corner.z);

    const laneWidth = 222;
    const rightLane = {
        x: corner.x,
        y: 110,
    };

    {
        const boundingBox = new THREE.Box3();
        const blockSize = new THREE.Vector3();
        boundingBox.setFromObject(blocks[0]).getSize(blockSize);

        const position = corner.clone();
        // x, y, z normalizes the block to the pool deck and
        // brings the block to the right edge of lane 1
        const x = 33;
        const y = rightLane.y;
        const z = -41;
        position.add(new THREE.Vector3(x, y, z));

        // move the block to the center of the lane
        position.add(new THREE.Vector3(0, ((laneWidth - blockSize.y) / 2), 0));
        for (let block of blocks) {
            block.position.copy(position);
            position.add(new THREE.Vector3(0, laneWidth, 0));
        }
    }

    {
        const boundingBox = new THREE.Box3();
        const blockSize = new THREE.Vector3();
        boundingBox.setFromObject(chairs[0]).getSize(blockSize);

        const position = corner.clone();
        // x, y, z normalizes the block to the pool deck and
        // brings the block to the right edge of lane 1
        const x = -350;
        const y = rightLane.y;
        const z = -5;
        position.add(new THREE.Vector3(x, y, z));

        // move the block to the center of the lane
        position.add(new THREE.Vector3(0, ((laneWidth - blockSize.y) / 2), 0));
        for (let chair of chairs) {
            chair.position.copy(position);
            position.add(new THREE.Vector3(0, laneWidth, 0));
        }
        const test = chairs[0].position;
        camera.position.set(test.x, test.y + 100, test.z + 1);
        camera.lookAt(test.x, test.y, test.z);
        axisHelper.position.copy(test);
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
