<script setup>
import { reactive } from "vue";
import Layout from "../components/layout/Layout.vue";
import World from "../components/simulator/World.vue";
import RefereeCard from "../components/simulator/RefereeCard.vue";
import StarterCard from "../components/simulator/StarterCard.vue";
import StatsCard from "../components/simulator/StatsCard.vue";
import SettingsCard from "../components/simulator/SettingsCard.vue";
import { defaultSettings } from "../simulator/settings";

const settings = reactive(defaultSettings);

console.log("defaultSettings", defaultSettings);
</script>

<template>
    <Layout>
        <template v-slot:default>
            <div class="container-fluid">
                <div class="row">
                    <div class="col-lg-9"><World :settings="settings" /></div>
                    <div class="col-lg-3">
                        <RefereeCard class="mb-2" />
                        <StarterCard class="mb-2" />
                        <StatsCard class="mb-2" />
                        <SettingsCard class="mb-2" :settings="settings"/>
                    </div>
                </div>
            </div>
        </template>
    </Layout>
</template>
