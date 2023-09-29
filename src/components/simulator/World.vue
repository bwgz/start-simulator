<script setup>
import { defineProps, onMounted, ref, watch } from "vue";
import * as THREE from "three";
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { BlockModel, SwimmerModel } from "../../three";
import { StartEvent, controls } from "./controls.js";

const props = defineProps(["settings"]);
const { settings } = props;
console.log("settings", settings);

const loading = ref(0);
const loaded = ref(0);
const goLive = ref(false);

const progressbar = ref(null);
const world = ref(null);
const canvas = ref(null);

let blocks = [];
let swimmers = [];

let mixer = null;
let action = null;
let actions = [];

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
            swimmers[0].position.set(-50, -30, 0);
            action = getAction(StartEvent.NEXT_HEAT);
            console.log("action", action);

            action.clampWhenFinished = true;
            action.setLoop(THREE.LoopOnce, 10);
            action.reset();
            action.play();
            break;
        case StartEvent.SHORT_WHISTLES:
            swimmers[0].position.set(-50, -30, 0);
            action = getAction(StartEvent.NEXT_HEAT);
            console.log("action", action);

            action.clampWhenFinished = true;
            action.setLoop(THREE.LoopOnce, 10);
            action.reset();
            action.play();
            break;
        case StartEvent.LONG_WHISTLE:
        case StartEvent.STAND:
            swimmers[0].position.set(-19, 10, 16);
            action = getAction(StartEvent.LONG_WHISTLE);
            console.log("action", action);

            action.clampWhenFinished = false;
            action.reset();
            action.play();
            break;
        case StartEvent.TAKE_YOUR_MARKS:
            swimmers.position.set(-19, 10, 16);
            action = getAction(StartEvent.TAKE_YOUR_MARKS);
            console.log("action", action);
            action.timeScale = 1;
            action.setLoop(THREE.LoopOnce, 1);
            action.clampWhenFinished = true;
            action.reset();
            action.play();
            break;
        case StartEvent.START:
            swimmers[0].position.set(-19, 10, 16);
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
        scene.add(ambient);

        const light = new THREE.PointLight(0xffffff, 1000);
        light.position.set(20, 7.5, 50);
        scene.add(light);

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

        //scene.add(axesHelper);

        for (let i = 0; i < blocks.length; i++) {
            blocks[i].position.set(0, 0 + (50 * i), -10);
            scene.add(blocks[i]);
        }

        for (let i = 0; i < swimmers.length; i++) {
            swimmers[i].position.set(0, 0, -10);

            scene.add(swimmers[i]);
        }

        mixer = new THREE.AnimationMixer(swimmers[0]);

        swimmers[0].animations.forEach((animation) => {
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
        blocks = [];

        for (let i = 0; i < settings.pool.lanes; i++) {
            const clone = model.clone();
            clone.position.set(0, 0, -10);

            blocks.push(clone);
        }
    });

    SwimmerModel.generate(manager).then((model) => {
        swimmers = [];

        for (let i = 0; i < settings.pool.lanes; i++) {
            const clone = SkeletonUtils.clone(model);

            swimmers.push(clone);
        }
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
