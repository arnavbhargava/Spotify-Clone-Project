console.log("Lets write JavaScript");


// Only play the current somg
let currentSong = new Audio();

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

async function getSongs() {
  let a = await fetch("http://127.0.0.1:3000/songs2/");
  let response = await a.text();
    // console.log(response);
  let div = document.createElement("div");
  div.innerHTML = response;
  let a_s = div.getElementsByTagName("a");
  let songs = [];
  for (let i = 0; i < a_s.length; i++) {
    const element = a_s[i];
    // console.log(element);
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split("/songs2/")[1]);
    }
  }
  return songs;
}

const playMusic = (track) => {
  // let audio = new Audio("/songs2/" + track);
  currentSong.src = "/songs2/" + track;
  // console.log(currentSong.src);

  currentSong.play();
  document.querySelector(".songButtons").querySelector("#play").setAttribute("src", "./img/pause.svg");
  document.querySelector(".songInfo").innerHTML = "<span>Track</span>";
  document.querySelector(".songTime").innerHTML = "<span>00:00/00:00</span>";
}



async function main() {

  // Get the list of all the songs
  let songs = await getSongs();
  // console.log(songs);

  // Show all the songs in the playlist
  let songUL = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];
  for (let song of songs) {
    songUL.innerHTML =
      songUL.innerHTML +
      `<li> <img class="invert" src="./img/music.svg" alt="" />
                <div class="info">
                  <div>${song.replaceAll("%20", " ").split(".")[0]}</div>
                  <div>Song Artist</div>
                </div>
                <div class="playNow">
                <img id="playOnPlaylist" class="invert" src="./img/play.svg" alt="" />
                  ${/*<span>Play Now</span>*/''}
                </div></li>`;
  }
  let LI = document
    .querySelector(".songList")
    .firstElementChild.querySelectorAll("li");
  let Array_LI = Array.from(LI);
  // console.log(Array_LI);

  for (let i = 0; i < Array_LI.length; i++) {
    Array_LI[i].addEventListener("mouseover", () => {
      document.querySelectorAll(".playNow")[i].style.visibility = "visible";
    });
    Array_LI[i].addEventListener("mouseout", () => {
      document.querySelectorAll(".playNow")[i].style.visibility = "hidden";
    });
    
  }
  
  // Attach an event listener to each song li to play song on double click.
  Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach((e) => {
    e.addEventListener("dblclick", () => {
      // console.log(e.querySelector(".info").firstElementChild.innerHTML.concat(".mp3").trim());
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.concat(".mp3").trim());
      document.querySelector(".songButtons").querySelector("#play").setAttribute("src", "./img/pause.svg");
    })
  })

  // Attach an event listener to the playNow image inside the li to play song on double click.
  Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach((e) => {
    e.querySelector(".playNow").firstElementChild.addEventListener("click", () => {
      // console.log(e.querySelector(".info").firstElementChild.innerHTML.concat(".mp3").trim());
        playMusic(e.querySelector(".info").firstElementChild.innerHTML.concat(".mp3").trim());
    })
  })

  // Attach an event listener to previous, play and next buttons on the playbar.
  document.querySelector(".songButtons").querySelector("#previous").addEventListener("click", () => {
    console.log(currentSong);
    currentSong.previousElementSibling.play();
  })

  document.querySelector(".songButtons").querySelector("#play").addEventListener("click", (e) => {
    console.log(e);
    if (currentSong.paused) {
      currentSong.play();
      play.src= "./img/pause.svg";
      document.querySelector(".songButtons").querySelector("#play").setAttribute("src", "./img/pause.svg");
    }
    else {
      currentSong.pause();
      document.querySelector(".songButtons").querySelector("#play").setAttribute("src", "./img/play2.svg");
    }
    // currentSong.paused? "": document.querySelector("#play").setAttribute("src", "./img/pause.svg");

  })

  document.querySelector(".songButtons").querySelector("#previous").addEventListener("click", (e) => {
    currentSong = currentSong.src - 1;
    console.log(currentSong);
  })

  // Listen for Time Update event
  currentSong.addEventListener("timeupdate", () => {
    
    // console.log(currentSong.src.split("/songs2/")[1].split(".mp3")[0].replaceAll("%20", " "));
    document.querySelector(".songInfo").innerHTML = currentSong.src.split("/songs2/")[1].split(".mp3")[0].replaceAll("%20", " ");

    // console.log(Math.floor(currentSong.currentTime), Math.floor(currentSong.duration));
    document.querySelector(".songTime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`;

    // Functionality for seekbar to move the circle in when song plays
    document.querySelector(".circle").style.left = (currentSong.currentTime/currentSong.duration) * 100 + "%";
  })
  
  // Event Listener on Seekbar to click the point on the seekbar
    document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX/e.target.getBoundingClientRect().width) * 98;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = ((currentSong.duration) * percent) / 100; 
    // document.querySelector(".songTime").innerHTML = `${secondsToMinutesSeconds(e.currentSong.currentTime)}`;
      
  })

  // document.querySelector(".circle").addEventListener("ondragstart", (e) => {
  //   console.log(e.target);
  // })
  
 
}

main();
