import { maker as omegaMaker } from "./omega";

const makers = [];
makers[omegaMaker.id] = omegaMaker.make;

function makeBlockModel(manager, id) {
    return makers[id](manager);
}

export { makeBlockModel };