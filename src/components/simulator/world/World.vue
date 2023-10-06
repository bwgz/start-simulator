<script setup>
import { onMounted, ref, watch } from "vue";
import * as THREE from "three";

import { MAKE, makeAllModels } from "@/three";
import { positionModels } from "./position";
import { CAMERA_NAMES, createCameras, updateCameras } from "./camera";
import { SIMULATION_QUALITY, useSettingsStore } from "@/simulator/settings";
import { STATE, useStateStore } from "@/simulator/state";
import { getClipName, getRandomClipName } from "./clips";
import { createDatGui } from "./gui";

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
    const pool = models[MAKE.POOL][0];

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

    const cameras = createCameras(pool.meta, width, height);
    cameras.forEach((camera) => scene.add(camera));

    models[MAKE.POOL].concat(models[MAKE.BLOCK], models[MAKE.SWIMMER]).forEach((model) => scene.add(model));
    
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

const onWaiting = (previous) => {
    console.log("onWaiting");
    const offset = new THREE.Vector3(3, 0, 0);
    const position = world.pool.meta.corner.clone().sub(offset);
    world.swimmers.forEach((swimmer) => {
        swimmer.position.x = position.x;
        swimmer.position.z = position.z;
    });
    world.mixers.forEach((mixer) => {
        mixer.stopAllAction();
        const action = mixer.clipAction(getRandomClipName(STATE.WAITING));
        action.timeScale = 0.7 + Math.random() * 0.3;
        action.play();
    });
};

const onCommencement = (previous) => {
    console.log("onCommencement");
    const offset = new THREE.Vector3(2, 0, 0);
    const position = world.pool.meta.corner.clone().sub(offset);
    world.swimmers.forEach((swimmer) => {
        swimmer.position.x = position.x;
        swimmer.position.z = position.z;
    });
    world.mixers.forEach((mixer) => {
        mixer.stopAllAction();
        const action = mixer.clipAction(getRandomClipName(STATE.COMMENCEMENT));
        action.timeScale = 0.7 + Math.random() * 0.3;
        action.play();
    });
};

const onOnPlatform = (previous) => {
    console.log("onOnPlatform");
    const offset = new THREE.Vector3(0.4, 0, -0.45);
    const position = world.pool.meta.corner.clone().sub(offset);
    world.swimmers.forEach((swimmer) => {
        swimmer.position.x = position.x;
        swimmer.position.z = position.z;
    });
    world.mixers.forEach((mixer) => {
        mixer.stopAllAction();
        const action = mixer.clipAction(getClipName("idle"));
        action.timeScale = 0.7 + Math.random() * 0.3;
        action.play();
    });
};

const onStartingPosition = (previous) => {
    console.log("onStartingPosition");
    const offset = new THREE.Vector3(0.35, 0, -0.45);
    const position = world.pool.meta.corner.clone().sub(offset);
    world.swimmers.forEach((swimmer) => {
        swimmer.position.x = position.x;
        swimmer.position.z = position.z;
    });
    world.mixers.forEach((mixer) => {
        mixer.stopAllAction();
        const action = mixer.clipAction(getClipName("take-your-mark"));
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
    });
};

const onStanding = (previous) => {
    console.log("onStartingPosition");
    const offset = new THREE.Vector3(0.35, 0, -0.45);
    const position = world.pool.meta.corner.clone().sub(offset);
    world.swimmers.forEach((swimmer) => {
        swimmer.position.x = position.x;
        swimmer.position.z = position.z;
    });
    world.mixers.forEach((mixer) => {
        mixer.stopAllAction();
        const action = mixer.clipAction(getClipName("stand"));
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
    });
};

const onRacing = (previous) => {
    console.log("onRacing");
    const offset = new THREE.Vector3(0.25, 0, -0.45);
    const position = world.pool.meta.corner.clone().sub(offset);
    world.swimmers.forEach((swimmer) => {
        swimmer.position.x = position.x;
        swimmer.position.z = position.z;
    });
    world.mixers.forEach((mixer) => {
        mixer.stopAllAction();
        const action = mixer.clipAction(getClipName("start:2"));
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
    });
};

const watchState = (gui) => {
    watch(state, (state) => {
        const { current, previous } = state;
        world.state = current;

        if (gui) {
            gui.updateDisplay();
        }

        switch (current) {
            case STATE.WAITING:
                onWaiting(previous);
                break;
            case STATE.COMMENCEMENT:
                onCommencement(previous);
                break;
            case STATE.ON_PLATFORM:
                onOnPlatform(previous);
                break;
            case STATE.STARTING_POSITION:
                onStartingPosition(previous);
                break;
            case STATE.STANDING:
                onStanding(previous);
                break;
            case STATE.RACING:
                onRacing(previous);
                break;
        }
    });
};

onMounted(() => {
    let gui;

    if (debug.value) {
        gui = createDatGui(datGui.value, world);
    }

    const manager = new THREE.LoadingManager();
    makeAllModels(manager, settings)
        .then((models) =>
            models.reduce((acc, cur) => {
                acc[cur.make] = cur.items;
                return acc;
            }, [])
        )
        .then((models) => {
            const meta = models[MAKE.POOL][0].meta;
            positionModels(meta, models);
            return models;
        })
        .then((models) => {
            renderModels(models);
            return models;
        })
        .then((models) => {
            world.pool = models[MAKE.POOL][0];
            world.swimmers = models[MAKE.SWIMMER];
            world.swimmers.forEach((swimmer) => {
                const mixer = new THREE.AnimationMixer(swimmer);
                world.mixers.push(mixer);
            });
            watchState(gui);
        });
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
