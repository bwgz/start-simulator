<script setup>
import Layout from "../components/layout/Layout.vue";
import World from "../components/simulator/world/World.vue";
import RefereeCard from "../components/simulator/RefereeCard.vue";
import StarterCard from "../components/simulator/StarterCard.vue";
import SettingsCard from "../components/simulator/SettingsCard.vue";
</script>

<template>
    <Layout>
        <template v-slot:default>
            <div class="container-fluid">
                <div class="row">
                    <div class="col-lg-10"><World /></div>
                    <div class="col-lg-2">
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
