import * as THREE from "three";
import { ColladaLoader } from "three/examples/jsm/loaders/ColladaLoader";
import { dumpGeometry } from "@/three/utils.js";

/*
 * https://3dwarehouse.sketchup.com/model/93a0210ce458dbb4c90e1681ced8feb6/Olympic-Swimming-Pool
 *
 * Bounds: 67,225 x 88,090 x 13,699
 * Distance: from Origin 459,304.3
 * Units of Measure: millimeter
 */

class PoolModel0 {
    static generate(manager) {
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

                    // scaled 1 - size: {"x":3468.097900390625,"y":2646.669519760133,"z":539.3386251708985}
                    // scaled 10 - size: {"x":34680.97900390625,"y":26466.695197601322,"z":5393.386251708985}

                    //const scale = 1;// / model.scale.x;
                    //model.scale.set(scale, scale, scale);
                    //dumpGeometry("scaled", model);

                    const boundingBox = new THREE.Box3();
                    boundingBox.setFromObject(model);
                    const min = boundingBox.min;

                    model.position.x += min.x * -1;
                    model.position.y += min.y * -1;
                    model.position.z += min.z * -1;
                    //dumpGeometry("transform", model);

                    resolve(model);
                } catch (e) {
                    console.error(e);
                    reject(e);
                }
            });
        });
    }
}

export { PoolModel0 };
