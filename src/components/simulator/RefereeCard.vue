<script setup>
import { COMMAND, useStateStore } from "@/simulator/state";
import { stats } from "@/simulator";

const state = useStateStore();

const reset = () => {
    state.command(COMMAND.RESET);
    stats.setCommand("Reset");
};

const shortWhistles = () => {
    state.command(COMMAND.SHORT_WHISTLES);
    stats.setCommand("Short Whistles");
};

const longWhistle = () => {
    state.command(COMMAND.LONG_WHISTLE);
    stats.setCommand("Long Whistle");
};
</script>

<template>
    <div class="card">
        <div class="card-body">
            <h6 class="card-header bg-white">Referee</h6>
            <div class="row">
                <p class="pt-1">Perform referee duties using these buttons.</p>
            </div>
            <div class="row">
                <div class="col">
                    <div class="d-grid gap-2">
                        <button type="button" class="btn btn-primary btn-sm" @click="shortWhistles()">
                            Short Whistles
                        </button>
                        <button type="button" class="btn btn-primary btn-sm" @click="longWhistle()">
                            Long Whistle
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