<script setup>
import { ref } from "vue";
import { Microphone } from "../../timing";
import { StartEvent, controls } from "./controls.js";
import { stats } from "./stats.js";

const isHotMic = ref(false);

const microphone = new Microphone();
microphone.onEvent((event) => {
    const { type, value } = event;
    console.log("type", type);
    console.log("value", value);

    switch (type) {
        case "isHot":
            isHotMic.value = value;
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
    console.log("toggleMic", isHotMic.value);
    isHotMic.value ? microphone.keyUp() : microphone.keyDown();
}
</script>

<template>
    <div class="card">
        <div class="card-body">
            <h5 class="card-header bg-white">Starter</h5>
            <div id="start-steps" class="p-2" role="group">
                <div class="form-check form-switch" v-on:click.right.prevent="microphone.startPress">
                    <label class="form-check-label" for="microphone">
                        <div class="d-flex flex-row">
                            <img v-if="isHotMic" height="24" src="../../assets/hotmic.png" />
                            <span>Microphone</span>
                        </div>
                    </label>
                    <input
                        id="microphone"
                        class="form-check-input"
                        type="checkbox"
                        v-model="isHotMic"
                        @click="toggleMic()"
                    />
                </div>

                <button
                    type="button"
                    class="btn btn-light"
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
