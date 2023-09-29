<script setup>
import { defineProps, onMounted, ref, watch } from "vue";
import * as THREE from "three";
import * as SkeletonUtils from "three/addons/utils/SkeletonUtils.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { BlockModel, PoolModel, SwimmerModel } from "../../three";
import { StartEvent, controls } from "./controls.js";

const dimensions = new THREE.Vector3(6936.19580078125, 5293.339039520264, 1078.677250341797);
const positions = [];

for (let i = 0; i < 8; i++) {
    const x = dimensions.x / 6;
    const y = dimensions.y / 4;
    const z = dimensions.z / 2;

    const position = {
        deck: new THREE.Vector3(x - 150, (y + 270) + (220 * i), z - 247),
        block: new THREE.Vector3(x + 40, (y + 270) + (220 * i), z - 182),
    };
    positions.push(position);
}

const ONE_SECOND = 1000;
const ONE_TENTH_SECOND = ONE_SECOND / 10;
const randomWithin = (miniumn, variance) => miniumn + Math.floor(Math.random() * variance);

const props = defineProps(["settings"]);
const { settings } = props;
console.log("settings", settings);

const loading = ref(0);
const loaded = ref(0);
const goLive = ref(false);

const progressbar = ref(null);
const world = ref(null);
const canvas = ref(null);

let pool = null;
let blocks = [];
let swimmers = [];
const mixers = [];

const getAnimationClipName = (name) => "Armature|" + name;
const getAnimationClip = (array, name) => THREE.AnimationClip.findByName(array, getAnimationClipName(name));

const getAction = (mixer, animations, name) => mixer.clipAction(getAnimationClip(animations, name));

const waitingAnimationNames = [
    "next-heat-0",
    "next-heat-1",
    "next-heat-2",
    "next-heat-3",
    "next-heat-4",
    "next-heat-5",
];

watch(controls, (current, last) => {
    let { event: next, previous } = current;
    if (next === StartEvent.SHORT_WHISTLES) {
        next = StartEvent.NEXT_HEAT;
    }
    console.log("next", next, "previous", previous);

    for (let i = 0; i < swimmers.length; i++) {
        mixers[i].stopAllAction();
    }

    switch (next) {
        case StartEvent.NEXT_HEAT:
        case StartEvent.SHORT_WHISTLES:
            for (let i = 0; i < swimmers.length; i++) {
                const swimmer = swimmers[i];
                swimmer.position.set(positions[i].deck.x, positions[i].deck.y, positions[i].deck.z);

                const mixer = mixers[i];
                const action = getAction(
                    mixer,
                    swimmer.animations,
                    waitingAnimationNames[Math.floor(Math.random() * 6)]
                );
                action.timeScale = 0.7 + Math.random() * 0.3;
                action.play();
            }
            break;
        case StartEvent.LONG_WHISTLE:
            for (let i = 0; i < swimmers.length; i++) {
                const swimmer = swimmers[i];
                swimmer.position.set(positions[i].block.x, positions[i].block.y, positions[i].block.z);

                const mixer = mixers[i];
                const action = getAction(mixer, swimmer.animations, next);
                action.timeScale = 0.5 + Math.random() * 0.5;
                action.play();
            }
            break;
        case StartEvent.TAKE_YOUR_MARKS:
            for (let i = 0; i < swimmers.length; i++) {
                const swimmer = swimmers[i];
                swimmer.position.set(positions[i].block.x, positions[i].block.y, positions[i].block.z);

                const mixer = mixers[i];
                const action = getAction(mixer, swimmer.animations, next);
                action.clampWhenFinished = true;
                action.timeScale = 0.5 + Math.random() * 0.5;
                action.setLoop(THREE.LoopOnce, 1);
                action.play();
            }
            break;
        case StartEvent.START:
            for (let i = 0; i < swimmers.length; i++) {
                const swimmer = swimmers[i];
                const mixer = mixers[i];
                const action = getAction(mixer, swimmer.animations, next);
                action.clampWhenFinished = true;
                action.timeScale = 0.5 + Math.random() * 0.5;
                action.setLoop(THREE.LoopOnce, 1);
                action.play();
            }
            break;
        case StartEvent.STAND:
            for (let i = 0; i < swimmers.length; i++) {
                const swimmer = swimmers[i];
                const mixer = mixers[i];
                const action = getAction(mixer, swimmer.animations, next);
                action.timeScale = 0.5 + Math.random() * 0.5;
                action.play();
            }
            break;
        default:
            console.error("Unknown event", next);
            break;
    }
});

onMounted(() => {
    const manager = new THREE.LoadingManager();
    manager.onStart = function (url, itemsLoaded, itemsTotal) {
        loaded.value = itemsLoaded;
        loading.value = itemsTotal;
        //console.log("Started loading file: " + url + ".\nLoaded " + itemsLoaded + " of " + itemsTotal + " files.");
    };

    manager.onProgress = function (url, itemsLoaded, itemsTotal) {
        loaded.value = itemsLoaded;
        loading.value = itemsTotal;
        progressbar.value.style.width = `${(itemsLoaded / itemsTotal) * 100}%`;
        //console.log("Loading file: " + url + ".\nLoaded " + itemsLoaded + " of " + itemsTotal + " files.");
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
        //scene.add(light);

        const camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);

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

        //scene.add(axesHelper);
        scene.add(pool);

        console.log("dimensions", dimensions);

        const x = dimensions.x / 6 + 110;
        const y = dimensions.y / 4 + 225;
        const z = dimensions.z / 2 - 285;
        console.log("x", x, "y", y, "z", z);

        // camera.lookAt(44, 3, 622);
        //camera.rotateZ(0.5 * Math.PI);
        camera.position.set(x, y, z + 1000);
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.target.set(x, y, z);
        controls.update();

        for (let i = 0; i < blocks.length; i++) {
            blocks[i].position.set(x, y + 220 * i, z);
            scene.add(blocks[i]);
        }

        for (let i = 0; i < swimmers.length; i++) {
            swimmers[i].position.set(positions[i].deck.x, positions[i].deck.y, positions[i].deck.z);
            scene.add(swimmers[i]);
        }

        const render = () => {
            renderer.render(scene, camera);
        };

        const clock = new THREE.Clock();

        const animate = () => {
            requestAnimationFrame(animate);
            const delta = clock.getDelta();

            for (const mixer of mixers) mixer.update(delta);

            controls.update();
            render();
        };

        animate();

        controls.setEvent(StartEvent.NEXT_HEAT);
        goLive.value = true;
    };

    PoolModel.generate(manager).then((model) => {
        pool = model;
    });

    BlockModel.generate(manager).then((model) => {
        blocks = [];

        for (let i = 0; i < settings.pool.lanes; i++) {
            const clone = model.clone();

            blocks.push(clone);
        }
    });

    SwimmerModel.generate(manager).then((model) => {
        swimmers = [];

        /*
        model.animations.forEach((animation) => {
            console.log(animation.name);
        });

        const helper = new THREE.SkeletonHelper(model);
        helper.bones.forEach((bone) => {
            console.log(bone);
        });
        */

        for (let i = 0; i < settings.pool.lanes; i++) {
            const clone = SkeletonUtils.clone(model);
            const mixer = new THREE.AnimationMixer(clone);
            //const animationClip = getAnimationClip(clone.animations, StartEvent.NEXT_HEAT);
            //mixer.clipAction(animationClip).play();

            swimmers.push(clone);
            mixers.push(mixer);
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
