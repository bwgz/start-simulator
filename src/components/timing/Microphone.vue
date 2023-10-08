<script setup>
import { onMounted, ref, watch } from "vue";
import { MICROPHONE_EVENT, Microphone } from "@/timing";
import { COMMAND, useStateStore } from "@/simulator/state";
import { stats } from "@/simulator";
import "bootstrap5-toggle/css/bootstrap5-toggle.min.css";
import "bootstrap5-toggle/js/bootstrap5-toggle.ecmas.min.js";

const debug = ref(false);
const state = useStateStore();

const keyButton = ref();
const startButton = ref();
const toggleKey = ref();
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
    keyButton.value.bootstrapToggle('off')
}

microphone.onEvent((event) => {
    const { type, value } = event;

    switch (type) {
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


watch(toggleKey, (value) => {
    if (value) {
        microphone.keyDown();
        startButton.value.focus();
    } else {
        microphone.keyUp();
    }
});

function start() {
    microphone.startPressed();
}

onMounted(() => {
    // can't use Vue's element ref() because this is a custom element with its own API
    keyButton.value = document.getElementById("keyButton");
});
</script>

<template>
    <div class="card">
        <div class="card-body">
            <h6 class="card-header bg-white">
                <span>Starter</span>
            </h6>
            <div id="start-steps" class="" role="group">
                <div class="row">
                    <p class="pt-1">Switch microphone on and say "take your marks" or "stand"</p>
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
                    <div class="d-grid gap-2">
                        <input
                            id="keyButton"
                            type="checkbox"
                            data-toggle="toggle"
                            data-size="sm"
                            data-onstyle="success"
                            data-onlabel="Microphone On"
                            data-offlabel="Microphone Off"
                            v-model="toggleKey"
                        />

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
    </div>
</template>

<style scoped>
.card-header {
    padding: 2px 2px 4px 2px;
}

p {
    font-size: 0.75rem;
    line-height: 1rem;
}
</style>
