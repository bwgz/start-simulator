import { maker as poolZeroMaker } from "./pool0";
import { maker as poolTwoMaker } from "./pool2";
import { maker as poolFourMaker } from "./pool4";

const makers = [];
makers[poolZeroMaker.id] = poolZeroMaker.make;
makers[poolTwoMaker.id] = poolTwoMaker.make;
makers[poolFourMaker.id] = poolFourMaker.make;

function makePoolModel(manager, id) {
    return makers[id](manager);
}

export { makePoolModel };