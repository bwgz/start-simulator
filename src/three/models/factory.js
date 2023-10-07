import * as SkeletonUtils from "three/addons/utils/SkeletonUtils.js";
import { makeBlockModel } from "./block";
import { ChairModel } from "./chair";
import { makePoolModel } from "./pool";
import { makeSwimmerModel } from "./swimmer";

const MAKE = {
    POOL: "pool",
    BLOCK: "block",
    CHAIR: "chair",
    SWIMMER: "swimmer",
};

const normalCloner = (model) => model.clone();
const skeletionCloner = (model) => SkeletonUtils.clone(model);

function makeClones(name, template, cloner, count = 1) {
    const clones = [];
    clones.push(template);

    for (let i = 0; i < count - 1; i++) {
        const clone = cloner(template);
        clones.push(clone);
    }

    return clones;
}

function bundleOrder(make, template, items) {
    return {
        make,
        template,
        items,
    };
}
function makePoolModels(manager, id, count) {
    return makePoolModel(manager, id).then((template) => {
        const clones = makeClones(MAKE.POOL, template, normalCloner, count);
        return bundleOrder(MAKE.POOL, template, clones);
    });
}

function makeBlockModels(manager, id, count) {
    return makeBlockModel(manager, id).then((template) => {
        const clones = makeClones(template.name, template, normalCloner, count);
        return bundleOrder(MAKE.BLOCK, template, clones);
    });
}

function makeChairModels(manager, count) {
    return ChairModel.generate(manager).then((template) => {
        const clones = makeClones(template.name, template, normalCloner, count);
        return bundleOrder(MAKE.CHAIR, template, clones);
    });
}

function makeSwimmerModels(manager, id, count) {
    return makeSwimmerModel(manager, id).then((template) => {
        const clones = makeClones(template.name, template, skeletionCloner, count);
        return bundleOrder(MAKE.SWIMMER, template, clones);
    });
}

function makeAllModels(manager, settings) {
    const { pool, block, swimmer } = settings;

    return makePoolModel(manager, pool.id).then((pool) => {
        const { lanes } = pool.userData.specification;
        const blocks = makeBlockModels(manager, block.id, lanes);
        const swimmers = makeSwimmerModels(manager, swimmer.id, lanes);

        return Promise.allSettled([blocks, swimmers]).then((models) => {
            const blocks = models[0].value.items;
            const swimmers = models[1].value.items;
            return {
                pool,
                blocks,
                swimmers,
            };
        });
    });
}

export { MAKE, makeAllModels };
