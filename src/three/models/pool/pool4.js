import * as THREE from "three";
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader';
import { dumpGeometry, getGeometry } from "@/three/utils.js";

/*
 * https://3dwarehouse.sketchup.com/model/93a0210ce458dbb4c90e1681ced8feb6/Olympic-Swimming-Pool
 *
 * Bounds: {"x":32.5679996826172,"y":4.393397858551905,"z":57.26960200195313}
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
    title: "Merced Community College Olympic Swimming Pool - wwwjeafcom",
    url: "https://3dwarehouse.sketchup.com/model/741ab83f80faed7bb2bd73bd0d73a5ed/Merced-Community-College-Olympic-Swimming-Pool",
    id: "pool:4",
    corner: new THREE.Vector3(3.625, 3.35, 3.7),
    get rightLane() {
        return new THREE.Vector3(this.corner.x, this.corner.y + 1.6, this.corner.z);
    },
    lanes: 8,
    laneWidth: 2.83,
};

const make = (manager) => {
    return new Promise((resolve, reject) => {
        const mtlLoader = new ColladaLoader(manager);
        const url = import.meta.env.BASE_URL + "models/pools/pool-4/";
        mtlLoader.setPath(url);

        mtlLoader.load("model.dae", (result) => {
            try {
                const model = result.scene;

                model.name = specification.id;
                model.rotateX(Math.PI / 2);
                model.rotateZ(-Math.PI / 2);
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

