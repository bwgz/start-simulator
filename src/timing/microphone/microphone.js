import { Listen } from "./listen";
import { Beep } from "./sounds";

class Microphone {
    listen = new Listen();
    beep = new Beep();

    constructor() {
        this.listen.onEvent((event) => {
            const { type, value } = event;
            this.handle(type, value);
        });
    }

    onEvent(callback) {
        this.callback = callback;
    }

    handle(type, value) {
        if (this.callback) {
            this.callback({
                type,
                value,
            });
        }
    }

    keyDown() {
        if (!this.listen.isListening) {
            this.listen.start();
        }
    }

    keyUp() {
        if (this.listen.isListening) {
            this.listen.stop();
        }
    }

    startPress() {
        if (this.listen.isListening) {
            this.beep.play().then(() => {
                //console.log("beep");
            }).catch((error) => {
                console.error("beep", error);
            }).finally(() => {
                this.handle("start", "pressed");
                this.keyUp();
            });
        }
    }
}

export { Microphone };
