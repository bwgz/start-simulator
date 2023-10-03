<script setup>
import { stats } from "./stats.js";

function displayWait() {
    const waitInSeconds = stats.waitInSeconds();
    return waitInSeconds ? `${waitInSeconds} seconds` : "";
}

const displayCommand = () => {
    const command = stats.command;
    return command ? command : "";
};

const isCorrectCommand = () => {
    const command = stats.command;
    const result = command ? command === "take your marks" : true;
    return result;
};
</script>

<template>
    <div class="card">
        <div class="card-body">
            <h6 class="card-header bg-white">Stats</h6>
            <div class="p-2">
                <p>
                    Command: <span :class="{ command_error: !isCorrectCommand() }">{{ displayCommand() }}</span>
                </p>
                <p>
                    TYM to Start: <span>{{ displayWait() }}</span>
                </p>
            </div>
        </div>
    </div>
</template>

<style scoped>
.command_error {
    color: red;
}
</style>
