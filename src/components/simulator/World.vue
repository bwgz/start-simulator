<script setup>
import { defineProps, onMounted, ref, watch } from "vue";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { BlockModel, SwimmerModel } from "../../three";
import { StartEvent, controls } from "./controls.js";

const props = defineProps(["play"]);
console.log("props", props);

const loading = ref(0);
const loaded = ref(0);
const goLive = ref(false);

const progressbar = ref(null);
const world = ref(null);
const canvas = ref(null);

let block = null;
let swimmer = null;

let mixer = null;
let action = null;
let actions = [];
let animations = [];

const getAction = (name) => {
    const index = "Armature|" + name;
    console.log("index", index);

    return actions[index];
};

watch(controls, async (current, last) => {
    const { event } = current;
    if (action) {
        action.fadeOut(0.5);
        action.stop();
        action.reset();
        action.clampWhenFinished = false;
    }

    console.log("event", event);
    switch (event) {
        case StartEvent.NEXT_HEAT:
            swimmer.position.set(-50, -30, 0);
            action = getAction(StartEvent.NEXT_HEAT);
            console.log("action", action);

            action.clampWhenFinished = true;
            action.setLoop(THREE.LoopOnce, 10);
            action.reset();
            action.play();
            break;
        case StartEvent.SHORT_WHISTLES:
            swimmer.position.set(-50, -30, 0);
            action = getAction(StartEvent.NEXT_HEAT);
            console.log("action", action);

            action.clampWhenFinished = true;
            action.setLoop(THREE.LoopOnce, 10);
            action.reset();
            action.play();
            break;
        case StartEvent.LONG_WHISTLE:
        case StartEvent.STAND:
            swimmer.position.set(-19, 10, 16);
            action = getAction(StartEvent.LONG_WHISTLE);
            console.log("action", action);

            action.clampWhenFinished = false;
            action.reset();
            action.play();
            break;
        case StartEvent.TAKE_YOUR_MARKS:
            swimmer.position.set(-19, 10, 16);
            action = getAction(StartEvent.TAKE_YOUR_MARKS);
            console.log("action", action);
            action.timeScale = 1;
            action.setLoop(THREE.LoopOnce, 1);
            action.clampWhenFinished = true;
            action.reset();
            action.play();
            break;
        case StartEvent.START:
            swimmer.position.set(-19, 10, 16);
            action = getAction(StartEvent.START);
            console.log("action", action);
            action.timeScale = 1;
            action.setLoop(THREE.LoopOnce, 1);
            action.clampWhenFinished = true;
            action.reset();
            action.play();
            break;
        default:
            console.error("Unknown event", event);
            break;
    }
});

onMounted(() => {
    const manager = new THREE.LoadingManager();
    manager.onStart = function (url, itemsLoaded, itemsTotal) {
        loaded.value = itemsLoaded;
        loading.value = itemsTotal;
        console.log("Started loading file: " + url + ".\nLoaded " + itemsLoaded + " of " + itemsTotal + " files.");
    };

    manager.onProgress = function (url, itemsLoaded, itemsTotal) {
        loaded.value = itemsLoaded;
        loading.value = itemsTotal;
        progressbar.value.style.width = `${(itemsLoaded / itemsTotal) * 100}%`;
        console.log("Loading file: " + url + ".\nLoaded " + itemsLoaded + " of " + itemsTotal + " files.");
    };

    manager.onLoad = function () {
        console.log("Loading complete!");

        const width = world.value.clientWidth;
        const height = world.value.clientHeight;
        console.log(`width: ${width}, height: ${height}`);

        const renderer = new THREE.WebGLRenderer({ canvas: canvas.value, antialias: true });
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xcbe4f9);

        const axesHelper = new THREE.AxesHelper(1000);
        const ambient = new THREE.AmbientLight(0xffffff, 1);
        const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);

        const onWindowResize = () => {
            const width = world?.value.clientWidth;
            const height = world?.value.clientHeight;

            if (width && height) {
                camera.aspect = width / height;
                camera.updateProjectionMatrix();

                renderer.setSize(width, height);
            }
        };

        window.addEventListener("resize", onWindowResize, false);
        camera.position.set(26, -150, 32);
        camera.lookAt(0, 0, 32);
        camera.rotateZ(0.5 * Math.PI);
        //const controls = new OrbitControls(camera, renderer.domElement);

        scene.add(ambient);
        //scene.add(axesHelper);
        scene.add(block);
        scene.add(swimmer);

        const light = new THREE.PointLight(0xffffff, 1000);
        light.position.set(20, 7.5, 50);
        scene.add(light);

        mixer = new THREE.AnimationMixer(swimmer);

        swimmer.animations.forEach((animation) => {
            const action = mixer.clipAction(animation);
            actions[animation.name] = action;
            console.log("action", animation.name, action);
        });

        controls.setEvent(StartEvent.NEXT_HEAT);
        console.log("actions", actions);

        const render = () => {
            renderer.render(scene, camera);
        };

        const clock = new THREE.Clock();

        const animate = () => {
            requestAnimationFrame(animate);
            //controls.update();

            if (mixer) {
                mixer.update(clock.getDelta());
            }
            render();
        };

        animate();

        goLive.value = true;
    };

    BlockModel.generate(manager).then((model) => {
        block = model;
    });
    SwimmerModel.generate(manager).then((model) => {
        swimmer = model;
    });
});
</script>

<template>
    <div ref="world" style="height: 800px">
        <div v-if="!goLive">
            <div class="d-flex flex-column align-items-center justify-content-center">
                <label class="display-3 p-20" for="progress-bar">Filling Up The Pool</label>
                <div id="progress-bar" class="progress" aria-busy="true" style="width: 400px">
                    <div ref="progressbar" class="progress-bar" role="progressbar"></div>
                </div>
                <div class="text-left text-dark">
                    <strong>Completed {{ loaded }} of {{ loading }}.</strong>
                </div>
            </div>
        </div>

        <canvas ref="canvas" class="h-auto d-inline-block" />
    </div>
</template>
