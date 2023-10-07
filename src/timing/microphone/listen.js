var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || window.webkitSpeechGrammarList;
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

const LISTEN_EVENT = {
    SPEECH: "speech",
    STATUS: "status",
};

class Listen {
    takeYourMarks = "#JSGF V1.0; grammar phrase; public <phrase> = take you marks;";
    stand = "#JSGF V1.0; grammar phrase; public <phrase> = stand;";
    recognition = new SpeechRecognition();
    speechRecognitionList = new SpeechGrammarList();

    constructor() {
        this.isListening = false;
        this.speechRecognitionList.addFromString(this.takeYourMarks, 1);
        this.recognition.grammars = this.speechRecognitionList;
        this.recognition.lang = "en-US";
        this.recognition.interimResults = false;
        this.recognition.maxAlternatives = 1;
        this.recognition.continuous = true;
    }

    onEvent(callback) {
        this.callback = callback;
    }

    sendEvent(type, value) {
        if (this.callback) {
            this.callback({
                type,
                value,
            });
        }
    }

    start() {
        if (!this.isListening) {
            this.isListening = true;
            this.recognition.start();
            this.sendEvent(LISTEN_EVENT.STATUS, this.isListening);

            this.recognition.onresult = (event) => {
                var speechResult = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
                this.sendEvent(LISTEN_EVENT.SPEECH, speechResult);
            };

            this.recognition.onend = (event) => {
                this.recognition.stop();
                this.isListening = false;
                this.sendEvent(LISTEN_EVENT.STATUS, this.isListening);
            };

            this.recognition.onerror = (event) => {
                console.error(event.error);
            };
        }
    }

    stop() {
        if (this.isListening) {
            this.recognition.stop();
            this.isListening = false;
            this.sendEvent(LISTEN_EVENT.STATUS, this.isListening);
        }
    }
}

export { LISTEN_EVENT, Listen };
