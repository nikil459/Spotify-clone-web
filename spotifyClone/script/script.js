console.log("let start javascript")
let currentsong = new Audio();
let songs;
let currfolder;
function formatTime(seconds) {
    if (isNaN(seconds)) return "00:00";
    // Calculate minutes and remaining seconds
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    // Pad with leading zero if less than 10
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    // Return the formatted time as mm:ss
    return `${formattedMinutes}:${formattedSeconds}`;
}
async function getsongs(folder) {
    currfolder = folder;
    // try {
    let a = await fetch(`http://127.0.0.1:5500/${folder}/`)
    let response = await a.text()
    // console.log(response)
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    // console.log(as)
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }
    // let songs = Array.from(as)
    //  songs.forEach(link=>console.log(link.href))
    // let songLinks = songs
    //     .map(link => link.href)
    //     .filter(href => href.endsWith(".mp3"))
    //     .map(href => href.split(`/${folder}/`)[1]);
    // return songLinks;

    // } catch (error) {
    //     console.error("Error fetching songs:", error);
    //     return [];
    // }
    let songURL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songURL.innerHTML = ""
    for (const song of songs) {
        songURL.innerHTML = songURL.innerHTML + `<li>
                            <img class="invert" src="./svg/music.svg" alt="">
                            <div class="info">
                                <div class="songname">${song.replaceAll("%20", " ")}</div>
                                <div class="songartist">Nikil</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert playbar-play" id="playbar-img" src="./svg/play.svg" alt="">
                            </div>
                        </li>`
    }
    let currentlyPlayingLi = null;
    // let playPauseImg = li.querySelector(".playnow img");
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(li => {
        li.addEventListener("click", () => {
            let songName=li.querySelector(".info").firstElementChild.innerHTML.trim()
            console.log(songName)
            // playmusic(songName);
             playPauseImg = li.querySelector(".playnow img");
        if (currentlyPlayingLi === li) {
            if (currentsong.paused) {
                currentsong.play();  
                playPauseImg.src = "./svg/pause.svg";  
                currentsong.pause();  
                playPauseImg.src = "./svg/play.svg";  
            }
        } else {
            if (currentlyPlayingLi) {
                let previousImg = currentlyPlayingLi.querySelector(".playnow img");
                previousImg.src = "./svg/play.svg";  
                currentsong.pause();  
                currentsong.currentTime = 0;  
            }
            currentsong.src = `${songName}`; 
            playmusic(songName);
            currentsong.play();  
            playPauseImg.src = "./svg/pause.svg"; 
            currentlyPlayingLi = li;
        }
        })
    })


    return songs;
}
const playmusic = (track, pause = false) => {
    // let audio = new Audio("/songs/" + track)
    currentsong.src = `/${currfolder}/` + track
    // console.log(currentsong.src)
    if (!pause) {
        currentsong.play()
        play.src = "./svg/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00/00:00";
}
async function displayAlbums() {
    let a = await fetch(`http://127.0.0.1:5500/songs/`)
    let response = await a.text()
    // console.log(response)
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardcontainer = document.getElementsByClassName("cardContainer")[0]
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        // console.log(e.href);
        if (e.href.includes("/songs/")) {
            // console.log(e.href);
            let folder = e.href.split("/").slice(-2)[1];
            // console.log(folder)
            let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`)
            let response = await a.json()
            // console.log(response)
            cardcontainer.innerHTML = cardcontainer.innerHTML + `  <div data-folder=${folder} class="card">
                        <div class="play">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="29" height="29"
                                color="#000000" fill="none">
                                <circle cx="12" cy="12" r="12" fill="green" />
                                <path
                                    d="M9.5 11.1998V12.8002C9.5 14.3195 9.5 15.0791 9.95576 15.3862C10.4115 15.6932 11.0348 15.3535 12.2815 14.6741L13.7497 13.8738C15.2499 13.0562 16 12.6474 16 12C16 11.3526 15.2499 10.9438 13.7497 10.1262L12.2815 9.32594C11.0348 8.6465 10.4115 8.30678 9.95576 8.61382C9.5 8.92086 9.5 9.6805 9.5 11.1998Z"
                                    fill="currentColor" />
                            </svg>
                        </div>
                        <img src="/songs/${folder}/cover.jpg" alt="Image">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>`
        }
    }
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        // console.log(e);
        e.addEventListener("click", async item => {
            // console.log(item,item.currentTarget.dataset)
            songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)
            playmusic(songs[0])
        })
    })
    // console.log(anchors)
}
async function main() {
    await getsongs("songs/Bhojpuri_songs")
    playmusic(songs[0], true)
    // console.log(songs)
    displayAlbums();
    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play()
            play.src = "./svg/pause.svg"

        }
        else {
            currentsong.pause();
            play.src = "./svg/play.svg"
        }
    })

    var audio = new Audio(songs[0]);
    try {
        await audio.play();  // Ensure proper playback handling
        // console.log("Playing:", songs[0]);
        audio.addEventListener("loadeddata", () => {
            let duration = audio.duration;
            // console.log(duration)
        })
    } catch (error) {
        console.error("Audio playback failed:", error);
    }

    currentsong.addEventListener("timeupdate", () => {
        // console.log(currentsong.currentTime, currentsong.durration)
        document.querySelector(".songtime").innerHTML = `${formatTime(currentsong.currentTime)}/${formatTime(currentsong.duration)}`
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%"
    })
    document.querySelector(".seekbar").addEventListener("click", (e) => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%";
        currentsong.currentTime = ((currentsong.duration) * percent) / 100;
    })
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-110%"
    })
    previous.addEventListener("click", () => {
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
        if ((index + 1) >= 0) {
            playmusic(songs[index - 1])
        }
    })
    next.addEventListener("click", () => {
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
        currentsong.pause();
        if ((index + 1) < songs.length) {
            playmusic(songs[index + 1])
        }
    })
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        currentsong.volume = parseInt(e.target.value) / 100;
    })
    document.querySelector(".volume>img").addEventListener("click", e => {
        // console.log(e.target)
        // console.log(e.target.src)
        if (e.target.src.includes("/svg/volume.svg")) {
            e.target.src = e.target.src.replace("/svg/volume.svg", "/svg/mute.svg")
            currentsong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0

        }
        else {
            e.target.src = e.target.src.replace("/svg/mute.svg", "/svg/volume.svg")
            currentsong.volume = 0.1;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10

        }
    })

}
main()