import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader';

class ChairModel {
    static generate(manager) {
        return new Promise((resolve, reject) => {
            const mtlLoader = new ColladaLoader(manager);
            const url = import.meta.env.BASE_URL + "models/chair/";
            mtlLoader.setPath(url);

            mtlLoader.load("model.dae", (result) => {
                try {
                    const chair = result.scene;
                    chair.rotateX(Math.PI / 2);
                    chair.rotateZ(Math.PI / 2);
                    chair.scale.set(3, 3, 3);
                    resolve(chair);
                } catch (e) {
                    console.log(e);
                }
            });
        });
    }
}

export { ChairModel };
