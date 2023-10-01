<script setup>
import { ref } from "vue";
import * as SkeletonUtils from "three/addons/utils/SkeletonUtils.js";
import { StartEvent, controls } from "./controls.js";

const message = ref("");

const nextHeat = () => {
    controls.setEvent(StartEvent.NEXT_HEAT);
    message.value = "Next Heat";
};

const shortWhistles = () => {
    controls.setEvent(StartEvent.SHORT_WHISTLES);
    message.value = "beep, beep, beep, beep, beep";
};

const longWhistle = () => {
    controls.setEvent(StartEvent.LONG_WHISTLE);
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
                        :class="{ active: controls.event === StartEvent.SHORT_WHISTLES }"
                        @click="shortWhistles()"
                    >
                        Short Whistles
                    </button>
                    <button
                        type="button"
                        class="btn btn-primary btn-sm m-2"
                        :class="{ active: controls.event === StartEvent.LONG_WHISTLE }"
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
