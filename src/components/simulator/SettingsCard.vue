<script setup>
import { useSettingsStore } from "@/simulator/settings";

const qualityValues = ["Poor", "Good", "Excellent"];
const laneAssignmentMethodValues = ["Left to Right", "Right to Left", "Seeded", "Random"];

const settings = useSettingsStore();
</script>

<template>
    <div class="card">
        <div class="card-body">
            <h6 class="card-header bg-white">Simulation Settings</h6>
            <div class="row mt-2">
                <label for="customRange1" class="form-label"
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
                <label for="customRange1" class="form-label"
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
                <label for="customRange1" class="form-label"
                    >Lane Assignment: {{ laneAssignmentMethodValues[settings.simulation.laneAssignmentMethod] }}</label
                >
                <div class="col">
                    <div class="form-check">
                        <input
                            class="form-check-input"
                            type="radio"
                            id="rtol"
                            value="1"
                            v-model="settings.simulation.laneAssignmentMethod"
                        />
                        <label class="form-check-label" for="rtol">Right to Left</label>
                    </div>

                    <div class="form-check">
                        <input
                            class="form-check-input"
                            type="radio"
                            id="ltor"
                            value="0"
                            v-model="settings.simulation.laneAssignmentMethod"
                        />
                        <label class="form-check-label" for="ltor">Left to Right</label>
                    </div>

                    <div class="form-check">
                        <input
                            class="form-check-input"
                            type="radio"
                            id="seeded"
                            value="2"
                            v-model="settings.simulation.laneAssignmentMethod"
                        />
                        <label class="form-check-label" for="seeded">Seeded</label>
                    </div>
                    <div class="form-check">
                        <input
                            class="form-check-input"
                            type="radio"
                            id="random"
                            value="3"
                            v-model="settings.simulation.laneAssignmentMethod"
                            disabled
                       />
                        <label class="form-check-label" for="random">Random</label>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
