<script setup>
import { ref } from "vue";
import { MICROPHONE_EVENT, Microphone } from "@/timing";
import { COMMAND, useStateStore } from "@/simulator/state";
import { stats } from "@/simulator";

const debug = ref(false);
const state = useStateStore();

const startButton = ref();
const toggleKey = ref(false);
const microphone = new Microphone();

function onTakeYouMarks(value) {
    state.command(COMMAND.TAKE_YOUR_MARKS);
    stats.setCommand(value);
    stats.markTym();
}

function onStand(value) {
    state.command(COMMAND.STAND);
    stats.setCommand(value);
}

function onUnknown(value) {
    stats.setCommand(value);
}

function onStartPress() {
    stats.markStart();
    state.command(COMMAND.START_SIGNAL);
    stats.setCommand("Start");
}

microphone.onEvent((event) => {
    const { type, value } = event;

    switch (type) {
        case MICROPHONE_EVENT.KEY_DOWN:
            toggleKey.value = true;
            startButton.value.focus();
            break;
        case MICROPHONE_EVENT.KEY_UP:
            toggleKey.value = false;
            break;
        case MICROPHONE_EVENT.COMMAND:
            if (value.includes("stand")) {
                onStand(value);
            } else if (value.includes("take")) {
                onTakeYouMarks(value);
            } else {
                onUnknown(value);
            }
            break;
        case MICROPHONE_EVENT.START_PRESS:
            onStartPress();
            break;
    }
});

function toggleMic() {
    toggleKey.value ? microphone.keyUp() : microphone.keyDown();
}

function start() {
    microphone.startPressed();
}
</script>

<template>
    <div class="card">
        <div class="card-body">
            <h6 class="card-header bg-white">
                <span>Starter</span>
            </h6>
            <p class="pt-1">Switch microphone on to perform a start. Say "take your marks" or "stand".</p>
            <div id="start-steps" class="p-2" role="group">
                <div class="row">
                    <div class="form-check form-switch">
                        <label class="form-check-label" for="microphone">
                            <span>Microphone</span>
                        </label>
                        <input
                            id="microphone"
                            class="form-check-input"
                            type="checkbox"
                            v-model="toggleKey"
                            @click="toggleMic()"
                            tabindex="0"
                        />
                    </div>
                </div>
                <div v-if="debug" class="row">
                    <button
                        type="button"
                        class="btn btn-primary m-2"
                        :class="{ disabled: !toggleKey }"
                        @click="state.command(COMMAND.TAKE_YOUR_MARKS)"
                    >
                        <span>TYM</span>
                    </button>
                    <button
                        type="button"
                        class="btn btn-primary m-2"
                        :class="{ disabled: !toggleKey }"
                        @click="state.command(COMMAND.STAND)"
                    >
                        <span>STAND</span>
                    </button>
                </div>

                <div class="row">
                    <button
                        id="startButton"
                        ref="startButton"
                        type="button"
                        class="btn btn-danger"
                        :class="{ disabled: !toggleKey }"
                        @click="start"
                        @keyup.esc="start"
                        v-on:click.right.prevent="start"
                        tabindex="1"
                    >
                        <span>Start</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
p {
    font-size: 0.75rem;
    line-height: 1rem;
}
</style>