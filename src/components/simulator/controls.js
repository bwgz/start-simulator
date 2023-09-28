import { reactive } from 'vue'

const StartEvent = {
    NEXT_HEAT: "next-heat",
    SHORT_WHISTLES: "short-whistles",
    LONG_WHISTLE: "long-whistle",
    TAKE_YOUR_MARKS: "take-your-marks",
    STAND: "stand",
    START: "start",
};

const controls = reactive({
    event: null,
    setEvent(value) {
        this.event = value;
    }
})

export { StartEvent, controls }