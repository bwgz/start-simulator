import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader';

class ChairModel {
    static generate(manager) {
        return new Promise((resolve, reject) => {
            const mtlLoader = new ColladaLoader(manager);
            const url = import.meta.env.BASE_URL + "models/chair/";
            mtlLoader.setPath(url);

            mtlLoader.load("model.dae", (result) => {
                try {
                    const model = result.scene;
                    model.name = "chair";
                    model.rotateX(Math.PI / 2);
                    model.rotateZ(Math.PI / 2);
                    model.scale.set(3, 3, 3);
                    resolve(model);
                } catch (e) {
                    console.log(e);
                    reject(e);
                }
            });
        });
    }
}

export { ChairModel };
