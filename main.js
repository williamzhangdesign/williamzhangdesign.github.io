document.getElementById("original").href = "mobile.css";
var currentPage = 0;
var totalPages = $("#pages section").children().length;
var total = "";


// Select all the elements in the HTML page
// and assign them to a variable
let now_playing = document.querySelector(".now-playing");
let track_art = document.querySelector(".track-art");
let track_name = document.querySelector(".track-name");
let album_name = document.querySelector(".album-name");
let track_artist = document.querySelector(".track-artist");
 
let playpause_btn = document.querySelector(".playpause-track");
let next_btn = document.querySelector(".next-track");
let prev_btn = document.querySelector(".prev-track");
 
let seek_slider = document.querySelector(".seek_slider");
let volume_slider = document.querySelector(".volume_slider");
let curr_time = document.querySelector(".current-time");
let total_duration = document.querySelector(".total-duration");
 
// Specify globally used values
let track_index = 0;
let isPlaying = false;
let updateTimer;
 
// Create the audio element for the player
let curr_track = document.createElement('audio');
 


// Define the list of tracks that have to be played
let track_list = [
  {
    name: "Last Christmas",
    artist: "Wham!",
    album: "LAST CHRISTMAS",
    image: "Image URL",
    path: "audio/Christmas.mp3"
  },
  {
    name: "Last Christmas",
    artist: "Wham!",
    album: "LAST CHRISTMAS",
    image: "Image URL",
    path: "audio/Christmas.mp3"
  },
  {
    name: "Last Christmas",
    artist: "Wham!",
    album: "LAST CHRISTMAS",
    image: "Image URL",
    path: "audio/Christmas.mp3"
  },
  
];

function seekTo() {
  // Calculate the seek position by the
  // percentage of the seek slider
  // and get the relative duration to the track
  seekto = curr_track.duration * (seek_slider.value / 100);
 
  // Set the current track position to the calculated seek position
  curr_track.currentTime = seekto;
}
 
function setVolume() {
  // Set the volume according to the
  // percentage of the volume slider set
  curr_track.volume = volume_slider.value / 100;
}
 
function seekUpdate() {
  let seekPosition = 0;
 
  // Check if the current track duration is a legible number
  if (!isNaN(curr_track.duration)) {
    seekPosition = curr_track.currentTime * (100 / curr_track.duration);
    seek_slider.value = seekPosition;
    


    total =  curr_track.duration;
    time = curr_track.currentTime;
    playerTimeDifference = (time / total) * 100;
    var progressBarWidth = (playerTimeDifference * $(".seek_slider").width()) / 100;
    $(".seek_slider").find(".inner").animate({ width: progressBarWidth });
    // Calculate the time left and the total duration
    let currentMinutes = Math.floor(curr_track.currentTime / 60);
    let currentSeconds = Math.floor(curr_track.currentTime - currentMinutes * 60);
    let durationMinutes = Math.floor(curr_track.duration / 60);
    let durationSeconds = Math.floor(curr_track.duration - durationMinutes * 60);
 
    // Add a zero to the single digit time values
    if (currentSeconds < 10) { currentSeconds = "0" + currentSeconds; }
    if (durationSeconds < 10) { durationSeconds = "0" + durationSeconds; }
    if (currentMinutes < 10) { currentMinutes = "0" + currentMinutes; }
    if (durationMinutes < 10) { durationMinutes = "0" + durationMinutes; }
 
    // Display the updated duration
    curr_time.textContent = currentMinutes + ":" + currentSeconds;
    total_duration.textContent = durationMinutes + ":" + durationSeconds;
  }
}
function resetValues() {
  curr_time.textContent = "00:00";
  total_duration.textContent = "00:00";
  seek_slider.value = 0;
}
function playTrack() {
  // Play the loaded track
  curr_track.play();
  isPlaying = true;
}


function nextTrack() {
  // Go back to the first track if the
  // current one is the last in the track list
  if (track_index < track_list.length - 1)
    track_index += 1;
  else track_index = 0;
 
  // Load and play the new track
  loadTrack(track_index);
  playTrack();
}
 
function prevTrack() {
  // Go back to the last track if the
  // current one is the first in the track list
  if (track_index > 0)
    track_index -= 1;
  else track_index = track_list.length - 1;
   
  // Load and play the new track
  loadTrack(track_index);
  playTrack();}

function loadTrack(track_index) {
  // Clear the previous seek timer
  clearInterval(updateTimer);
  resetValues();
 
  // Load a new track
  curr_track.src = track_list[track_index].path;
  curr_track.load();
 
  // Update details of the track

  track_name.textContent = track_list[track_index].name;
  album_name.textContent = track_list[track_index].album;

  track_artist.textContent = track_list[track_index].artist;
  now_playing.textContent =
     (track_index + 1) + " of " + track_list.length;
 
  // Set an interval of 1000 milliseconds
  // for updating the seek slider
  updateTimer = setInterval(seekUpdate, 1000);
 
  // Move to the next track if the current finishes playing
  // using the 'ended' event
  curr_track.addEventListener("ended", nextTrack);
 
  // Apply a random background color
}

function playpauseTrack() {
  // Switch between playing and pausing
  // depending on the current state
  if (!isPlaying) {$(".statusbar").html("▶︎&nbsp;&nbsp;Now Playing&nbsp;<img style = 'margin-right: -0.3em;margin-top: 0.1em; margin-bottom: -0.1em; height: 0.98em; width: auto;' src = 'visuals/battery.svg'><hr class = 'statusbarline'>");
  playTrack();}
  else{ $(".statusbar").html("❚❚&nbsp;&nbsp;Now Playing&nbsp;<img style = 'margin-right: -0.225em;margin-top: -0.4em; margin-bottom: -0.05em; height: 0.98em; width: auto;' src = 'visuals/battery.svg'><hr class = 'statusbarline'>");
  pauseTrack();}
}

 
function pauseTrack() {
  // Pause the loaded track
  curr_track.pause();
  isPlaying = false;
 
  // Replace icon with the play icon
}
function mute() {
  // Mutes and
  var elems = document.querySelectorAll("video, audio");

  [].forEach.call(elems, function(elem) { muteMe(elem); });
}






function prevPage() {
  currentPage--;
  $('.flipped')
    .last().toggleClass('flipDown')
    .toggleClass('flipped active')
    .siblings('.page')
    .removeClass('active');
  $('body')
    .off('click', '#next', nextPage)
    .off('click', '#prev', prevPage);
  setTimeout(function () {
    $('body')
      .on('click', '#next', nextPage)
      .on('click', '#prev', prevPage);
  }, 1100);
}

function nextPage() {
  if (currentPage == totalPages - 1) {
    console.log("Reached Back Cover (Thank you Page)");
    return;
  }


  currentPage++;
  console.log(currentPage)

  $('.active')
    .toggleClass('active flipped')
    .next('.page')
    .addClass('active')
  $('body')
    .off('click', '#next', nextPage)
    .off('click', '#prev', prevPage);
  setTimeout(function () {
    $('body')
      .on('click', '#next', nextPage)
      .on('click', '#prev', prevPage);
  }, 1100);

}
console.log(totalPages)
loadTrack(track_index);
$('body')
  .on('click', '#next',  playpauseTrack)
  .on('click', '#prev', prevPage)
  .on('click', '#trigger', playpauseTrack)

$('.book').hammer().on("swipeleft", nextPage);
$('.book').hammer().on("swiperight", prevPage);

/*
var mediaQuery = window.matchMedia("(max-width: 414px)");
function Load() {
    if (window.innerWidth <= 414) {
        $(document.body).html(`
    <div class="scene">
      <article class="book">
        <section class="page active">
          <div class="content">
            <h1>Quick iPad Flipping Book Demo</h1>
            <p>
              Sehen Sie, Webstandards sind das Regelwerk, auf dem Webseiten aufbauen. So gibt es Regeln für HTML, CSS, JavaScript oder auch XML; Worte, die Sie vielleicht schon einmal von Ihrem Entwickler gehört haben. Diese Standards sorgen dafür, dass alle Beteiligten
              aus einer Webseite den größten Nutzen ziehen.
            </p>
            <p>
              Im Gegensatz zu früheren Webseiten müssen wir zum Beispiel nicht mehr zwei verschiedene Webseiten für den Internet Explorer und einen anderen Browser programmieren. Es reicht eine Seite, die - richtig angelegt - sowohl auf verschiedenen Browsern im Netz
              funktioniert, aber ebenso gut für den Ausdruck oder
            </p>
          </div>
        </section>
        <section class="page">
          <div class="content">
            <h1>– 2 –</h1>
            <p>
              Sehen Sie, Webstandards sind das Regelwerk, auf dem Webseiten aufbauen. So gibt es Regeln für HTML, CSS, JavaScript oder auch XML; Worte, die Sie vielleicht schon einmal von Ihrem Entwickler gehört haben. Diese Standards sorgen dafür, dass alle Beteiligten
              aus einer Webseite den größten Nutzen ziehen.
            </p>
            <p>
              Im Gegensatz zu früheren Webseiten müssen wir zum Beispiel nicht mehr zwei verschiedene Webseiten für den Internet Explorer und einen anderen Browser programmieren. Es reicht eine Seite, die - richtig angelegt - sowohl auf verschiedenen Browsern im Netz
              funktioniert, aber ebenso gut für den Ausdruck oder
            </p>
          </div>
        </section>
        <section class="page">
          <div class="content">
            <h1>– 3 –</h1>
            <p>
              Sehen Sie, Webstandards sind das Regelwerk, auf dem Webseiten aufbauen. So gibt es Regeln für HTML, CSS, JavaScript oder auch XML; Worte, die Sie vielleicht schon einmal von Ihrem Entwickler gehört haben. Diese Standards sorgen dafür, dass alle Beteiligten
              aus einer Webseite den größten Nutzen ziehen.
            </p>
            <p>
              Im Gegensatz zu früheren Webseiten müssen wir zum Beispiel nicht mehr zwei verschiedene Webseiten für den Internet Explorer und einen anderen Browser programmieren. Es reicht eine Seite, die - richtig angelegt - sowohl auf verschiedenen Browsern im Netz
              funktioniert, aber ebenso gut für den Ausdruck oder
            </p>
          </div>
        </section>
        <section class="page">
          <div class="content">
            <h1>– 4 –</h1>
            <p>
              Sehen Sie, Webstandards sind das Regelwerk, auf dem Webseiten aufbauen. So gibt es Regeln für HTML, CSS, JavaScript oder auch XML; Worte, die Sie vielleicht schon einmal von Ihrem Entwickler gehört haben. Diese Standards sorgen dafür, dass alle Beteiligten
              aus einer Webseite den größten Nutzen ziehen.
            </p>
            <p>
              Im Gegensatz zu früheren Webseiten müssen wir zum Beispiel nicht mehr zwei verschiedene Webseiten für den Internet Explorer und einen anderen Browser programmieren. Es reicht eine Seite, die - richtig angelegt - sowohl auf verschiedenen Browsern im Netz
              funktioniert, aber ebenso gut für den Ausdruck oder
            </p>
          </div>
        </section>
        <section class="page">
          <div class="content">
            <h1>– 5 –</h1>
            <p>
              Sehen Sie, Webstandards sind das Regelwerk, auf dem Webseiten aufbauen. So gibt es Regeln für HTML, CSS, JavaScript oder auch XML; Worte, die Sie vielleicht schon einmal von Ihrem Entwickler gehört haben. Diese Standards sorgen dafür, dass alle Beteiligten
              aus einer Webseite den größten Nutzen ziehen.
            </p>
            <p>
              Im Gegensatz zu früheren Webseiten müssen wir zum Beispiel nicht mehr zwei verschiedene Webseiten für den Internet Explorer und einen anderen Browser programmieren. Es reicht eine Seite, die - richtig angelegt - sowohl auf verschiedenen Browsern im Netz
              funktioniert, aber ebenso gut für den Ausdruck oder
            </p>
          </div>
        </section>
    
      </article>
      <button id='next'>Next</button>
      <button id='prev'>Previous</button>
    </div>
    `);
        document.getElementById("original").href = "mobile.css";
        var currentPage = 0;

        $('body')
            .on('click', '#next', nextPage)
            .on('click', '#prev', prevPage);

        $('.book').hammer().on("swipeleft", nextPage);
        $('.book').hammer().on("swiperight", prevPage);

        function prevPage() {
            $('.flipped')
                .last()
                .toggleClass('flipped active')
                .siblings('.page')
                .removeClass('active');
        }

        function nextPage() {
            $('.active')
                .toggleClass('active flipped')
                .next('.page')
                .addClass('active');
        }
    }

    //desktop
    if (window.innerWidth > 414) {

        $(document.body).html(`<div class="scene">
        <article class="book">
        <section class="page active">
          <div class="front">
            <h1>Quick iPad Flipping Book Demo</h1>
            <p>
              Sehen Sie, Webstandards sind das Regelwerk, auf dem Webseiten aufbauen. So gibt es Regeln für HTML, CSS, JavaScript oder auch XML; Worte, die Sie vielleicht schon einmal von Ihrem Entwickler gehört haben. Diese Standards sorgen dafür, dass alle Beteiligten aus einer Webseite den größten Nutzen ziehen.
            </p>
            <p>
              Im Gegensatz zu früheren Webseiten müssen wir zum Beispiel nicht mehr zwei verschiedene Webseiten für den Internet Explorer und einen anderen Browser programmieren. Es reicht eine Seite, die - richtig angelegt - sowohl auf verschiedenen Browsern im Netz funktioniert, aber ebenso gut für den Ausdruck oder
            </p>
          </div>
          <div class="back">
            <h1>– 1 –</h1>
            <p>
              Er hörte leise Schritte hinter sich. Das bedeutete nichts Gutes. Wer würde ihm schon folgen, spät in der Nacht und dazu noch in dieser engen Gasse mitten im übel beleumundeten Hafenviertel? Gerade jetzt, wo er das Ding seines Lebens gedreht hatte und mit der Beute verschwinden wollte!
            </p>
            <p>
              Oder gehörten die Schritte hinter ihm zu einem der unzähligen Gesetzeshüter dieser Stadt, und die stählerne Acht um seine Handgelenke würde gleich zuschnappen? Er konnte die Aufforderung stehen zu bleiben schon hören. Gehetzt sah er sich um.
            </p>
          </div>    
        </section>
        <section class="page">
          <div class="front">
            <h1>– 2 –</h1>
            <p>
              Sehen Sie, Webstandards sind das Regelwerk, auf dem Webseiten aufbauen. So gibt es Regeln für HTML, CSS, JavaScript oder auch XML; Worte, die Sie vielleicht schon einmal von Ihrem Entwickler gehört haben. Diese Standards sorgen dafür, dass alle Beteiligten aus einer Webseite den größten Nutzen ziehen.
            </p>
            <p>
              Im Gegensatz zu früheren Webseiten müssen wir zum Beispiel nicht mehr zwei verschiedene Webseiten für den Internet Explorer und einen anderen Browser programmieren. Es reicht eine Seite, die - richtig angelegt - sowohl auf verschiedenen Browsern im Netz funktioniert, aber ebenso gut für den Ausdruck oder
            </p>
          </div>
          <div class="back">
            <h1>– 3 –</h1>
            <p>
              Er hörte leise Schritte hinter sich. Das bedeutete nichts Gutes. Wer würde ihm schon folgen, spät in der Nacht und dazu noch in dieser engen Gasse mitten im übel beleumundeten Hafenviertel? Gerade jetzt, wo er das Ding seines Lebens gedreht hatte und mit der Beute verschwinden wollte!
            </p>
            <p>
              Oder gehörten die Schritte hinter ihm zu einem der unzähligen Gesetzeshüter dieser Stadt, und die stählerne Acht um seine Handgelenke würde gleich zuschnappen? Er konnte die Aufforderung stehen zu bleiben schon hören. Gehetzt sah er sich um.
            </p>
          </div>    
        </section>
          <section class="page">
          <div class="front">
            <h1>– 4 –</h1>
            <p>
              Sehen Sie, Webstandards sind das Regelwerk, auf dem Webseiten aufbauen. So gibt es Regeln für HTML, CSS, JavaScript oder auch XML; Worte, die Sie vielleicht schon einmal von Ihrem Entwickler gehört haben. Diese Standards sorgen dafür, dass alle Beteiligten aus einer Webseite den größten Nutzen ziehen.
            </p>
            <p>
              Im Gegensatz zu früheren Webseiten müssen wir zum Beispiel nicht mehr zwei verschiedene Webseiten für den Internet Explorer und einen anderen Browser programmieren. Es reicht eine Seite, die - richtig angelegt - sowohl auf verschiedenen Browsern im Netz funktioniert, aber ebenso gut für den Ausdruck oder
            </p>
          </div>
          <div class="back">
            <h1>– 5 –</h1>
            <p>
              Er hörte leise Schritte hinter sich. Das bedeutete nichts Gutes. Wer würde ihm schon folgen, spät in der Nacht und dazu noch in dieser engen Gasse mitten im übel beleumundeten Hafenviertel? Gerade jetzt, wo er das Ding seines Lebens gedreht hatte und mit der Beute verschwinden wollte!
            </p>
            <p>
              Oder gehörten die Schritte hinter ihm zu einem der unzähligen Gesetzeshüter dieser Stadt, und die stählerne Acht um seine Handgelenke würde gleich zuschnappen? Er konnte die Aufforderung stehen zu bleiben schon hören. Gehetzt sah er sich um.
            </p>
          </div>    
        </section>
          <section class="page">
          <div class="front">
            <h1>– 6 –</h1>
            <p>
              Sehen Sie, Webstandards sind das Regelwerk, auf dem Webseiten aufbauen. So gibt es Regeln für HTML, CSS, JavaScript oder auch XML; Worte, die Sie vielleicht schon einmal von Ihrem Entwickler gehört haben. Diese Standards sorgen dafür, dass alle Beteiligten aus einer Webseite den größten Nutzen ziehen.
            </p>
            <p>
              Im Gegensatz zu früheren Webseiten müssen wir zum Beispiel nicht mehr zwei verschiedene Webseiten für den Internet Explorer und einen anderen Browser programmieren. Es reicht eine Seite, die - richtig angelegt - sowohl auf verschiedenen Browsern im Netz funktioniert, aber ebenso gut für den Ausdruck oder
            </p>
          </div>
          <div class="back">
            <h1>– 7 –</h1>
            <p>
              Er hörte leise Schritte hinter sich. Das bedeutete nichts Gutes. Wer würde ihm schon folgen, spät in der Nacht und dazu noch in dieser engen Gasse mitten im übel beleumundeten Hafenviertel? Gerade jetzt, wo er das Ding seines Lebens gedreht hatte und mit der Beute verschwinden wollte!
            </p>
            <p>
              Oder gehörten die Schritte hinter ihm zu einem der unzähligen Gesetzeshüter dieser Stadt, und die stählerne Acht um seine Handgelenke würde gleich zuschnappen? Er konnte die Aufforderung stehen zu bleiben schon hören. Gehetzt sah er sich um.
            </p>
          </div>    
        </section>
          <section class="page">
          <div class="front">
            <h1>– 8 –</h1>
            <p>
              Sehen Sie, Webstandards sind das Regelwerk, auf dem Webseiten aufbauen. So gibt es Regeln für HTML, CSS, JavaScript oder auch XML; Worte, die Sie vielleicht schon einmal von Ihrem Entwickler gehört haben. Diese Standards sorgen dafür, dass alle Beteiligten aus einer Webseite den größten Nutzen ziehen.
            </p>
            <p>
              Im Gegensatz zu früheren Webseiten müssen wir zum Beispiel nicht mehr zwei verschiedene Webseiten für den Internet Explorer und einen anderen Browser programmieren. Es reicht eine Seite, die - richtig angelegt - sowohl auf verschiedenen Browsern im Netz funktioniert, aber ebenso gut für den Ausdruck oder
            </p>
          </div>
          <div class="back">
            <h1>– 9 –</h1>
            <p>
              Er hörte leise Schritte hinter sich. Das bedeutete nichts Gutes. Wer würde ihm schon folgen, spät in der Nacht und dazu noch in dieser engen Gasse mitten im übel beleumundeten Hafenviertel? Gerade jetzt, wo er das Ding seines Lebens gedreht hatte und mit der Beute verschwinden wollte!
            </p>
            <p>
              Oder gehörten die Schritte hinter ihm zu einem der unzähligen Gesetzeshüter dieser Stadt, und die stählerne Acht um seine Handgelenke würde gleich zuschnappen? Er konnte die Aufforderung stehen zu bleiben schon hören. Gehetzt sah er sich um.
            </p>
          </div>    
        </section>
        
      </article>
      </div>`);
        document.getElementById("original").href = "desktop.css";
        var currentPage = 0;

        $('.book')
            .on('click', '.active', nextPage)
            .on('click', '.flipped', prevPage);

        var hammertime = new Hammer($('.book')[0]);
        hammertime.on("swipeleft", nextPage);
        hammertime.on("swiperight", prevPage);

        function prevPage() {

            $('.flipped')
                .last()
                .removeClass('flipped')
                .addClass('active')
                .siblings('.page')
                .removeClass('active');
        }
        function nextPage() {

            $('.active')
                .removeClass('active')
                .addClass('flipped')
                .next('.page')
                .addClass('active')
                .siblings();


        }


    }

}
$(window).load(function () {
    Load();
});

$(window).resize(function () {
    Load();
});




var currentPage = 0;

$('body')
    .on('click', '#next', nextPage)
    .on('click', '#prev', prevPage);

$('.book').hammer().on("swipeleft", nextPage);
$('.book').hammer().on("swiperight", prevPage);

function prevPage() {
    $('.flipped')
        .last()
        .toggleClass('flipped active')
        .siblings('.page')
        .removeClass('active');
}

function nextPage() {
    $('.active')
        .toggleClass('active flipped')
        .next('.page')
        .addClass('active');
}
*/