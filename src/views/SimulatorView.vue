<script setup>
import Layout from "../components/layout/Layout.vue";
import World from "../components/simulator/World.vue";
import Panel from "../components/simulator/Panel.vue";
import Stats from "../components/simulator/Stats.vue";
</script>

<template>
    <Layout>
        <template v-slot:default>
            <div class="container-fluid">
                <div class="row">
                    <div class="col-lg-9"><World /></div>
                    <div class="col-lg-3"><Panel /><Stats /></div>
                </div>
            </div>
        </template>
    </Layout>
</template>
