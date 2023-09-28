<script setup>
const buildDate = import.meta.env.VITE_BUILD_DATE ? import.meta.env.VITE_BUILD_DATE : new Date().toISOString();
</script>

<template>
    <footer class="container py-5 bg-light">
        <div class="row pb-2">
            <small>Please note, this is alpha software. Some features may be incomplete or buggy.</small>
            <small>Built: {{ buildDate }}</small>
        </div>

        <div class="row">
            <div class="col-12 col-md">
                <small class="d-block mb-3 text-muted">Copyright © 2023</small>
            </div>
            <div class="col-6 col-md"></div>
            <div class="col-6 col-md"></div>
            <div class="col-6 col-md"></div>
            <div class="col-6 col-md">
                <h5>About</h5>
                <ul class="list-unstyled text-small">
                    <li><a class="link-secondary" href="#">Who We Are</a></li>
                    <li><a class="link-secondary" href="#">Privacy</a></li>
                    <li><a class="link-secondary" href="#">Terms</a></li>
                </ul>
            </div>
        </div>
    </footer>
</template>

