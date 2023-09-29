import { ColladaLoader } from "three/examples/jsm/loaders/ColladaLoader";

class BlockModel {
    static generate(manager, lanes = 1) {
        return new Promise((resolve, reject) => {
            const mtlLoader = new ColladaLoader(manager);
            const url = import.meta.env.BASE_URL + "models/block/";

            mtlLoader.setPath(url);

            mtlLoader.load("model.dae", (result) => {
                try {
                    const block = result.scene.children[0];
                    block.rotateZ(Math.PI / 2);

                    resolve(block);
                } catch (e) {
                    console.log(e);
                }
            });
        });
    }
}

export { BlockModel };
