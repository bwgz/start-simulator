import * as SkeletonUtils from "three/addons/utils/SkeletonUtils.js";
import { BlockModel, ChairModel, PoolModel, SwimmerModel } from ".";

function loadModels(manager) {

    const poolPromise = PoolModel.generate(manager);
    const blockPromise = BlockModel.generate(manager);
    const chairPromise = ChairModel.generate(manager);
    const swimmerPromise = SwimmerModel.generate(manager);

    return Promise.all([poolPromise, blockPromise, chairPromise, swimmerPromise]);
}

const generateModelName = (name, index) => name + ":" + index;

function createModels(manager, lanes) {
    return loadModels(manager)
        .then((models) => {
            const result = {
                pool: null,
                blocks: [],
                chairs: [],
                swimmers: [],
            };
            for (const model of models) {
                const { name } = model;
                switch (name) {
                    case "pool":
                        result.pool = model;
                        break;
                    case "block":
                        const { blocks } = result;

                        for (let i = 0; i < lanes; i++) {
                            const clone = model.clone();
                            clone.name = generateModelName(name, i);

                            blocks.push(clone);
                        }
                        break;
                    case "chair":
                        const { chairs } = result;

                        for (let i = 0; i < lanes; i++) {
                            const clone = model.clone();
                            clone.name = generateModelName(name, i);

                            chairs.push(clone);
                        }
                        break;
                    case "swimmer":
                        const { swimmers } = result;
                        for (let i = 0; i < lanes; i++) {
                            const clone = SkeletonUtils.clone(model);
                            clone.name = generateModelName(name, i);
                            swimmers.push(clone);
                            //const mixer = new THREE.AnimationMixer(clone);
                            //mixers.push(mixer);
                        }
                        break;
                }
            }
            return result;
        });
}

export { loadModels, createModels };
