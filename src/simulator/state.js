import { defineStore } from "pinia";

const COMMAND = {
    RESET: "RESET",
    LONG_WHISTLE: "LONG_WHISTLE",
    SECOND_LONG_WHISTLE: "SECOND_LONG_WHISTLE",
    SHORT_WHISTLES: "SHORT_WHISTLES",
    TAKE_YOUR_MARKS: "TAKE_YOUR_MARKS",
    STAND: "STAND",
    START_SIGNAL: "START_SIGNAL",
};

const STATE = {
    WAITING: "WAITING",
    COMMENCEMENT: "COMMENCEMENT", // 1st long whistle
    ON_PLATFORM: "ON_PLATFORM", // short whistles
    STARTING_POSITION: "STARTING_POSITION", // take your mark
    RACING: "RACING", // start signal
};

const defaultState = {
    current: STATE.IDLE,
    previous: null,
};

const useStateStore = defineStore("state", {
    state: () => defaultState,
    actions: {
        command(command) {
            switch (command) {
                case COMMAND.RESET:
                    this.setState(STATE.WAITING);
                    break;
                case COMMAND.SHORT_WHISTLES:
                    this.setState(STATE.COMMENCEMENT);
                    break;
                case COMMAND.LONG_WHISTLE:
                    this.setState(STATE.ON_PLATFORM);
                    break;
                case COMMAND.SECOND_LONG_WHISTLE:
                    this.setState(STATE.ON_PLATFORM);
                    break;
                case COMMAND.TAKE_YOUR_MARKS:
                    this.setState(STATE.STARTING_POSITION);
                    break;
                case COMMAND.STAND:
                    this.setState(STATE.ON_PLATFORM);
                    break;
                case COMMAND.START_SIGNAL:
                    this.setState(STATE.RACING);
                    break;
            }
        },
        setState(state) {
            this.previous = this.current;
            this.current = state;
        },
    },
});

export { COMMAND, STATE, useStateStore };
