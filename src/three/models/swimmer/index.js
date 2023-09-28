import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'

class SwimmerModel {
    static generate(manager) {
        return new Promise((resolve, reject) => {
            const fbxLoader = new FBXLoader(manager);
            const url = import.meta.env.BASE_URL + 'models/swimmer/';

            fbxLoader.setPath(url);

            fbxLoader.load("swimmer-3.fbx", (result) => {
                try {
                    const swimmer = result;
                    swimmer.rotateZ(Math.PI / 2);
                    swimmer.rotateX(Math.PI / 2);
                    swimmer.scale.set(0.3, 0.3, 0.3);
                    //swimmer.position.set(-19, 10, 16);

                    resolve(swimmer); 
                } catch (e) {
                    console.log(e);
                }
            });
        });
    }
}

export { SwimmerModel };
