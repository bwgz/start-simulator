<script setup>
import { useSettingsStore } from "../../simulator/settings";

const qualityValues = ["Poor", "Good", "Excellent"];
const settings = useSettingsStore()

</script>

<template>
    <div class="card">
        <div class="card-body">
            <h6 class="card-header bg-white">Simulation Settings</h6>
            <div class="row mt-2">
                <label for="customRange1" class="form-label"
                    >Number of Swimmers: {{ settings.simulation.numberOfSwimmers }}</label
                >
                <div class="col">
                    <input
                        v-model="settings.simulation.numberOfSwimmers"
                        type="range"
                        class="form-range"
                        id="numberOfSwimmers"
                        min="1"
                        max="8"
                    />
                </div>
            </div>
            <div class="row">
                <label for="customRange1" class="form-label"
                    >Quality of Swimmers: {{ qualityValues[settings.simulation.quality]}}</label
                >
                <div class="col">
                    <input
                        v-model="settings.simulation.quality"
                        type="range"
                        class="form-range"
                        id="quality"
                        min="0"
                        max="2"
                    />
                </div>
            </div>
        </div>
    </div>
</template>
