<script setup>
import Layout from "../components/layout/Layout.vue";
import World from "../components/simulator/World.vue";
import RefereeCard from "../components/simulator/RefereeCard.vue";
import StarterCard from "../components/simulator/StarterCard.vue";
import StatsCard from "../components/simulator/StatsCard.vue";
import SettingsCard from "../components/simulator/SettingsCard.vue";
</script>

<template>
    <Layout>
        <template v-slot:default>
            <div class="container-fluid">
                <div class="row">
                    <div class="col-lg-9"><World /></div>
                    <div class="col-lg-3">
                        <RefereeCard class="mb-2" />
                        <StarterCard class="mb-2" />
                        <StatsCard class="mb-2" />
                        <SettingsCard class="mb-2"/>
                    </div>
                </div>
            </div>
        </template>
    </Layout>
</template>
