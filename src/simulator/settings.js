import { Pool } from './pool';

class Settings {
    constructor(pool = new Pool()) {
        this.pool = pool;
    }
}

const defaultPool = new Pool(8);
const defaultSettings = new Settings(defaultPool);

export { Settings, defaultSettings };