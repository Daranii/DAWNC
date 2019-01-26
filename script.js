var keys = ["A0", "A1", "A2", "A3", "A4", "A5", "A6", "A7", "Ab1", "Ab2", "Ab3", "Ab4", "Ab5",
    "Ab6", "Ab7", "B0", "B1", "B2", "B3", "B4", "B5", "B6", "B7", "Bb0", "Bb1", "Bb2", "Bb3",
    "Bb4", "Bb5", "Bb6", "Bb7", "C1", "C2", "C3", "C4", "C5", "C6", "C7", "C8", "D1", "D2", "D3",
    "D4", "D5", "D6", "D7", "Db1", "Db2", "Db3", "Db4", "Db5", "Db6", "Db7", "Db8", "E1", "E2",
    "E3", "E4", "E5", "E6", "E7", "Eb1", "Eb2", "Eb3", "Eb4", "Eb5", "Eb6", "Eb7", "F1", "F2",
    "F3", "F4", "F5", "F6", "F7", "G1", "G2", "G3", "G4", "G5", "G6", "G7", "Gb1", "Gb2", "Gb3",
    "Gb4", "Gb5", "Gb6", "Gb7"];
var audioType = "-mp3";
var currentInstrument = [];
var audio = [];
var volume;

document.addEventListener("drag", function (event) {
    
}, false);

document.addEventListener("dragenter", function(event) {
    if (event.target.className == "note") {
        console.log(12);
        playNote(event.target);
    }
}, false);

//https://www.html5rocks.com/en/tutorials/webaudio/intro/

window.onload = function() {
    // try {

    //     audio = new AudioContext();
    //     // if (!audio.createGain) audio.createGain = audio.createGainNode;
    //     // if (!audio.createDelay) audio.createDelay = audio.createDelayNode;
    //     // if (!audio.createScriptProcessor) audio.createScriptProcessor = audio.createJavaScriptNode;

    //     // var volume = audio.createGain();
    // }
    // catch (e) {
    //     console.log("Eroare la creare audio");
    // }
    //     volumeControl = document.getElementById("volumeSlider");
    // volumeControl.addEventListener("input", function() {
    //     volume.gain.value = this.value;
    // }, false);
    audio[0] = new Audio();
    audio[1] = new Audio();
    audio[2] = new Audio();
    audio[3] = new Audio();
    audio[4] = new Audio();
    audio[5] = new Audio();
    audio[6] = new Audio();
    audio[7] = new Audio();
    audio[8] = new Audio();
    audio[9] = new Audio();
    setInstrument("acoustic_grand_piano");
    createNotes();
    // createSequencer();
    // createOptions();

};

// var setInstrument = obj => {
//     return new Promise((resolve, reject) => {
//         var xmlhttp = new XMLHttpRequest();
//         xmlhttp.open("GET", "data/" + obj.instrumentName + audioType + ".json", true);
//         xmlhttp.onload = () => {
//             if (xmlhttp.status >= 200 && xmlhttp.status < 300 || xmlhttp == 4) {
//                 resolve(currentinstruments = JSON.parse(xmlhttp.responseText));
//             }
//             else {
//                 reject(xmlhttp.statusText);
//             }
//         };
//         xmlhttp.onerror = () => {reject(xmlhttp.statusText);};
//         xmlhttp.send();
//     });
// };

function createNotes() {
    var noteLocation = document.getElementById("musicalNotes").getElementsByTagName("div");
    
    for (var i = 0; i < 40; i++){
        noteLocation[i].textContent = keys[i];
        noteLocation[i].className = "note";
        noteLocation[i].addEventListener("click", function (event) {
            playNote(event.target);
        });
        // noteLocation[i].setAttribute("onkeypress", "playNote(keys[" + i + "]);");
        // noteLocation[i].onkeydown = playNote(keys[i]);
    }
}

function setInstrument(instrumentName) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onload = function() {
        if (this.readyState == 4 && this.status == 200) {
            currentInstrument = JSON.parse(this.responseText);
        }
    };
    xmlhttp.open("GET", "data/" + instrumentName + audioType + ".json", true);
    xmlhttp.send();
}

function play() {

}

function playNote(target) {
    console.log(target.textContent);
    audio[0].src = currentInstrument[target.textContent];
    audio[0].play();
}

function addNote(noteName, sequencerTime) {
    audio[0].src = currentInstrument[noteName];
}

function createOptions() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            currentInstrument = JSON.parse(this.responseText);
            for (var i = 0; i < currentInstrument.length; i++) {
                for (var data in currentInstrument) {
                    var selectBox = document.getElementById("instrumentBox");
                    var option = document.createElement("option");
                    option.text = "Kiwi"; // regex
                    option.value = data[i];
                    selectBox.add(option);
                }
                
            }
        }
    };
    xmlhttp.open("GET", "data/instruments.json", true);
    xmlhttp.send();
}