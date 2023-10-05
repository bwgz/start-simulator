import * as SkeletonUtils from "three/addons/utils/SkeletonUtils.js";
import { BlockModel } from "./block";
import { ChairModel } from "./chair";
import { makePoolModel } from "./pool";
import { SwimmerModel } from "./swimmer";

const generateModelName = (name, index) => name + ":" + index;

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
        clone.name = generateModelName(name, i);
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

function makeBlockModels(manager, count) {
    return BlockModel.generate(manager).then((template) => {
        const clones = makeClones(MAKE.BLOCK, template, normalCloner, count);
        return bundleOrder(MAKE.BLOCK, template, clones);
    });
}

function makeChairModels(manager, count) {
    return ChairModel.generate(manager).then((template) => {
        const clones = makeClones(MAKE.BLOCK, template, normalCloner, count);
        return bundleOrder(MAKE.CHAIR, template, clones);
    });
}

function makeSwimmerModels(manager, count) {
    return SwimmerModel.generate(manager).then((template) => {
        const clones = makeClones(MAKE.BLOCK, template, skeletionCloner, count);
        return bundleOrder(MAKE.SWIMMER, template, clones);
    });
}

function makeAllModels(manager, settings) {
    const { lanes, id } = settings.pool;
    const pools = makePoolModels(manager, id, 1);
    const blocks = makeBlockModels(manager, lanes);
    const chairs = makeChairModels(manager, lanes);
    const swimmers = makeSwimmerModels(manager, lanes);

    return Promise.allSettled([pools, blocks, chairs, swimmers]).then((orders) => orders.map((order) => order.value));
}

export { MAKE, makeAllModels };
