
const SIMULATION_QUALITY = {
    POOR: 0,
    GOOD: 1,
    EXCELLENT: 2
};

const LANE_ASSIGNMENT_METHOD = {
    FAR: "far",
    NEAR: "near",
    SEEDED: "seeded",
};

const defaultSettings = {
    version: "0.3",
    pool: {
        id: "pool:4",
    },
    block: {    
        id: "omega",
    },
    chair: {
        id: "sandler",
    },
    swimmer: {
        id: "xbot",
    },
    simulation: {
        numberOfSwimmers: 8,
        quality: SIMULATION_QUALITY.EXCELLENT,
        laneAssignmentMethod: LANE_ASSIGNMENT_METHOD.NEAR,
    },
};

export { SIMULATION_QUALITY, LANE_ASSIGNMENT_METHOD, defaultSettings };