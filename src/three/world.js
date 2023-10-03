import { createModels } from "./loader.js";

function xcreateWorld(manager, lanes) {
    const itemName = "createWorld";

    manager.itemStart(itemName);
    return createModels(manager, lanes)
        .then((models) => {
            return models;
        })
        .catch((error) => {
            manager.itemError(itemName, error);
        })
        .finally(() => {
            manager.itemEnd(itemName);
        });
}

function createWorld(manager, lanes) {
    return createModels(manager, lanes);
}
export { createWorld };
