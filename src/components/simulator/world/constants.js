/**
 * This module contains constants used throughout the application.
 * @module constants
 */

import * as THREE from "three";

/**
 * An object containing constants related to the pool.
 * @type {Object}
 * @property {THREE.Vector3} corner - The corner position of the pool.
 * @property {THREE.Vector3} rightLane - The position of the right most lane of the pool.
 * @property {number} laneWidth - The width of each lane in the pool.
 */
const POOL0 = {
    corner: new THREE.Vector3(21.610, 17.1, 3.75),
    get rightLane() {
        return new THREE.Vector3(this.corner.x, this.corner.y + 1.31, this.corner.z);
    },
    laneWidth: 2.83,
};


const POOL1 = {
    corner: new THREE.Vector3(1645., 3290., 110.),
    get rightLane() {
        return new THREE.Vector3(this.corner.x, this.corner.y , this.corner.z);
    },
    laneWidth: 223,
};

const POOL2 = {
    corner: new THREE.Vector3(28, 29, 3.75),
    get rightLane() {
        return new THREE.Vector3(this.corner.x, this.corner.y + 105, this.corner.z);
    },
    laneWidth: 223,
};

const POOL = POOL2;

export { POOL };
