import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'

class SwimmerModel {
    static generateFromFbx(manager) {
        return new Promise((resolve, reject) => {
            const fbxLoader = new FBXLoader(manager);
            const url = import.meta.env.BASE_URL + 'models/swimmer/';

            fbxLoader.setPath(url);

            fbxLoader.load("swimmer-01.fbx", (result) => {
                try {
                    const model = result;
                    model.rotateZ(Math.PI / 2);
                    model.rotateX(Math.PI / 2);
                    //swimmer.scale.set(0.3, 0.3, 0.3);

                    resolve(model); 
                } catch (e) {
                    console.log(e);
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
