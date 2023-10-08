<script setup>
import { stats } from "@/simulator";

function displayWait() {
    const waitInSeconds = stats.waitInSeconds();
    return waitInSeconds ? `${waitInSeconds} sec` : "";
}
</script>

<template>
    <div class="card">
        <div class="card-body">
            <h6 class="card-header bg-white">Stats</h6>
            <div class="p-2">
                <span>
                    Held: <span>{{ displayWait() }}</span>
                </span>
            </div>
        </div>
    </div>
</template>
