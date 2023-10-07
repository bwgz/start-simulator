import { defineStore } from "pinia";
import { defaultSettings } from "./settings";

const loadSettings = () => {
    let settings = defaultSettings;
    const item = localStorage.getItem("settings");
    if (item) {
        const object = JSON.parse(item);
        if (object.version === defaultSettings.version) {
            settings = object;
        } else {
            localStorage.removeItem("settings");
        }
    }

    return settings;
};

const useSettingsStore = defineStore("settings", {
    state: loadSettings,
    actions: {
        setNumberOfSwimmers: (state, value) => {
            state.simulation.numberOfSwimmers = value;
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
