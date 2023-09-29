var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || window.webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

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

    handle(type, value) {
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
            this.handle("isHot", this.isListening);

            this.recognition.onresult = (event) => {
                var speechResult = event.results[event.results.length -1][0].transcript.toLowerCase().trim();
                this.handle("speech", speechResult);
            };

            this.recognition.onend = (event) => {
                this.recognition.stop();
                this.isListening = false;
                this.handle("isHot", this.isListening);
            };

        }
    }

    stop() {
        if (this.isListening) {
            this.recognition.stop();
            this.isListening = false;
            this.handle("isHot", this.isListening);
        }
    }
}

export { Listen };
