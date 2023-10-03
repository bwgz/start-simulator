


class Swimmer {
    static POSE = {
        deck: 0,
        blocks: 1,
    };
    model = null;
    poses = [2];
    pose = Swimmer.POSE.deck;
    
    constructor(model) {
        this.model = model;
    }

    setPoses(poses) {
    }

    setPose(pose) {
        this.pose = pose;
    }
}