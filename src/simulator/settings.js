import { Pool } from './pool';
import { Simulation, HEAT_QUALITY, LANE_ASSIGNMENT_METHOD } from './simulation';

class Settings {
    constructor(pool = new Pool(), simulation = new Simulation()) {
        this.pool = pool;
        this.simulation = simulation;
    }
}

const defaultLanes = 8;
const defaultPool = new Pool(defaultLanes);
const defaultSimulation = new Simulation(defaultPool.lanes, HEAT_QUALITY.EXCELLENT, LANE_ASSIGNMENT_METHOD.RIGHT_TO_LEFT);
const defaultSettings = new Settings(defaultPool, defaultSimulation);

export { Settings, defaultSettings };