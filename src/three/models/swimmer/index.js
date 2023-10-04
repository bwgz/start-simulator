import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { dumpGeometry } from "@/three/utils.js";

/*
 * On a global scale, the average height of men is around 5 feet 9 inches (175 cm), 
 * while the average height of women is around 5 feet 4 inches (162 cm). 
 */
class SwimmerModel {
    static generateFromFbx(manager) {
        return new Promise((resolve, reject) => {
            const fbxLoader = new FBXLoader(manager);
            const url = import.meta.env.BASE_URL + 'models/swimmer/';

            fbxLoader.setPath(url);

            fbxLoader.load("swimmer-01.fbx", (result) => {
                try {
                    const model = result;
                    model.name = "swimmer";
                    model.rotateZ(Math.PI / 2);
                    model.rotateX(Math.PI / 2);
                    //dumpGeometry("original swimmer", model);

                    model.scale.set(0.01, 0.01, 0.01)
                    //dumpGeometry("scaled swimmer", model);

                    resolve(model); 
                } catch (e) {
                    console.error(e);
                    reject(e);
                }
            });
        });
    }

    static generate(manager) {
        return SwimmerModel.generateFromFbx(manager).then((model) => {
            model.name = "swimmer";
            return model;
        });
    }
}

export { SwimmerModel };
