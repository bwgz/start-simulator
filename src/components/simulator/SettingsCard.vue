<script setup>
import { useSettingsStore } from "@/simulator/settings";

const qualityValues = ["Poor", "Good", "Excellent"];
const laneAssignmentMethodValues = ["Left to Right", "Right to Left", "Seeded", "Random"];

const settings = useSettingsStore();
</script>
 
<template>
    <div class="card">
        <div class="card-body">
            <h6 class="card-header bg-white">Settings</h6>
            <div class="row mt-2">
                <label for="numberOfSwimmers" class="form-label"
                    >Swimmers: {{ settings.simulation.numberOfSwimmers }}</label
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
                <label for="quality" class="form-label"
                    >Swimmer Quality: {{ qualityValues[settings.simulation.quality] }}</label
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
            <div class="row">
                <label class="form-label"
                    >Lane Assignment: {{ laneAssignmentMethodValues[settings.simulation.laneAssignmentMethod] }}</label
                >
                <div class="col">
                    <div class="form-check">
                        <input
                            class="form-check-input"
                            type="radio"
                            id="near"
                            value="near"
                            v-model="settings.simulation.laneAssignmentMethod"
                        />
                        <label class="form-check-label" for="near">Near</label>
                    </div>

                    <div class="form-check">
                        <input
                            class="form-check-input"
                            type="radio"
                            id="far"
                            value="far"
                            v-model="settings.simulation.laneAssignmentMethod"
                        />
                        <label class="form-check-label" for="far">Far</label>
                    </div>

                    <div class="form-check">
                        <input
                            class="form-check-input"
                            type="radio"
                            id="seeded"
                            value="seeded"
                            v-model="settings.simulation.laneAssignmentMethod"
                        />
                        <label class="form-check-label" for="seeded">Seeded</label>
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
</style>