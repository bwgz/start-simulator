import { LISTEN_EVENT, Listen } from "./listen";
import { Beep } from "./sounds";

const MICROPHONE_EVENT = {
    KEY_UP: "key_up",
    KEY_DOWN: "key_down",
    COMMAND: "command",
    START_PRESS: "start_press",
};

class Microphone {
    isHot = false;
    listen = new Listen();
    beep = new Beep();
    callback = () => {};

    constructor() {
        this.listen.onEvent((event) => {
            this.onListenEvent(event);
        });
    }

    onEvent(callback) {
        this.callback = callback;
    }

    sendEvent(type, value) {
        this.callback({ type, value });
    }

    onListenStatus(event) {
        const { value } = event;
        console.log("onListenStatus", event);
        if (this.isHot && !value) {
            this.listen.start();
        }
    }

    onListenSpeechEvent(event) {
        console.log("onListenSpeechEvent", event);
        const { value } = event;
        this.callback({ type: MICROPHONE_EVENT.COMMAND, value });
    }

    onListenEvent(event) {
        const { type } = event;
        if (type === LISTEN_EVENT.STATUS) {
            this.onListenStatus(event);
        } else if (type === LISTEN_EVENT.SPEECH) {
            this.onListenSpeechEvent(event);
        }
    }

    keyDown() {
        this.isHot = true;
        if (!this.listen.isListening) {
            this.listen.start();
        }
        this.sendEvent(MICROPHONE_EVENT.KEY_DOWN);
    }

    keyUp() {
        this.isHot = false;
        if (this.listen.isListening) {
            this.listen.stop();
        }
        this.sendEvent(MICROPHONE_EVENT.KEY_UP);
    }

    startPressed() {
        if (this.isHot) {
            this.beep
                .play()
                .then(() => {
                    //console.log("beep");
                })
                .catch((error) => {
                    console.error("beep", error);
                })
                .finally(() => {
                    this.sendEvent(MICROPHONE_EVENT.START_PRESS);
                    this.keyUp();
                });
        }
    }
}

export { MICROPHONE_EVENT, Microphone };
