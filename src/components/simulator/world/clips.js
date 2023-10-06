import { STATE } from "@/simulator/state";

const getClipName = (name) => "Armature|" + name;

const clips = [];
clips[STATE.WAITING] = ["bashful", "bored", "idle", "standing-greeting", "standing-idle"];
clips[STATE.COMMENCEMENT] = [ "bashful", "clapping", "idle", "standing-idle"];
clips[STATE.ON_PLATFORM] = ["bashful", "idle", "standing-idle"];
clips[STATE.STARTING_POSITION] = ["take-your-marks"];
clips[STATE.STANDING] = ["stand"];
clips[STATE.RACING] = ["start:2"];

const getRandomClipName = (state) => getClipName(clips[state][Math.floor(Math.random() * clips[state].length)]);

export { getRandomClipName, getClipName }