import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'

class SwimmerModel {
    static generateFromFbx(manager) {
        return new Promise((resolve, reject) => {
            const fbxLoader = new FBXLoader(manager);
            const url = import.meta.env.BASE_URL + 'models/swimmer/';

            fbxLoader.setPath(url);

            fbxLoader.load("swimmer-01.fbx", (result) => {
                try {
                    const swimmer = result;
                    swimmer.rotateZ(Math.PI / 2);
                    swimmer.rotateX(Math.PI / 2);
                    //swimmer.scale.set(0.3, 0.3, 0.3);

                    resolve(swimmer); 
                } catch (e) {
                    console.log(e);
                }
            });
        });
    }

    /* this does not work with the animations from blender */
    static generateFromDae(manager) {
        return new Promise((resolve, reject) => {
            const mtlLoader = new ColladaLoader(manager);
            const url = import.meta.env.BASE_URL + "models/swimmer/";
            mtlLoader.setPath(url);

            mtlLoader.load("swimmer-01.dae", (result) => {
                try {
                    const swimmer = result.scene;
                    resolve(swimmer);
                } catch (e) {
                    console.log(e);
                }
            });
        });
    }

    static generate(manager) {
        return SwimmerModel.generateFromFbx(manager);
    }
}

export { SwimmerModel };
