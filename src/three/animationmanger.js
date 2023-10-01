const MARKS = {
    chair: "chair",
    behind: "behind",
    blocks: "blocks",
    tym: "tym",
    start: "start",
};

class Animation {
    name;
    position = {
        chair: {},
        behind: {},
        blocks: {},
        tym: {},
        start: {},
    };
}

class Character {
    model;
}

class AnimationManager {
    characters = [];

    addCharacter(id, model, animations) {
        this.id = id;

        const newCharacter = new Character(model, animationMappings);
        this.characters.push(character);
    }
}
