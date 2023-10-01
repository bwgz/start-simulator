<script setup>
import { useRoute } from "vue-router";
const route = useRoute();
</script>

<template>
    <nav class="container-xxl navbar navbar-expand-md navbar-light bg-light mb-4">
        <div class="container-fluid">
            <router-link :to="{ name: 'home' }" class="text-decoration-none">
                <a class="navbar-brand">
                    <img
                        src="../../assets/logo.png"
                        width="24"
                        height="24"
                        class="d-inline-block align-text-top"
                        alt="Starter"
                    />
                    Start Simulator
                </a>
            </router-link>

            <button
                class="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarCollapse"
                aria-controls="navbarCollapse"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarCollapse">
                <ul class="navbar-nav ms-auto mb-2 mb-md-0">
                    <li class="nav-item">
                        <router-link :to="{ name: 'home' }" class="text-decoration-none">
                            <a class="nav-link" :class="{ active: route.name === 'home' }" aria-current="page"
                                >Home</a
                            >
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <router-link :to="{ name: 'simulator' }" class="text-decoration-none">
                            <a class="nav-link"  :class="{ active: route.name === 'simulator' }">Simulator</a>
                        </router-link>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>
