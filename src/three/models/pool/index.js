import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader';

class PoolModel {
    static generate(manager) {
        return new Promise((resolve, reject) => {
            const mtlLoader = new ColladaLoader(manager);
            const url = import.meta.env.BASE_URL + "models/pool/";
            mtlLoader.setPath(url);

            mtlLoader.load("model.dae", (result) => {
                try {
                    const pool = result.scene;
                    pool.rotateX(Math.PI / 2);
                    pool.scale.set(2, 2, 2);
                    pool.position.x += 28767.52;
                    pool.position.y += 28489.18;
                    pool.position.z += 291.2756042480469;

                    resolve(pool);
                } catch (e) {
                    console.log(e);
                }
            });
        });
    }
}

export { PoolModel };

