import { watch } from "vue";
import * as THREE from "three";
import { STATE } from "@/simulator/state";
import { getClipName, getRandomClipName } from "./clips";
import { LANE_ASSIGNMENT_METHOD, SIMULATION_QUALITY } from "@/simulator/settings";

const onWaiting = (settings, world, previous) => {
    const offset = new THREE.Vector3(3, 0, 0);
    const position = world.pool.userData.specification.corner.clone().sub(offset);
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

const onCommencement = (settings, world, previous) => {
    const offset = new THREE.Vector3(2, 0, 0);
    const position = world.pool.userData.specification.corner.clone().sub(offset);
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

const onOnPlatform = (settings, world, previous) => {
    const offset = new THREE.Vector3(0.4, 0, -0.45);
    const position = world.pool.userData.specification.corner.clone().sub(offset);
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

const onStartingPosition = (settings, world, previous) => {
    const offset = new THREE.Vector3(0.35, 0, -0.45);
    const position = world.pool.userData.specification.corner.clone().sub(offset);
    world.swimmers.forEach((swimmer) => {
        swimmer.position.x = position.x;
        swimmer.position.z = position.z;
    });
    world.mixers.forEach((mixer) => {
        mixer.stopAllAction();
        const action = mixer.clipAction(getClipName("take-your-marks"));
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

const onStanding = (settings, world, previous) => {
    const offset = new THREE.Vector3(0.35, 0, -0.45);
    const position = world.pool.userData.specification.corner.clone().sub(offset);
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

const onSTARTING = (settings, world, previous) => {
    const offset = new THREE.Vector3(0.35, 0, -0.45);
    const position = world.pool.userData.specification.corner.clone().sub(offset);
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
const stateHandlers = [];
stateHandlers[STATE.WAITING] = onWaiting;
stateHandlers[STATE.COMMENCEMENT] = onCommencement;
stateHandlers[STATE.ON_PLATFORM] = onOnPlatform;
stateHandlers[STATE.STARTING_POSITION] = onStartingPosition;
stateHandlers[STATE.STANDING] = onStanding;
stateHandlers[STATE.STARTING] = onSTARTING;

const onStateChange = (settings, current, previous, world) => {
    stateHandlers[current](settings, world, previous);
};

const onSettingsChange = (settings, state, world) => {
    const { simulation } = settings;
    const { laneAssignmentMethod, numberOfSwimmers } = simulation;
    const { pool, swimmers } = world;
    if (laneAssignmentMethod === LANE_ASSIGNMENT_METHOD.NEAR) {
        for (let i = 0; i < swimmers.length; i++) {
            if (i >= numberOfSwimmers) {
                swimmers[i].visible = false;
            } else {
                swimmers[i].visible = true;
            }
        }
    } else if (laneAssignmentMethod === LANE_ASSIGNMENT_METHOD.FAR) {
        for (let i = 0; i < swimmers.length; i++) {
            if (i < (pool.userData.specification.lanes - numberOfSwimmers)) {
                swimmers[i].visible = false;
            } else {
                swimmers[i].visible = true;
            }
        }
    } else if (laneAssignmentMethod === LANE_ASSIGNMENT_METHOD.SEEDED) {
        const size = Number(numberOfSwimmers);
        const start = Math.floor((pool.userData.specification.lanes - size) / 2);
        const end = start + Number(size) - 1;
        for (let i = 0; i < swimmers.length; i++) {
            if (i < start || i > end) {
                swimmers[i].visible = false;
            } else {
                swimmers[i].visible = true;
            }
        }
    }
};

const watchForChange = (settings, state, world, gui) => {
    onSettingsChange(settings, state, world);
    watch(state, (state) => {
        const { current, previous } = state;

        if (gui) {
            world.state = current;
            gui.updateDisplay();
        }

        onStateChange(settings, current, previous, world);
    });

    watch(settings, (settings) => {
        onSettingsChange(settings, state, world);
    });
};

export { watchForChange };
