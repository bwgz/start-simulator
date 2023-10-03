import * as THREE from "three";

const CAMERA_NAMES = {
    STARTER: "starter",
    DOWN_THE_LINE: "downTheLine",
    OVERHEAD: "overhead",
    FIVE_METER: "5Meter",
    FIFTEEN_METER: "15Meter",
    DECK_CHECK: "deckCheck",
};

const cameraLocations = [];
cameraLocations[CAMERA_NAMES.STARTER] = (pool) => {
    const { corner, laneWidth } = pool;
    return {
        position: corner.clone().add(new THREE.Vector3(150, -100, 150)),
        lookAt: corner.clone().add(new THREE.Vector3(-70, laneWidth * 3, 100)),
    };
};

cameraLocations[CAMERA_NAMES.DOWN_THE_LINE] = (pool) => {
    const { corner } = pool;

    return {
        position: corner.clone().add(new THREE.Vector3(0, -200, 150)),
        lookAt: corner.clone().add(new THREE.Vector3(0, 2000, 0)),
    };
};

cameraLocations[CAMERA_NAMES.OVERHEAD] = (pool) => {
    const { rightLane, laneWidth } = pool;
    return {
        position: rightLane.clone().add(new THREE.Vector3(0, laneWidth / 2, 200)),
        lookAt: rightLane.clone().add(new THREE.Vector3(0, laneWidth / 2, 0)),
    };
};

cameraLocations[CAMERA_NAMES.FIVE_METER] = (pool) => {
    const { rightLane, laneWidth } = pool;
    return {
        position: rightLane.clone().add(new THREE.Vector3(500, laneWidth * 4, 200)),
        lookAt: rightLane.clone().add(new THREE.Vector3(0,  laneWidth * 4, 0)),
    };
};

cameraLocations[CAMERA_NAMES.FIFTEEN_METER] = (pool) => {
    const { rightLane, laneWidth } = pool;
    return {
        position: rightLane.clone().add(new THREE.Vector3(1500, laneWidth * 4, 200)),
        lookAt: rightLane.clone().add(new THREE.Vector3(0,  laneWidth * 4, 0)),
    };
};

cameraLocations[CAMERA_NAMES.DECK_CHECK] = (pool) => {
    const { rightLane, laneWidth } = pool;
    return {
        position: rightLane.clone().add(new THREE.Vector3(0 - 50, 0, 0)),
        lookAt: rightLane.clone().add(new THREE.Vector3(0 - 50, 2000, 0)),
    };
};


function createPerspectiveCamera(name, fov, aspect, near, far, location) {
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.up.set(0, 0, 1);
    camera.name = name;
    camera.position.copy(location.position);
    camera.lookAt(location.lookAt);

    return camera;
}

function createCameras(pool, width, height) {
    const cameras = [];
    cameras[CAMERA_NAMES.STARTER] = createPerspectiveCamera(
        CAMERA_NAMES.STARTER,
        70,
        width / height,
        1,
        7000,
        cameraLocations[CAMERA_NAMES.STARTER](pool)
    );
    cameras[CAMERA_NAMES.DOWN_THE_LINE] = createPerspectiveCamera(
        CAMERA_NAMES.DOWN_THE_LINE,
        70,
        width / height,
        1,
        7000,
        cameraLocations[CAMERA_NAMES.DOWN_THE_LINE](pool)
    );
    cameras[CAMERA_NAMES.OVERHEAD] = createPerspectiveCamera(
        CAMERA_NAMES.OVERHEAD,
        70,
        width / height,
        1,
        7000,
        cameraLocations[CAMERA_NAMES.OVERHEAD](pool)
    );
    cameras[CAMERA_NAMES.FIVE_METER] = createPerspectiveCamera(
        "fiveMeter",
        70,
        width / height,
        1,
        7000,
        cameraLocations[CAMERA_NAMES.FIVE_METER](pool)
    );

    cameras[CAMERA_NAMES.FIFTEEN_METER] = createPerspectiveCamera(
        CAMERA_NAMES.FIFTEEN_METER,
        70,
        width / height,
        1,
        7000,
        cameraLocations[CAMERA_NAMES.FIFTEEN_METER](pool)
    );
    cameras[CAMERA_NAMES.DECK_CHECK] = createPerspectiveCamera(
        CAMERA_NAMES.DECK_CHECK,
        70,
        width / height,
        1,
        7000,
        cameraLocations[CAMERA_NAMES.DECK_CHECK](pool)
    );
    return cameras;
}

function updateCameras(cameras, width, height) {
    const aspect = width / height;

    cameras.forEach((camera) => {
        camera.aspect = aspect;
        camera.updateProjectionMatrix();
    });
}

export { CAMERA_NAMES, createCameras, updateCameras };
