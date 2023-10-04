import * as THREE from "three";
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader';
import { dumpGeometry } from "@/three/utils.js";

/*
 * https://3dwarehouse.sketchup.com/model/93a0210ce458dbb4c90e1681ced8feb6/Olympic-Swimming-Pool
 *
 * Bounds: 67,225 x 88,090 x 13,699
 * Distance: from Origin 459,304.3
 * Units of Measure: millimeter
 */


class PoolModel2 {
    static generate(manager) {
        return new Promise((resolve, reject) => {
            const mtlLoader = new ColladaLoader(manager);
            const url = import.meta.env.BASE_URL + "models/pools/pool-2/";
            mtlLoader.setPath(url);

            mtlLoader.load("model.dae", (result) => {
                try {
                    const model = result.scene;

                    model.name = "pool";
                    model.rotateX(Math.PI / 2);
                    model.rotateZ(-Math.PI / 2);

                    dumpGeometry("original", model);

                    //model.scale.set(10, 10, 10);
                    //dumpGeometry("scaled", model);
                    
                    const boundingBox = new THREE.Box3();
                    boundingBox.setFromObject(model);
                    const min = boundingBox.min;
 
                    model.position.x += min.x * -1;
                    model.position.y += min.y * -1;
                    model.position.z += min.z * -1;
                    dumpGeometry("transform", model);


                    resolve(model);
                } catch (e) {
                    console.error(e);
                    reject(e);
                }
            });
        });
    }
}

export { PoolModel2 };

