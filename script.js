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
var volumeValueSequencer = 2;
var sequencerMode = 0;
var playing = 0;
var playingID = [];
var timeBarInterval;
var timeline = new Array([]);
var savedNotes = [];
var fileBuffers = [];
var sources = [];
var cellNumber;

window.onbeforeunload = function() {
    return "";
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
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
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
        volumeValueSequencer = this.value;
    }, false);
    setInstrument("acoustic_grand_piano");
    createNotes();
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

function createHtmlNotes() {
    let container = document.getElementById("musicalNotes");
    let divElement;

    for (let i = 0; i < keys.length; i++) {
        divElement = document.createElement("div");
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
                if (sequencerMode == 0 && timeline[event.target.className] === undefined) {
                    event.target.textContent = event.target.id;
                    event.target.style.backgroundColor = "#fa7528";
                    addNote(event.target.id, event.target.className);
                }
                else if (sequencerMode == 0 && timeline[event.target.className].find(function(element) {
                    return element == event.target.id + " " + currentInstrumentName;
                }) === undefined) {
                    event.target.textContent = event.target.id;
                    event.target.style.backgroundColor = "#fa7528";
                    addNote(event.target.id, event.target.className);
                }
                else if (sequencerMode == 1 && event.target.textContent != "") {
                    event.target.textContent = "";
                    event.target.style.backgroundColor = "#383b3d";
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
            for (const note in tempInstrument) {
                audio.decodeAudioData(base64ToArrayBuffer(tempInstrument[note]), 
                function(buffer) {
                    currentInstrumentNotes[note] = buffer;
                });
            }
        }
    };
    xmlhttp.open("GET", "data/" + instrumentName + audioType + ".json", true);
    xmlhttp.send();
}


function playToggle() {
    button = document.getElementById("playButton");
    
    if (playing == 0 && (timeline.length > 0 || fileBuffers.length > 0)) {
        sources = [];
        if (fileBuffers.length > 0) {
            for (const number in fileBuffers) {
                playFile(fileBuffers[number]);
            }
        }
        button.textContent = 0x23f8;
        bpm = document.getElementById("setBPM").value;
        bpm = bpmToMS(bpm);
        for (const time in timeline) {

            for (const note in timeline[time]) {
                playNoteBuffer(savedNotes[timeline[time][note]], time * bpm / 4000);
            }
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
    else if (playing == 2) {
        button.textContent = 0x23f8;
        audio.resume();
        playing = 1;
    }
    else if (playing == 1) {
        button.textContent = 0x25B6;
        audio.suspend();
        playing = 2;
    }
}

function stop() {
    button.textContent = 0x25B6;
    audio.resume();
    
    for (let number in sources) {
        sources[number].stop(0);
    }
    playing = 0;
}

function bpmToMS(bpmValue, tempo) {
    return 60000 / bpmValue;
}

function playFile(fileBuffer) {
    console.log(fileBuffer);
    let volume = audio.createGain();
    volume.gain.value = volumeValueSequencer - 1.7;
    volume.connect(audio.destination);
    let source = audio.createBufferSource();
    source.buffer = fileBuffer;
    source.connect(volume);
    source.start(audio.currentTime, 0);
    sources.push(source);
}

function useFile() {
    fileBuffers = [];
    let files = [];
    let addedFiles = document.getElementById("fileInput").files;
    for (const number in addedFiles) {
        files.push(new Blob([addedFiles[number]]));
        let reader = new FileReader();
        reader.readAsArrayBuffer(files[number]);
        reader.onload = function () {
            audio.decodeAudioData(reader.result, 
                function (buffer) {
                    fileBuffers.push(buffer);
            });
        };
    }
}

function playNoteBuffer(noteBuffer, timeStart = 0, timeRampTo = 2) {
    let volume = "";
    volume = audio.createGain();
    volume.gain.value = volumeValueSequencer;
    volume.connect(audio.destination);
    // volume.gain.exponentialRampToValueAtTime(0.01, audio.currentTime + timeStart + timeRampTo);
    let source = "";
    source = audio.createBufferSource();
    source.buffer = noteBuffer;
    source.connect(volume);
    source.start(audio.currentTime + timeStart, 0);
    sources.push(source);
}

function playNote(note, timeStart = 0, timeRampTo = 1) {
    let volume = audio.createGain();
    volume.gain.value = volumeValueSequencer;
    volume.connect(audio.destination);
    volume.gain.exponentialRampToValueAtTime(0.01, audio.currentTime + timeStart + timeRampTo);
    let source = audio.createBufferSource();
    source.buffer = currentInstrumentNotes[note];
    source.connect(volume);
    source.start(audio.currentTime, 0);
    sources.push(source);
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
    console.log(timeline[sequencerTime]);
    let indexes;
    timeline[sequencerTime].find(function (element) {
        let result = [];
        regex = new RegExp(noteName + ".*");
        for (let number in timeline[sequencerTime]) {
            let list = regex.exec(timeline[sequencerTime][number]);
            if (list != null) {
                result.push(timeline[sequencerTime].indexOf(list[0]));
            }
        }
        indexes = result
    });
    for (let number in indexes) {
        timeline[sequencerTime].splice(indexes[number], 1);
    }
}

function createOptions() {
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let tempInstrumentList = JSON.parse(this.responseText);
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