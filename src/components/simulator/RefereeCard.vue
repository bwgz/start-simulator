<script setup>
import { ref } from "vue";
import { COMMAND, useStateStore } from "@/simulator/state";

const state = useStateStore();
const message = ref("");

const reset = () => {
    state.command(COMMAND.RESET);
    message.value = "New Heat";
};

const shortWhistles = () => {
    state.command(COMMAND.SHORT_WHISTLES);
    message.value = "beep, beep, beep, beep, beep";
};

const longWhistle = () => {
    state.command(COMMAND.LONG_WHISTLE);
    message.value = "beeeeeep";
};
</script>

<template>
    <div class="card">

        <div class="card-body">
            <h6 class="card-header bg-white">Referee</h6>
            <div class="row">
                <div class="col">
                    <small class="pt-2">Perform referee duties using these buttons.</small>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <button
                        type="button"
                        class="btn btn-primary btn-sm m-2"
                        @click="reset()"
                    >
                        RESET
                    </button>
                    <button
                        type="button"
                        class="btn btn-primary btn-sm m-2"
                        @click="shortWhistles()"
                    >
                        Short Whistles
                    </button>
                    <button
                        type="button"
                        class="btn btn-primary btn-sm m-2"
                        @click="longWhistle()"
                    >
                        Long Whistle
                    </button>
                </div>
                <div class="row">
                    <div class="col my-auto">
                        <div class="m-2">
                            <p v-if="message" class="bg-light">&quot{{ message }}&quot</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
