<script setup>
import { onMounted, ref, watch } from "vue";
import { useMouse, useMousePressed } from "@vueuse/core";
import * as THREE from "three";
import * as SkeletonUtils from "three/addons/utils/SkeletonUtils.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { BlockModel, ChairModel, PoolModel, SwimmerModel } from "../../three";
import { SIMULATION_QUALITY, LANE_ASSIGNMENT_METHOD } from "../../simulator/settings";
import { StartEvent, controls } from "./controls.js";

const dimensions = new THREE.Vector3(6936.19580078125, 5293.339039520264, 1078.677250341797);
const positions = [];

for (let i = 0; i < 8; i++) {
    const x = dimensions.x / 6;
    const y = dimensions.y / 4;
    const z = dimensions.z / 2;

    const position = {
        deck: new THREE.Vector3(x - 150, y + 270 + 220 * i, z - 247),
        block: new THREE.Vector3(x + 40, y + 270 + 220 * i, z - 182),
    };
    positions.push(position);
}

const ONE_SECOND = 1000;
const ONE_TENTH_SECOND = ONE_SECOND / 10;
const randomWithin = (miniumn, variance) => miniumn + Math.floor(Math.random() * variance);

const props = defineProps(["settings"]);
const { settings } = props;

const loading = ref(0);
const loaded = ref(0);
const goLive = ref(false);

const progressbar = ref(null);
const world = ref(null);
const canvas = ref(null);

let pool = null;
let blocks = [];
let chairs = [];
let swimmers = [];
const mixers = [];

const getAnimationClipName = (name) => "Armature|" + name;
const getAnimationClip = (array, name) => THREE.AnimationClip.findByName(array, getAnimationClipName(name));
const getClipAction = (mixer, animations, name) => mixer.clipAction(getAnimationClip(animations, name));

const waitingAnimationNames = ["bashful", "bored", "idle", "standing-greeting", "standing-idle"];
const longWhistleAnimationNames = ["bashful", "idle", "standing-idle"];
const shortWhistlesAnimationNames = ["idle-01"];
const takeYourMarkAnimationNames = ["take-your-mark"];
const standAnimationNames = ["stand"];
const startAnimationNames = ["start:2"];

const getRandomAnimationName = (names) => {
    const name = names[Math.floor(Math.random() * names.length)];
    return name;
};

watch(controls, (current, last) => {
    let { event: next, previous } = current;
    if (next === StartEvent.SHORT_WHISTLES) {
        next = StartEvent.NEXT_HEAT;
    }

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
                const action = getClipAction(mixer, swimmer.animations, getRandomAnimationName(waitingAnimationNames));
                action.timeScale = 0.7 + Math.random() * 0.3;
                action.play();
            }
            break;
        case StartEvent.LONG_WHISTLE:
            for (let i = 0; i < swimmers.length; i++) {
                const swimmer = swimmers[i];
                swimmer.position.set(positions[i].block.x, positions[i].block.y, positions[i].block.z);
                const mixer = mixers[i];
                const action = getClipAction(
                    mixer,
                    swimmer.animations,
                    getRandomAnimationName(longWhistleAnimationNames)
                );
                action.clampWhenFinished = true;
                action.timeScale = 0.5 + Math.random() * 0.5;
                action.setEffectiveTimeScale();
                action.play();
            }
            break;
        case StartEvent.TAKE_YOUR_MARKS:
            for (let i = 0; i < swimmers.length; i++) {
                const swimmer = swimmers[i];
                swimmer.position.set(positions[i].block.x, positions[i].block.y, positions[i].block.z);
                const mixer = mixers[i];
                const action = getClipAction(
                    mixer,
                    swimmer.animations,
                    getRandomAnimationName(takeYourMarkAnimationNames)
                );
                action.clampWhenFinished = true;
                let timeScale = 1;
                if (settings.simulation.quality == SIMULATION_QUALITY.POOR) {
                    timeScale = 0.25 + Math.random() * 0.25;
                } else if (settings.simulation.quality == SIMULATION_QUALITY.GOOD) {
                    timeScale = 0.5 + Math.random() * 0.25;
                } else if (settings.simulation.quality == SIMULATION_QUALITY.EXCELLENT) {
                    timeScale = 0.75 + Math.random() * 0.25;
                }
                action.timeScale = timeScale;
                action.setLoop(THREE.LoopOnce, 1);
                action.play();
            }
            break;
        case StartEvent.START:
            for (let i = 0; i < swimmers.length; i++) {
                const swimmer = swimmers[i];
                const mixer = mixers[i];
                const action = getClipAction(mixer, swimmer.animations, getRandomAnimationName(startAnimationNames));
                action.clampWhenFinished = true;
                let timeScale = 1;
                if (settings.simulation.quality == SIMULATION_QUALITY.POOR) {
                    timeScale = 0.25 + Math.random() * 0.5;
                } else if (settings.simulation.quality == SIMULATION_QUALITY.GOOD) {
                    timeScale = 0.6 + Math.random() * 0.3;
                } else if (settings.simulation.quality == SIMULATION_QUALITY.EXCELLENT) {
                    timeScale = 0.8 + Math.random() * 0.2;
                }
                action.timeScale = timeScale;
                action.setLoop(THREE.LoopOnce, 1);
                action.play();
            }
            break;
        case StartEvent.STAND:
            for (let i = 0; i < swimmers.length; i++) {
                const swimmer = swimmers[i];
                const mixer = mixers[i];
                const action = getClipAction(mixer, swimmer.animations, getRandomAnimationName(standAnimationNames));
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
    const { pressed } = useMousePressed();
    const { x: canvasX } = useMouse({ target: canvas.value });

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

        watch(settings, (current, last) => {
            for (let i = 0; i < swimmers.length; i++) {
                if (i >= settings.simulation.numberOfSwimmers) {
                    swimmers[i].visible = false;
                } else {
                    swimmers[i].visible = true;
                }
            }
        });

        const width = world.value.clientWidth;
        const height = world.value.clientHeight;

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

        const camera = new THREE.PerspectiveCamera(45, width / height, 1, 8000);
        camera.up.set(0, 0, 1);

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

        //scene.add(axesHelper);
        scene.add(pool);

        const x = dimensions.x / 6 + 110;
        const y = dimensions.y / 4 + 225;
        const z = dimensions.z / 2 - 285;

        for (let i = 0; i < blocks.length; i++) {
            blocks[i].position.set(x, y + 220 * i, z);
            scene.add(blocks[i]);
            chairs[i].position.set(x - 450, y + 220 * i, z + 40);
            scene.add(chairs[i]);
        }

        for (let i = 0; i < swimmers.length; i++) {
            swimmers[i].position.set(positions[i].deck.x, positions[i].deck.y, positions[i].deck.z);
            scene.add(swimmers[i]);
        }

        const rtol = new THREE.Vector3(1475, 1100, 475);
        const ltor = new THREE.Vector3(1475, 3800, 460);
        const startPosition = rtol;
        camera.position.set(startPosition.x, startPosition.y, startPosition.z);
        const lookAt = new THREE.Vector3(blocks[2].position.x - 100, blocks[2].position.y, blocks[2].position.z);
        camera.lookAt(lookAt);

        watch(canvasX, (current, last) => {
            if (pressed.value && current) {
                const delta = current - last;
                lookAt.x += delta;
                camera.lookAt(lookAt);
            }
        });
        /*
         */

        //const controls = new OrbitControls(camera, renderer.domElement);
        //controls.update();

        const render = () => {
            renderer.render(scene, camera);
        };

        const clock = new THREE.Clock();

        const animate = () => {
            requestAnimationFrame(animate);
            const delta = clock.getDelta();

            for (const mixer of mixers) mixer.update(delta);

            camera.updateProjectionMatrix();
            //controls.update();
            render();
        };

        animate();

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

    ChairModel.generate(manager).then((model) => {
        chairs = [];

        for (let i = 0; i < settings.pool.lanes; i++) {
            const clone = model.clone();

            chairs.push(clone);
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
