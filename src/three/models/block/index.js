import * as THREE from "three";
import { ColladaLoader } from "three/examples/jsm/loaders/ColladaLoader";
import { dumpGeometry } from "@/three/utils.js";

class BlockModel {
    static generate(manager) {
        return new Promise((resolve, reject) => {
            const mtlLoader = new ColladaLoader(manager);
            const url = import.meta.env.BASE_URL + "models/block/";

            mtlLoader.setPath(url);

            mtlLoader.load("model.dae", (result) => {
                try {
                    const model = result.scene.children[0];
                    model.name = "block";
                    model.rotateZ(Math.PI / 2);

                    dumpGeometry("original", model);

                    model.scale.set(4, 4, 4);
                    dumpGeometry("scaled", model);
                    
                    const boundingBox = new THREE.Box3();
                    boundingBox.setFromObject(model);
                    let min = boundingBox.min;
 
                    model.position.x += min.x * -1;
                    model.position.y += min.y * -1;
                    model.position.z += min.z * -1;
                    dumpGeometry("transform", model);

                    resolve(model);
                } catch (e) {
                    console.log(e);
                    reject(e);
                }
            });
        });
    }
}

export { BlockModel };
