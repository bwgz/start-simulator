<script setup>
import { ref } from "vue";
import Layout from "@/components/layout/Layout.vue";
import World from "@/components/simulator/world/World.vue";
import RefereeCard from "@/components/simulator/RefereeCard.vue";
import StarterCard from "@/components/simulator/StarterCard.vue";
import StatsCard from "@/components/simulator/StatsCard.vue";
import SettingsCard from "@/components/simulator/SettingsCard.vue";
import { stats } from "@/simulator";

const help = ref(false);
</script>

<template>
    <Layout>
        <template v-slot:default>
            <div class="container-fluid">
                <div class="row">
                    <div :class="{ 'col-lg-9': help, 'col-lg-12': !help }">
                        <div class="row">
                            <div :class="{ 'col-lg-9': help, 'col-lg-10': !help }">
                                <nav class="navbar navbar-light bg-light">
                                    <span class="fw-bold">
                                        Command: <span class="fw-normal">{{ stats.command }}</span>
                                    </span>
                                    <button class="text-decoration-none" @click="() => (help = true)">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            fill="currentColor"
                                            class="bi bi-question-circle"
                                            viewBox="0 0 16 16"
                                        >
                                            <path
                                                d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"
                                            ></path>
                                            <path
                                                d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z"
                                            ></path>
                                        </svg>
                                    </button>
                                </nav>
                                <World />
                            </div>
                            <div :class="{ 'col-lg-3': help, 'col-lg-2': !help }">
                                <RefereeCard class="mb-2" />
                                <StarterCard class="mb-2" />
                                <StatsCard class="mb-2" />
                                <SettingsCard class="mb-2" />
                            </div>
                        </div>
                    </div>
                    <div v-if="help" class="border" :class="{ 'col-lg-3': help, 'col-lg-0': !help }">
                        <nav class="navbar navbar-light">
                            <h5 class="navbar-nav mx-auto">Help</h5>
                            <button
                                type="button"
                                class="btn"
                                @click="() => (help = false)"
                                data-toggle="tooltip"
                                data-placement="left"
                                title="Close"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    fill="currentColor"
                                    class="bi bi-x-circle icon"
                                    viewBox="0 0 16 16"
                                >
                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                    <path
                                        d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"
                                    />
                                </svg>
                            </button>
                        </nav>
                        <h6><img src="/icons/noun-whistle-2505749.svg" width="24" /> Referee</h6>
                        <p>Referee buttons are used to simulate the referee's whistle commands.</p>
                        <p>
                            Click on the whistle buttons or turn on auto whistles. Auto whistles executes the whistle
                            commands for you. It monitors the start and will automatically command the swimmers back onto
                            the starting platform.
                        </p>
                        <h6><img src="/icons/noun-microphone-6145626.svg" width="24" /> Starter</h6>
                        <p>
                            The simulator's microphone behaves like a real microphone. It's activated by clicking the
                            switch. This action is the same as "keying" a real microphone. When switched on the
                            microphone is becomes "hot" and the simulator listens to the computer's microphone. Say
                            "take your marks" or "stand" and the swimmers will respond to that command. They'll ignore
                            anything else you say.
                        </p>
                        <p>
                            The start button is enabled When the microphone is hot. Clicking the start button or hitting
                            the space bar will simulate a start signal. You'll hear a beep and the swimmer's will
                            respond to it.
                        </p>
                        <p>
                            Voice commands are displayed in the command box. If swimmers don't react it's likely that
                            the command was not recognized as a valid command. Try again.
                        </p>
                        <p>
                            Your browser may ask you to allow the simulator to use the computer's microphone. You must
                            allow this for voice commands to work.
                        </p>
                        <h6><img src="/icons/noun-stats-2225104.svg" width="24" /> Stats</h6>
                        <p>Held - the time between recognizing "take your marks" and the start signal.</p>
                        <h6><img src="/icons/noun-settings-6164385.svg" width="24" /> Settings</h6>
                        <p>Swimmers: The number of swimmers in the heat.</p>
                        <p>
                            Swimmer Quality: You can adjust the quality of the swimmers. Low quality swimmers take
                            longer to take their mark and start.
                        </p>
                        <p>Lane Assignment: Swimmers will be assigned lanes based on this setting.</p>
                    </div>
                </div>
            </div>
        </template>
    </Layout>
</template>

<style scoped>
p {
    font-size: 0.875rem;
}

button {
    display: inline-block;
    position: relative;
    box-sizing: border-box;
    border: none;
    outline: none;
    background-color: transparent;
    fill: currentColor;
    color: inherit;
    text-decoration: none;
    cursor: pointer;
}

.icon:hover {
    background-color: gainsboro;
    border-radius: 24px;
}
</style>
