<script setup>
import { RouterView } from "vue-router";
import { useSettingsStore } from "./simulator/settings";
const settings = useSettingsStore();

settings.$subscribe((mutation, state) => {
    localStorage.setItem("settings", JSON.stringify(state));
});
</script>

<template>
    <RouterView />
</template>
