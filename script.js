var keys = [
    "A0", "Bb0", "B0", "C1", "Db1", "D1", "Eb1", "E1", "F1",
    "Gb1", "G1", "Ab1", "A1", "Bb1", "B1", "C2", "Db2", "D2", "Eb2",
    "E2", "F2", "Gb2", "G2", "Ab2", "A2", "Bb2", "B2", "C3", "Db3", "D3",
    "Eb3", "E3", "F3", "Gb3", "G3", "Ab3", "A3", "Bb3", "B3", "C4", "Db4",
    "D4", "Eb4", "E4", "F4", "Gb4", "G4", "Ab4", "A4", "Bb4", "B4", "C5",
    "Db5", "D5", "Eb5", "E5", "F5", "Gb5", "G5", "Ab5", "A5", "Bb5", "B5",
    "C6", "Db6", "D6", "Eb6", "E6", "F6", "Gb6", "G6", "Ab6", "A6", "Bb6",
    "B6", "C7", "Db7", "D7", "Eb7", "E7", "F7", "Gb7", "G7", "Ab7", "A7",
    "Bb7", "B7", "C8"
    ];
var audioType = "-mp3";
var instrumentList = [];
var currentInstrument = [];
var audio;
var volume;
var sequencerMode = 0;

document.addEventListener("drag", function (event) {
    
}, false);

document.addEventListener("dragenter", function(event) {
    if (event.target.className == "note") {
        console.log(12);
        playNote(event.target);
    }
}, false);


window.onload = function() {
    createHtmlNotes();
    fillSequencer();
    var selectBox = document.getElementById("instrumentBox");
    selectBox.addEventListener("change", function(event) {
        setInstrument(event.target.options[event.target.selectedIndex].id);
    });
    try {
        window.AudioContext = window.AudioContext||window.webkitAudioContext;
        audio = new AudioContext();
        if (!audio.createGain) audio.createGain = audio.createGainNode;
        if (!audio.createDelay) audio.createDelay = audio.createDelayNode;
        if (!audio.createScriptProcessor) audio.createScriptProcessor = audio.createJavaScriptNode;
        volume = audio.createGain();
        volume.gain.minValue = 0;
        volume.gain.maxValue = 100;
        volume.gain.value = 2;
        volume.connect(audio.destination);
    }
    catch (e) {
        console.log("Eroare la creare audio");
    }
    volumeControl = document.getElementById("volumeSlider");
    volumeControl.addEventListener("input", function() {
        volume.gain.value = this.value;
    }, false);
    setInstrument("acoustic_grand_piano");
    createNotes();
    // createSequencer();
    createOptions();

};

function base64ToArrayBuffer(base64) { // Transform base64 to ArrayBuffer for Web Audio
    var binaryString =  window.atob(base64);
    var len = binaryString.length;
    var bytes = new Uint8Array( len );
    for (var i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}

function createSequencer() {
    sequencerLocation = document.getElementById("timelineGrid");
}

function createHtmlNotes() {
    var container = document.getElementById("musicalNotes");
    var divElement;

    for (var i = 0; i < keys.length; i++) {
        divElement = document.createElement("div");
        // divElement.addEventListener("dragenter", function(event) {
        //     playNote(event.target);
        // });
        container.appendChild(divElement);
    }
}

function fillSequencer() {
    var container = document.getElementById("timelineGrid");

    var table = document.createElement("TABLE");
    table.style.borderSpacing = "0px";
    table.style.boxSizing = "border-box";

    for (var line = 0; line < 88; line++) {
        var row = table.insertRow(0);
        row.style.height = "18px";

        for (var column = 0; column < 16 * 5; column++) {
            var cell = row.insertCell(column);
            cell.className = `${column}`;
            if ((column + 1) % 16 == 0) {
                cell.style.borderRight = "3px solid #132542";
            }
            else if ((column + 1) % 4 == 0 && (column + 1) % 16 != 0) {
                cell.style.borderRight = "2px solid #132542";
            }
            else {
                cell.style.borderRight = "0.5px solid #313233";
            }
            cell.style.minWidth = "30px";
            cell.style.boxSizing = "border-box";
            
            cell.style.borderBottom = "0.5px solid #313233";
            cell.style.userSelect = "none";
            cell.style.webkitUserSelect = "none";
            cell.style.msUserSelect = "none";
        }
    }

    container.appendChild(table);
    
    // for (var line = 0; line < 88; line++) {
    //     for (var column = 0; column < 88 * 3; column++) {
    //         divElement = document.createElement("div");
    //         divElement.setAttribute("class", column);
            
    //         divElement.style.color = "#383b3d";
    //         divElement.style.userSelect = "none";
    //         divElement.style.webkitUserSelect = "none";
    //         divElement.style.msUserSelect = "none";
    //         divElement.style.height = "2.7%";
    //         divElement.style.width = "1%";
    //         divElement.style.cssFloat = "left";
    //         divElement.style.maxHeight = "18px";
    //         // a = Math.floor(Math.random() * 256);
    //         // b = Math.floor(Math.random() * 256);
    //         // c = Math.floor(Math.random() * 256);
    //         // divElement.style.backgroundColor = `rgb(${a}, ${b}, ${c})`;
    //         divElement.style.boxSizing = "border-box";
    //         divElement.style.borderBottom = "1px solid black";
    //         divElement.style.borderRight = "1px solid black";
    //         color: white;
    // user-select: none;
    // -moz-user-select: none;
    // -khtml-user-select: none;
    // -webkit-user-select: none;
    // -o-user-select: none;
    // height: 2%;
    // width: 100%;
    //         container.appendChild(divElement);
    //     }
    // }
}

function createNotes() {
    var noteLocation = document.getElementById("musicalNotes").getElementsByTagName("div");
    
    for (var i = 0; i < 88; i++){
        noteLocation[i].textContent = keys[i];
        noteLocation[i].className = "note";
        noteLocation[i].addEventListener("click", function (event) {
            playNote(event.target);
        });
    }
}

function setInstrument(instrumentName) {
    var xmlhttp = new XMLHttpRequest();
    var tempInstrument;
    xmlhttp.onload = function() {

        if (this.readyState == 4 && this.status == 200) {
            tempInstrument = JSON.parse(this.responseText);
            keys = [];
            for (const note in tempInstrument) {
                audio.decodeAudioData(base64ToArrayBuffer(tempInstrument[note]), 
                function(buffer) {
                    temp = new Object(buffer);
                    currentInstrument[note] = temp;
                });
            }
        }
    };
    xmlhttp.open("GET", "data/" + instrumentName + audioType + ".json", true);
    xmlhttp.send();
}

function playToggle() {
    button = document.getElementById("playButton");
    bpm = document.getElementById("setBPM").value;
    
}

function playNote(target) {
    var source = audio.createBufferSource();
    source.buffer = currentInstrument[target.textContent];
    source.connect(volume);
    source.start(0);
}

function addNote(noteName, sequencerTime) {
    // audio[0].src = currentInstrument[noteName];
}

function removeNote(noteName, sequencerTime) {
    
}

function createOptions() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            tempInstrumentList = JSON.parse(this.responseText);
            var selectBox = document.getElementById("instrumentBox");
            for (var data in tempInstrumentList) {
                var option = document.createElement("option");
                option.text = data;
                option.id = tempInstrumentList[data];
                selectBox.add(option);
            }
            selectBox.selectedIndex = 2;
        }
    };
    xmlhttp.open("GET", "data/instrumentsDictionary.json", true);
    xmlhttp.send();
}

function addMode() {
    document.getElementById("deleteMusic").style.color = "#ffffff";
    document.getElementById("writeMusic").style.color = "#ff0000";
    sequencerMode = 0;
}

function deleteMode() {
    document.getElementById("writeMusic").style.color = "#ffffff";
    document.getElementById("deleteMusic").style.color = "#ff0000";
    sequencerMode = 1;
}