import * as THREE from "three";

const CAMERA_NAMES = {
    STARTER: "starter",
    DOWN_THE_LINE: "downTheLine",
    OVERHEAD: "overhead",
    FIVE_METER: "5Meter",
    FIFTEEN_METER: "15Meter",
    DECK_CHECK: "deckCheck",
    CORNER: "corner",
    RIGHT_LANE: "rightLane",
    LANE: "lane",
    ORIGIN: "origin",
};

const cameraLocations = [];
cameraLocations[CAMERA_NAMES.STARTER] = (pool) => {
    const { corner, rightLane, laneWidth } = pool;
    return {
        position: corner.clone().add(new THREE.Vector3(2, -2, 2)),
        lookAt: rightLane.clone().add(new THREE.Vector3(0, (laneWidth * 3), 0)),
    };
};

cameraLocations[CAMERA_NAMES.DOWN_THE_LINE] = (pool) => {
    const { corner } = pool;

    return {
        position: corner.clone().add(new THREE.Vector3(0, -4, 1)),
        lookAt: corner.clone().add(new THREE.Vector3(0, 2000, 0)),
    };
};

cameraLocations[CAMERA_NAMES.OVERHEAD] = (pool) => {
    const { rightLane, laneWidth } = pool;
    return {
        position: rightLane.clone().add(new THREE.Vector3(0, laneWidth / 2, 2)),
        lookAt: rightLane.clone().add(new THREE.Vector3(0, laneWidth / 2, 0)),
    };
};

cameraLocations[CAMERA_NAMES.FIVE_METER] = (pool) => {
    const { rightLane, laneWidth } = pool;
    return {
        position: rightLane.clone().add(new THREE.Vector3(5, laneWidth * 4, 2)),
        lookAt: rightLane.clone().add(new THREE.Vector3(0,  laneWidth * 4, 0)),
    };
};

cameraLocations[CAMERA_NAMES.FIFTEEN_METER] = (pool) => {
    const { rightLane, laneWidth } = pool;
    return {
        position: rightLane.clone().add(new THREE.Vector3(15, laneWidth * 4, 3)),
        lookAt: rightLane.clone().add(new THREE.Vector3(0,  laneWidth * 4, 0)),
    };
};

cameraLocations[CAMERA_NAMES.DECK_CHECK] = (pool) => {
    const { rightLane, laneWidth } = pool;
    return {
        position: rightLane.clone().add(new THREE.Vector3(0 - 25, 0, 0)),
        lookAt: rightLane.clone().add(new THREE.Vector3(0 - 50, 2000, 0)),
    };
};

cameraLocations[CAMERA_NAMES.DECK_CHECK] = (pool) => {
    const { rightLane, laneWidth } = pool;
    return {
        position: rightLane.clone().add(new THREE.Vector3(0.5, 0, 0)),
        lookAt: rightLane.clone().add(new THREE.Vector3(0.5, 2000, 0)),
    };
};

cameraLocations[CAMERA_NAMES.CORNER] = (pool) => {
    const { corner } = pool;
    return {
        position: corner.clone().add(new THREE.Vector3(0, 0, 1.5)),
        lookAt: corner.clone(),
    };
};

cameraLocations[CAMERA_NAMES.RIGHT_LANE] = (pool) => {
    const { rightLane } = pool;
    return {
        position: rightLane.clone().add(new THREE.Vector3(0, 0, 1.5)),
        lookAt: rightLane.clone(),
    };
};


cameraLocations[CAMERA_NAMES.ORIGIN] = (pool) => {
    const { corner } = pool;
    return {
        position: new THREE.Vector3(corner.x, corner.y, corner.z + 10),
        lookAt: new THREE.Vector3(corner.x, corner.y, corner.z),
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
    cameras[CAMERA_NAMES.CORNER] = createPerspectiveCamera(
        CAMERA_NAMES.CORNER,
        70,
        width / height,
        1,
        7000,
        cameraLocations[CAMERA_NAMES.CORNER](pool)
    );
    cameras[CAMERA_NAMES.RIGHT_LANE] = createPerspectiveCamera(
        CAMERA_NAMES.RIGHT_LANE,
        70,
        width / height,
        1,
        7000,
        cameraLocations[CAMERA_NAMES.RIGHT_LANE](pool)
    );

    cameras[CAMERA_NAMES.ORIGIN] = createPerspectiveCamera(
        CAMERA_NAMES.ORIGIN,
        70,
        width / height,
        1,
        7000,
        cameraLocations[CAMERA_NAMES.ORIGIN](pool)
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
