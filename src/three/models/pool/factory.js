import { maker as poolZeroMaker } from "./pool0";
import { maker as poolTwoMaker } from "./pool2";

const makers = [];
makers[poolZeroMaker.id] = poolZeroMaker.make;
makers[poolTwoMaker.id] = poolTwoMaker.make;

function makePoolModel(manager, id) {
    return makers[id](manager);
}

export { makePoolModel };