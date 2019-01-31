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
var currentInstrumentName;
var currentInstrumentNotes = [];
var audio;
var volumeValue = 2;
var sequencerMode = 0;
var playing = 0;
var playingID = [];
var timeBarInterval;
var timeline = [];
var savedNotes = [];
var cellNumber;

document.addEventListener("drag", function (event) {
    
}, false);

document.addEventListener("dragenter", function(event) {
    if (event.target.className == "note") {
        console.log(12);
        playNote(event.target.textContent);
    }
}, false);

window.onbeforeunload = function() {
    if (sequencerMode == 1) return "";
};


window.onload = function() {
    timeline = new Array();
    savedNotes = new Array();
    createHtmlNotes();
    cellNumber = 16 * 5;
    fillSequencer(0, 5);
    let selectBox = document.getElementById("instrumentBox");
    selectBox.addEventListener("change", function(event) {
        setInstrument(event.target.options[event.target.selectedIndex].id);
    });
    try {
        window.AudioContext = window.AudioContext||window.webkitAudioContext;
        audio = new AudioContext();
        if (!audio.createGain) audio.createGain = audio.createGainNode;
        if (!audio.createDelay) audio.createDelay = audio.createDelayNode;
        if (!audio.createScriptProcessor) audio.createScriptProcessor = audio.createJavaScriptNode;
    }
    catch (e) {
        console.log("Eroare la creare audio");
    }
    volumeControl = document.getElementById("volumeSlider");
    volumeControl.addEventListener("input", function() {
        volumeValue = this.value;
    }, false);
    setInstrument("acoustic_grand_piano");
    createNotes();
    // createSequencer();
    createOptions();

};

function base64ToArrayBuffer(base64) { // Transform base64 to ArrayBuffer for Web Audio
    let binaryString =  window.atob(base64);
    let len = binaryString.length;
    let bytes = new Uint8Array( len );
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}

function createSequencer() {
    sequencerLocation = document.getElementById("timelineGrid");
}

function createHtmlNotes() {
    let container = document.getElementById("musicalNotes");
    let divElement;

    for (let i = 0; i < keys.length; i++) {
        divElement = document.createElement("div");
        // divElement.addEventListener("dragenter", function(event) {
        //     playNote(event.target.textContet);
        // });
        container.appendChild(divElement);
    }
}

function fillSequencer(startColumn, groupsNumber) {
    let container = document.getElementById("timelineGrid");
    let table = document.getElementsByTagName("table");
    if (table.length == 0) {
        table = document.createElement("TABLE");
    }

    for (let line = 87; line >= 0; line--) {
        let row = table.insertRow(0);
        row.setAttribute("id", "row" + line);

        for (let column = startColumn; column < startColumn + 16 * groupsNumber; column++) {
            let cell = row.insertCell(column);
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
            cell.id = keys[line];
            cell.addEventListener("mouseup", function(event) {
                if (sequencerMode == 0 && event.target.textContent == "") {
                    event.target.textContent = event.target.id;
                    addNote(event.target.id, event.target.className);
                }
                else if (sequencerMode == 1 && event.target.textContent != "") {
                    event.target.textContent = "";
                    removeNote(event.target.id, event.target.className);
                }
                if (event.target.className > cellNumber - 16) {
                    extendSequencer(cellNumber, 2);
                    cellNumber += 2 * 16;
                }
            });
        }
    }

    container.appendChild(table);
}

function extendSequencer(startColumn, groupsNumber) {
    for (let line = 0; line < 88; line++) {
        let row = document.getElementById("row" + line);
        
        for (let column = startColumn; column < startColumn + 16 * groupsNumber; column++) {
            let cell = row.insertCell(column);
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
            cell.id = keys[line];
            cell.addEventListener("mouseup", function(event) {
                if (sequencerMode == 0 && event.target.textContent == "") {
                    event.target.textContent = event.target.id;
                    addNote(event.target.id, event.target.className);
                }
                else if (sequencerMode == 1 && event.target.textContent != "") {
                    event.target.textContent = "";
                    removeNote(event.target.id, event.target.className);
                }
                if (event.target.className > cellNumber - 16) {
                    extendSequencer(cellNumber, 2);
                    cellNumber += 2 * 16;
                }
            });
        }
    }
}

function createNotes() {
    let noteLocation = document.getElementById("musicalNotes").getElementsByTagName("div");
    
    for (let i = 0; i < 88; i++){
        noteLocation[i].textContent = keys[i];
        noteLocation[i].className = "note";
        noteLocation[i].addEventListener("click", function (event) {
            playNote(event.target.textContent);
        });
    }
}

function setInstrument(instrumentName) {
    currentInstrumentName = instrumentName;
    let xmlhttp = new XMLHttpRequest();
    let tempInstrument;
    xmlhttp.onload = function() {
        if (this.readyState == 4 && this.status == 200) {
            tempInstrument = JSON.parse(this.responseText);
            // keys = [];
            for (const note in tempInstrument) {
                audio.decodeAudioData(base64ToArrayBuffer(tempInstrument[note]), 
                function(buffer) {
                    currentInstrumentNotes[note] = buffer;
                });
            }
            // set random color for background
        }
    };
    xmlhttp.open("GET", "data/" + instrumentName + audioType + ".json", true);
    xmlhttp.send();
}

function playToggle() {
    button = document.getElementById("playButton");
    if (playing == 0) {
        // button.textContent = "";
        console.log("assfdaasdfd");
        bpm = document.getElementById("setBPM").value;
        bpm = bpmToMS(bpm);
        // get max de locatie?
        for (const time in timeline) {
            console.log(time);
            // playingID.push(setTimeout(() => {
            //     console.log("In Timeout:" + time);
                
                for (const note in timeline[time]) {
                    // console.log(timeline[time][note]);
                    // console.log(savedNotes[timeline[time][note]]);
                    console.log("BPM: " + bpm);
                    
                    console.log("Calculation: " + time * bpm / 1000);
                    
                    playNoteBuffer(savedNotes[timeline[time][note]], time * bpm / 4000);
                }
            // }, bpm * time));
        }
        
        // sequencer = document.getElementById("sequencer");
        // animationObject = document.createElement("div");
        // animationObject.id = "timeBar";
        // animationObject.style.backgroundColor = "#d67405";
        // animationObject.style.position = "absolute";
        // animationObject.style.width = "2px";
        // animationObject.style.left = "29px";
        // animationObject.style.height = "100%";
        // sequencer.appendChild(animationObject);
        // let position = 29;
        // timeBarInterval = setInterval(() => {
        //     animationObject.style.left = position + "px";
        //     position += 2;
        // }, 1);
        playing = 1;
    }
    else {
        // button.textContent = "";
        console.log("asd");
        
        // clearInterval(timeBarInterval);
        playing = 0;
    }
}

function bpmToMS(bpmValue, tempo) {
    // if tempo 4, 8, ...
    return 60000 / bpmValue;
}

function playNoteBuffer(noteBuffer, timeStart = 0, timeRampTo = 2) {
    console.log("3424242grefwefw");
    
    var volume = audio.createGain();
    volume.gain.value = volumeValue;
    volume.connect(audio.destination);
    // volume.gain.exponentialRampToValueAtTime(0.01, audio.currentTime + timeRampTo);
    var source = audio.createBufferSource();
    source.buffer = noteBuffer;
    source.connect(volume);
    source.start(audio.currentTime + timeStart, 0);
}

function playNote(note, timeStart = 0, timeRampTo = 1) {
    let volume = audio.createGain();
    volume.gain.value = volumeValue;
    volume.connect(audio.destination);
    volume.gain.exponentialRampToValueAtTime(0.01, audio.currentTime + timeRampTo);
    let source = audio.createBufferSource();
    source.buffer = currentInstrumentNotes[note];
    source.connect(volume);
    source.start(audio.currentTime, 0);
}

function addNote(noteName, sequencerTime) {
    if (Array.isArray(timeline[sequencerTime])) {
        timeline[sequencerTime].push(noteName + " " + currentInstrumentName);
        if (savedNotes[noteName + " " + currentInstrumentName] === undefined)
            savedNotes[noteName + " " + currentInstrumentName] = currentInstrumentNotes[noteName];    
    }
    else {
        timeline[sequencerTime] = new Array(noteName + " " + currentInstrumentName);
        if (savedNotes[noteName + " " + currentInstrumentName] === undefined)
            savedNotes[noteName + " " + currentInstrumentName] = currentInstrumentNotes[noteName];    
    }
    
    playNote(noteName);
}

function removeNote(noteName, sequencerTime) {
    let index = timeline[sequencerTime].indexOf(noteName + " " + currentInstrumentName);
    timeline[sequencerTime].splice(index, 1);
}

function createOptions() {
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            tempInstrumentList = JSON.parse(this.responseText);
            let selectBox = document.getElementById("instrumentBox");
            for (let data in tempInstrumentList) {
                let option = document.createElement("option");
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



// for using local files: https://stackoverflow.com/questions/13110007/web-audio-api-how-to-play-and-stop-audio