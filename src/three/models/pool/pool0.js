import * as THREE from "three";
import { ColladaLoader } from "three/examples/jsm/loaders/ColladaLoader";
import { dumpGeometry, getGeometry } from "@/three";

/*
 * Bounds: 67,225 x 88,090 x 13,699
 * Distance: from Origin 459,304.3
 * Units of Measure: millimeter
 */

/**
 * An object containing constants related to the pool.
 * @type {Object}
 * @property {THREE.Vector3} corner - The corner position of the pool.
 * @property {THREE.Vector3} rightLane - The position of the right most lane of the pool.
 * @property {number} laneWidth - The width of each lane in the pool.
 */
const specification = {
    title: "Olympic Swimming Pool",
    url: "https://3dwarehouse.sketchup.com/model/93a0210ce458dbb4c90e1681ced8feb6/Olympic-Swimming-Pool",
    id: "pool:0",
    corner: new THREE.Vector3(15.61, 17.1, 3.75),
    get rightLane() {
        return new THREE.Vector3(this.corner.x, this.corner.y + 1.31, this.corner.z);
    },
    lanes: 8,
    laneWidth: 2.83,
};

const make = (manager) => {
    return new Promise((resolve, reject) => {
        const mtlLoader = new ColladaLoader(manager);
        const url = import.meta.env.BASE_URL + "models/pools/pool-0/";
        mtlLoader.setPath(url);

        mtlLoader.load("model.dae", (result) => {
            try {
                const model = result.scene;

                model.name = "pool";
                model.rotateX(Math.PI / 2);
                //dumpGeometry("original", model);

                const boundingBox = new THREE.Box3();
                boundingBox.setFromObject(model);
                const min = boundingBox.min;

                model.position.x += min.x * -1;
                model.position.y += min.y * -1;
                model.position.z += min.z * -1;
                //dumpGeometry("transform", model);

                model.userData = {
                    specification,
                    geometry: getGeometry(model)
                };
        
                resolve(model);
            } catch (e) {
                console.error(e);
                reject(e);
            }
        });
    });
};

const maker = {
    id: specification.id,
    specification,
    make,
};

export { maker };
