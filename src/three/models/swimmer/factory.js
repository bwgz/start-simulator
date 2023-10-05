import { maker as xbot } from "./xbot";

const makers = [];
makers[xbot.id] = xbot.make;

function makeSwimmerModel(manager, id) {
    return makers[id](manager);
}

export { makeSwimmerModel };