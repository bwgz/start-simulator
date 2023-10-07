
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

const defaultLanes = 8;

const defaultSettings = {
    version: "0.2",
    pool: {
        id: "pool:0",
        lanes: defaultLanes,
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
        numberOfSwimmers: defaultLanes,
        quality: SIMULATION_QUALITY.EXCELLENT,
        laneAssignmentMethod: LANE_ASSIGNMENT_METHOD.NEAR,
    },
};

export { SIMULATION_QUALITY, LANE_ASSIGNMENT_METHOD, defaultSettings };