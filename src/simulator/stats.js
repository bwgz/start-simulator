import { reactive } from "vue";

const stats = reactive({
    tym: null,
    start: null,
    command: null,

    clear() {
        this.tym = null;
        this.start = null;
        this.command = null;
    },
    markTym() {
        this.tym = Date.now();
    },
    markStart() {
        this.start = Date.now();
    },
    setCommand(command) {
        this.command = command;
    },
    waitInSeconds() {
        let result = null;

        if (this.tym !== null && this.start !== null) {
            result = (this.start - this.tym) / 1000;
        }

        return result
    },
});

export { stats };
