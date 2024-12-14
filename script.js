console.log("Let us tryy");

let currFolder;
let currentSong = new Audio();
let songs;
const songselected = document.querySelectorAll(".cardio");
const previous = document.getElementById("previous");
const next = document.getElementById("next");
const play = document.getElementById("play");

async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`http://127.0.0.1:3000/songs/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`http://127.0.0.1:3000/songs/`)[1]);
        }
    }
    return songs;
}

const playMusic = (track) => {
    currentSong.src = "/songs/" + track;
    currentSong.play();
    document.querySelector(".songinfo").innerHTML = decodeURI(track);

    // Update the play button icon to pause
    play.src = "pause.svg";
};

async function main() {
    songs = await getSongs();
    let songUL = document.querySelector(".ab").getElementsByTagName("p");
    console.log(songUL);
    // songUL.innerHTML = ""

    if (songselected) {
        Array.from(songselected).forEach((element, index) => {
            element.addEventListener("click", () => {
                if (songs.length > 0 && index < songs.length) {
                    playMusic(songs[index]);
                } else {
                    console.log("No songs available to play.");
                }
            });
        });
    } else {
        console.log("No elements with class 'cardio' found.");
    }

    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "pause.svg";
        } else {
            currentSong.pause();
            play.src = "play.svg";
        }
    });
    document.addEventListener("keydown", (e) => {
        // Prevent default behavior of Spacebar (e.g., scrolling)
        if (e.code === "Space") {
            e.preventDefault();
    
            if (currentSong.paused) {
                currentSong.play();
                play.src = "pause.svg"; // Update play button to pause icon
            } else {
                currentSong.pause();
                play.src = "play.svg"; // Update play button to play icon
            }
        }
    });
    

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".library-container").style.left = "0";
    });
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".library-container").style.left = "-120%"
    })

    next.addEventListener("click", () => {
        currentSong.pause();
        console.log("Next clicked");

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1]);
        }
    });

    previous.addEventListener("click", () => {
        currentSong.pause();
        console.log("Previous clicked");
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1]);
        }
    });

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("Setting volume to", e.target.value, "/ 100");
        currentSong.volume = parseInt(e.target.value) / 100;
        if (currentSong.volume > 0) {
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg");
        }
    });

    // Add event listener to mute the track
    document.querySelector(".volume>img").addEventListener("click", e => {
        if (e.target.src.includes("volume.svg")) {
            e.target.src = e.target.src.replace("volume.svg", "mute.svg");
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        } else {
            e.target.src = e.target.src.replace("mute.svg", "volume.svg");
            currentSong.volume = 0.10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }
    });
}

document.addEventListener("DOMContentLoaded", main);

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`;
    document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
});


