import { maker as poolZeroMaker } from "./pool0";
import { maker as poolTwoMaker } from "./pool2";

const makers = [];
makers[poolZeroMaker.meta.id] = poolZeroMaker.make;
makers[poolTwoMaker.meta.id] = poolTwoMaker.make;

function makePoolModel(manager, id) {
    return makers[id](manager);
}

export { makePoolModel };