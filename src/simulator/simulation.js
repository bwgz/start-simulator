

const HEAT_QUALITY = {
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

class Simulation {
    numberOfSwimmers = 8;
    laneAssignmentMethod = LANE_ASSIGNMENT_METHOD.RIGHT_TO_LEFT;
    quality = HEAT_QUALITY.EXCELLENT;

    constructor(numberOfSwimmers, quality, laneAssignmentMethod) {
        this.numberOfSwimmers = numberOfSwimmers;
        this.quality = quality;
        this.laneAssignmentMethod = laneAssignmentMethod;
    }
}

export { Simulation, HEAT_QUALITY, LANE_ASSIGNMENT_METHOD };