<script setup>
import { ref } from "vue";
import { Microphone } from "../../timing";
import { StartEvent, controls } from "./controls.js";
import { stats } from "./stats.js";

const isMicHot = ref(false);

function whistle() {
    controls.setEvent(StartEvent.LONG_WHISTLE);
}

const microphone = new Microphone();
microphone.onEvent((event) => {
    const { type, value } = event;
    console.log("type", type);
    console.log("value", value);

    switch (type) {
        case "isHot":
            isMicHot.value = value;
            if (value) {
                stats.clear();
            }
            break;
        case "speech":
            if (value.startsWith("stand")) {
                controls.setEvent(StartEvent.STAND);
                stats.clear();
            } else if (value.includes("take")) {
                controls.setEvent(StartEvent.TAKE_YOUR_MARKS);
                stats.setCommand(value);
                stats.markTym();
            }
            break;
        case "start":
            stats.markStart();

            setTimeout(() => {
                controls.setEvent(StartEvent.START);
            }, 700);
            break;
    }
});

function toggleMic() {
    console.log("toggleMic", isMicHot.value);
    isMicHot.value ? microphone.keyUp() : microphone.keyDown();
}
</script>

<template>
    <div class="card" style="width: 100%">
        <div class="card-body">
            <h5 class="card-header bg-white">Referee</h5>
            <div id="referee-steps" class="btn-group-vertical p-2" role="group">
                <button
                    type="button"
                    class="btn btn-light"
                    :class="{ active: controls.event === StartEvent.NEXT_HEAT }"
                    @click="controls.setEvent(StartEvent.NEXT_HEAT)"
                >
                    Next Heat
                </button>
                <button
                    type="button"
                    class="btn btn-light"
                    :class="{ active: controls.event === StartEvent.SHORT_WHISTLES }"
                    @click="controls.setEvent(StartEvent.SHORT_WHISTLES)"
                >
                    Short Whistles
                </button>
                <button
                    type="button"
                    class="btn btn-light"
                    :class="{ active: controls.event === StartEvent.LONG_WHISTLE }"
                    @click="whistle()"
                >
                    Long Whistle
                </button>
            </div>
        </div>
    </div>
    <div class="card" style="width: 100%">
        <div class="card-body">
            <h5 class="card-header bg-white">Starter</h5>
            <div id="start-steps" class="p-2" role="group">
                <div class="form-check form-switch" v-on:click.right.prevent="microphone.startPress">
                    <label class="form-check-label" for="microphone">Microphone</label>
                    <input
                        id="microphone"
                        class="form-check-input"
                        type="checkbox"
                        v-model="isMicHot"
                        @click="toggleMic()"
                    />
                </div>

                <button
                    type="button"
                    class="btn btn-light"
                    :class="{ disabled: !isMicHot }"
                    @click="microphone.startPress()"
                    @keyup.esc="start"
                    tabindex="0"
                    v-on:click.right.prevent="microphone.startPress"
                >
                    <span>Start</span>
                </button>
            </div>
        </div>
    </div>
</template>
