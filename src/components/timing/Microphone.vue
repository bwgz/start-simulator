<script setup>
import { ref, watch } from "vue";
import { MICROPHONE_EVENT, Microphone } from "@/timing";
import { COMMAND, useStateStore } from "@/simulator/state";
import { stats } from "@/simulator";

const debug = ref(false);
const state = useStateStore();

const key = ref(false);
const startButton = ref();
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
    key.value = false;
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

watch(key, (value) => {
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
                        :class="{ disabled: !key }"
                        @click="state.command(COMMAND.TAKE_YOUR_MARKS)"
                    >
                        <span>TYM</span>
                    </button>
                    <button
                        type="button"
                        class="btn btn-primary m-2"
                        :class="{ disabled: !key }"
                        @click="state.command(COMMAND.STAND)"
                    >
                        <span>STAND</span>
                    </button>
                </div>

                <div class="row">
                    <div class="d-grid gap-2">
                        <button
                            type="button"
                            class="btn"
                            :class="{ 'btn-primary': key, 'btn-secondary': !key }"

                            data-toggle="button"
                            @click="key = !key"
                            tabindex="0"
                            >{{ key ? "Microphone On" : "Microphone Off"}}</button>

                        <button
                            id="startButton"
                            ref="startButton"
                            type="button"
                            class="btn btn-danger"
                            :class="{ disabled: !key }"
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
