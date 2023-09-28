class Beep {
    url = import.meta.env.BASE_URL + 'start.mp3';
    audio = new Audio(this.url); // path to file

    play() {
        return this.audio.play();
    }
}

export { Beep };
