<script setup>
import Header from "./Header.vue";
import Footer from "./Footer.vue";
</script>

<template>
    <div>
        <Header />
        <main class="main-slot">
            <slot></slot>
        </main>
        <Footer />
    </div>
</template>

<style scoped></style>
