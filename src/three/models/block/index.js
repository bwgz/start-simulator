import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader';

class BlockModel {
    static generate(manager) {
        return new Promise((resolve, reject) => {
            const mtlLoader = new ColladaLoader(manager);
            mtlLoader.setPath("/models/block/");

            mtlLoader.load("model.dae", (result) => {
                try {
                    const block = result.scene.children[0];
                    block.rotateZ(Math.PI / 2);
                    block.position.set(0, 0, -10);


                    resolve(block); 
                } catch (e) {
                    console.log(e);
                }
            });
        });
    }
}

export { BlockModel };
