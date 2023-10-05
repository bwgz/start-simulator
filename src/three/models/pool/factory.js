import { maker } from "./pool0";

const makers = [];
makers[maker.meta.id] = maker.make;

function makePoolModel(manager, id) {
    return makers[id](manager);
}

export { makePoolModel };