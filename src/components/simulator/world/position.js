import * as THREE from "three";
import { MAKE } from "@/three";

function getDimensions(model) {
    const object = Array.isArray(model) ? model[0] : model;
    const position = object.position.clone();
    const bounds = new THREE.Box3();
    const size = new THREE.Vector3();
    bounds.setFromObject(object).getSize(size);

    return {
        position,
        bounds,
        size,
    };
}

function positionObject(objects, position, width) {
    objects.forEach((object) => {
        object.position.copy(position);
        position.add(new THREE.Vector3(0, width, 0));
    });
}

function positionBlocks(pool, blocks) {
    const { laneWidth, rightLane } = pool;
    const { position, bounds, size } = getDimensions(blocks);

    // start at the right edge of lane 1
    // x, y, z normalizes the block to the pool deck and
    // move the block to the center of the lane
    const x = position.x - bounds.max.x;
    const y = position.y - bounds.min.y + (laneWidth - size.y) / 2;
    const z = position.z - bounds.min.z - 0.01; // deck is slanted and need to go a little lower
    const lane = rightLane.clone().add(new THREE.Vector3(x, y, z));

    positionObject(blocks, lane, laneWidth)
}

function positionChairs(pool, chairs) {
    const { laneWidth, rightLane } = pool;
    const { position, bounds, size } = getDimensions(chairs);

    // start at the right edge of lane 1
    // x, y, z normalizes the block to the pool deck and
    const x = position.x - bounds.max.x - 350;
    const y = (laneWidth - size.y) / 2 + 10;
    const z = position.z - bounds.min.z;
    const lane = rightLane.clone().add(new THREE.Vector3(x, y, z));

    positionObject(chairs, lane, laneWidth)
}

function positionSwimmers(pool, swimmers) {
    const { laneWidth, rightLane } = pool;
    const { position, bounds, size } = getDimensions(swimmers);

    // start at the right edge of lane 1
    // x, y, z normalizes the block to the pool deck and
    // move the block to the center of the lane
    const x = position.x - bounds.max.x - 1;
    const y = position.y - bounds.min.y + (laneWidth - size.y) / 2;
    const z = position.z - bounds.min.z - 0.01; // deck is slanted and need to go a little lower
    const lane = rightLane.clone().add(new THREE.Vector3(x, y, z));

    positionObject(swimmers, lane, laneWidth)
}

function positionModels( models) {
    const { pool, blocks, swimmers } = models;
    const { specification, geometry } = pool.userData;
    positionBlocks(specification, blocks);
    positionSwimmers(specification, swimmers);
}

export { positionModels };
