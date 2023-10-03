import { GUI } from "dat.gui";
import { CAMERA_NAMES } from "./camera";

const gui = new GUI({ autoPlace: false });

function createDataGui(parent, data) {
    parent.appendChild(gui.domElement);

    gui.add(data, "camera", {
        Starter: CAMERA_NAMES.STARTER,
        "Down The Line": CAMERA_NAMES.DOWN_THE_LINE,
        Overhead: CAMERA_NAMES.OVERHEAD,
        "15 Meter": CAMERA_NAMES.FIFTEEN_METER
    });
}

export { createDataGui };
