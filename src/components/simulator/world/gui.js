import { GUI } from "dat.gui";
import { CAMERA_NAMES } from "./camera";

function createDatGui(parent, data) {
    const gui = new GUI({ autoPlace: false });
    parent.appendChild(gui.domElement);

    gui.add(data, 'state');

    gui.add(data, "camera", {
        Starter: CAMERA_NAMES.STARTER,
        "Down The Line": CAMERA_NAMES.DOWN_THE_LINE,
        Overhead: CAMERA_NAMES.OVERHEAD,
        "5 Meter": CAMERA_NAMES.FIVE_METER,
        "15 Meter": CAMERA_NAMES.FIFTEEN_METER,
        "Deck Check": CAMERA_NAMES.DECK_CHECK,
        "Corner": CAMERA_NAMES.CORNER,
        "Right Lane": CAMERA_NAMES.RIGHT_LANE,
        "Origin": CAMERA_NAMES.ORIGIN,
    });

    return gui;
}

export { createDatGui };
