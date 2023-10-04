import * as THREE from "three";
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader';
import { dumpGeometry } from "@/three/utils.js";

/*
 * https://3dwarehouse.sketchup.com/model/fa68af35-dd16-4996-9f37-b51f7ae2ace0/Sandler-Folding-Chair
 * 2418USB-A
 * SANDLER MULTI-PURPOSE COLLECTION
 * Folding chair
 * Height: 85cm
 * Width 46cm
 * Depth 52cm
 * Seat Height 47cm
*/

const width = 46.0; // cm

class ChairModel {
    static generate(manager) {
        return new Promise((resolve, reject) => {
            const mtlLoader = new ColladaLoader(manager);
            const url = import.meta.env.BASE_URL + "models/chair/";
            mtlLoader.setPath(url);

            mtlLoader.load("model.dae", (result) => {
                try {
                    const model = result.scene.children[0];
                    model.name = "chair";
                    model.rotateZ(Math.PI / 2);
                    //dumpGeometry("original", model);

                    let boundingBox = new THREE.Box3();
                    const size = new THREE.Vector3();
                    boundingBox.setFromObject(model).getSize(size);
                    const scale = width / size.y;
                    model.scale.set(scale, scale, scale);
                    //dumpGeometry("scaled", model);

                    boundingBox = new THREE.Box3();
                    boundingBox.setFromObject(model);
                    let min = boundingBox.min;
 
                    model.position.x += min.x * -1;
                    model.position.y += min.y * -1;
                    model.position.z += min.z * -1;

                    resolve(model);
                } catch (e) {
                    console.error(e);
                    reject(e);
                }
            });
        });
    }
}

export { ChairModel };
