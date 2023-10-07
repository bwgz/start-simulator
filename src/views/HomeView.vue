<script setup>
import Layout from "@/components/layout/Layout.vue";
</script>

<template>
    <Layout>
        <template v-slot:default>
            <div class="container">
                <div class="row flex-lg-row-reverse align-items-center g-5 py-5">
                    <div class="col-10 col-sm-8 col-lg-6">
                        <img
                            src="../assets/start.jpeg"
                            class="d-block mx-lg-auto img-fluid"
                            alt="Bootstrap Themes"
                            width="700"
                            height="500"
                            loading="lazy"
                        />
                    </div>
                    <div class="col-lg-6">
                        <h1 class="display-5 fw-bold text-body-emphasis lh-1 mb-3">Starter</h1>
                        <p class="lead">
                            The Starter is, undoubtedly, one of the most important officials on the deck. They are the
                            only official who is in direct contact with the swimmers. Their actions can clearly affect
                            the swimmer's performance.
                        </p>
                        <p class="lead">
                            Enter a 3D world and practice your starts. Right now you can begin with simple starts. This
                            application is currently being developed and as it progresses more complex scenarios will
                            come available. The goal is to provide a tool for officials to practice their skills and
                            become better at their craft.
                        </p>
                        <div class="d-grid gap-2 d-md-flex justify-content-md-start">
                            <router-link :to="{ name: 'simulator' }" class="text-decoration-none">
                                <button type="button" class="btn btn-primary btn-lg px-4 me-md-2">Let's Go</button>
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </Layout>
</template>
