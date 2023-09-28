class Beep {
    audio = new Audio("/start.mp3"); // path to file

    play() {
        return this.audio.play();
    }
}

export { Beep };
