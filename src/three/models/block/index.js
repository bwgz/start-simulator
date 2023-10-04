import * as THREE from "three";
import { ColladaLoader } from "three/examples/jsm/loaders/ColladaLoader";
import { dumpGeometry } from "@/three/utils.js";

/*
 * https://www.swisstiming.com/fileadmin/Resources/Data/Datasheets/DOCM_AQ_OSB11_anTiSlip_0519.pdf
 * https://www.swisstiming.com/fileadmin/Resources/Instruction_Manuals/3454.504.02.pdf
 *
 * OMEGA OSB11 – SWIMMING STARTING BLOCK
 * Overall length x width : 780 x 640 mm
 * Top plate length x width : 740 x 520 mm
 * Height : max. 650 mm
 *
 * This model does not fully confirm to the OMEGA OSB11 specifications. It's close but not exact.
 */

const length = 78.0; // cm - model's y axis
const width = 64.0; // cm - model's x axis
const height = 74.0; // cm - model's z axis

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

                    let boundingBox = new THREE.Box3();
                    const size = new THREE.Vector3();
                    boundingBox.setFromObject(model).getSize(size);

                    // correct size and scale to meters (original is centimeters)
                    model.scale.set(width / size.y / 100, length / size.x / 100, height / size.z / 100);
                    dumpGeometry("scaled", model);

                    boundingBox = new THREE.Box3();
                    boundingBox.setFromObject(model);
                    let min = boundingBox.min;

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

export { BlockModel };
