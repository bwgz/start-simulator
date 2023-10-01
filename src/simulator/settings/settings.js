
const SIMULATION_QUALITY = {
    POOR: 0,
    GOOD: 1,
    EXCELLENT: 2
};

const LANE_ASSIGNMENT_METHOD = {
    LEFT_TO_RIGHT: 0,
    RIGHT_TO_LEFT: 1,
    CENTER: 2,
    RANDOM: 3
};


const defaultLanes = 8;

const defaultSettings = {
    pool: {
        lanes: defaultLanes,
    },
    simulation: {
        numberOfSwimmers: defaultLanes,
        quality: SIMULATION_QUALITY.EXCELLENT,
        laneAssignmentMethod: LANE_ASSIGNMENT_METHOD.RIGHT_TO_LEFT,
    },
};


export { SIMULATION_QUALITY, LANE_ASSIGNMENT_METHOD, defaultSettings };