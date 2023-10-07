import * as THREE from "three";

function createLights(pool) {
    const lights = [];
    const { rightLane, laneWidth } = pool;
    for (let i = 0; i < pool.lanes; i++) {
        const light = new THREE.DirectionalLight(0xffffff, 0.5);
        const position = rightLane.clone().add(new THREE.Vector3(2, laneWidth * i, 5));
        const lookAt = rightLane.clone().add(new THREE.Vector3(0, laneWidth * i, 0));
        light.position.copy(position);
        light.lookAt(lookAt);
        lights.push(light);
    }
    return lights;
}

export { createLights };
