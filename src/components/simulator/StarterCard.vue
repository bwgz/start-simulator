<script setup>
import { ref } from "vue";
import { Microphone } from "@/timing";
import { StartEvent, controls } from "./controls.js";
import { stats } from "./stats.js";

const debug = ref(true);

const isHotMic = ref(false);

const microphone = new Microphone();
microphone.onEvent((event) => {
    const { type, value } = event;

    switch (type) {
        case "isHot":
            isHotMic.value = value;
            if (value) {
                stats.clear();
            }
            break;
        case "speech":
            if (value.includes("stand")) {
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
            controls.setEvent(StartEvent.START);

            break;
    }
});

function toggleMic() {
    isHotMic.value ? microphone.keyUp() : microphone.keyDown();
}
</script>

<template>
    <div class="card">
        <div class="card-body">
            <h6 class="card-header bg-white">
                <span>Starter</span><img v-if="isHotMic" height="18" src="../../assets/hotmic.png" />
            </h6>
            <small class="pt-2">Switch on the microphone on to perform a start. You can either say "take your mark" and "stand" or use the buttons.</small>
            <div id="start-steps" class="p-2" role="group">
                <div class="form-check form-switch" v-on:click.right.prevent="microphone.startPress">
                    <label class="form-check-label" for="microphone">
                        <span>Microphone</span>
                    </label>
                    <input
                        id="microphone"
                        class="form-check-input"
                        type="checkbox"
                        v-model="isHotMic"
                        @click="toggleMic()"
                    />
                </div>
                <div v-if="debug">
                <button
                    type="button"
                    class="btn btn-primary m-2"
                    :class="{ disabled: !isHotMic }"
                    @click="controls.setEvent(StartEvent.TAKE_YOUR_MARKS)"
                    @keyup.esc="start"
                >
                    <span>TYM</span>
                </button>
                <button
                    type="button"
                    class="btn btn-primary m-2"
                    :class="{ disabled: !isHotMic }"
                    @click="controls.setEvent(StartEvent.STAND)"
                    @keyup.esc="start"
                >
                    <span>STAND</span>
                </button>

                </div>

                <button
                    type="button"
                    class="btn btn-danger m-2"
                    :class="{ disabled: !isHotMic }"
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
