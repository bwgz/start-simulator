import { reactive } from "vue";
import { defineStore } from "pinia";
import { defaultSettings } from "./settings";

const loadSettings = () => {
    return (localStorage.getItem("settings")) ? JSON.parse(localStorage.getItem("settings")) : defaultSettings;
};

const useSettingsStore = defineStore("settings", {
    state: loadSettings,
    actions: {
        increment() {
            this.count++;
        },
    },
    getters: {
        getPool: (state) => {
            return state.pool;
        },
        getSimulation: (state) => {
            return state.simulation;
        },
    },
});

export { useSettingsStore };
