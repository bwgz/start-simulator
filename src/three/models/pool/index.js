import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader';
import { dumpGeometry } from "../../utils";

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
                    dumpGeometry("one", pool);
                    pool.position.x += 28767.52;
                    pool.position.y += 28489.18;
                    pool.position.z += 291.2756042480469;
                    //pool.position.set(-22874.538299814685 / 2, -248.06302092284596 / 2, 787.4016460937391 / 2);
                    dumpGeometry("moved", pool);
                    //pool.scale.set(2, 2, 2)
                    //("scaled", pool);
                    //pool.rotateX(Math.PI / 2);
                   // pool.rotateY(Math.PI / 2);
                    //pool.position.set(-22874.538299814685, -21831, 787.4016460937391);
                    //dumpGeometry("three", pool);

                    resolve(pool);
                } catch (e) {
                    console.log(e);
                }
            });
        });
    }
}

export { PoolModel };

/*
                    const pool = result.scene;
                    pool.rotateX(Math.PI / 2);
                    dumpGeometry("one", pool);
                    pool.position.x += (365.347504)
                    pool.position.y += 361.812586;
                    pool.position.z += 3.699200173950195;
*/