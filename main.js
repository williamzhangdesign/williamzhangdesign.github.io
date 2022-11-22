document.getElementById("original").href = "mobile.css";
var currentPage = 0;
var totalPages = $("#pages section").children().length;
var total = "";
/*initialize*/
var tag = document.createElement("script");
tag.id = "iframe-demo";
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

/*player creation*/

var player;

function onYouTubeIframeAPIReady() {
  player = new YT.Player("video1", {
    events: {
      onReady: onPlayerReady /*Callbacks*/,
      onStateChange: onPlayerStateChange
    }
  });
}
function fancyTimeFormat(duration)
{   
    // Hours, minutes and seconds
    var hrs = ~~(duration / 3600);
    var mins = ~~((duration % 3600) / 60);
    var secs = ~~duration % 60;

    // Output like "1:01" or "4:03:59" or "123:03:59"
    var ret = "";

    if (hrs > 0) {
        ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }

    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
}
/*Loading a video player*/
function onPlayerReady(event) {
  $("#play-button").click(function () {
    player.playVideo();
    total = player.getDuration();
    time = player.getCurrentTime();
    

    playerTimeDifference = (time / total) * 100;
    progress(playerTimeDifference, $("#progressBar"));
    $(".current").text(Math.round(time));
  });

  $("#pause-button").click(function () {
    player.pauseVideo();
    total = player.getDuration();
    time = player.getCurrentTime();
    playerTimeDifference = (time / total) * 100;
    progress(playerTimeDifference, $("#progressBar"));
  });
}

function onPlayerStateChange(event) {
  if (event.data == 1) {
    // playing

    $("#progressBar").show();

    total = player.getDuration();

    myTimer = setInterval(function () {
      time = player.getCurrentTime();
      playerTimeDifference = (time / total) * 100;

      progress(playerTimeDifference, $("#progressBar"));

      $(".current").text(fancyTimeFormat(time));
    }, 1000); // 100 means repeat in 100 ms
  } else {
    // not playing

    $("#progressBar").hide();
  }

  $(".duration").text(fancyTimeFormat(total));
}

/*
Some Commonly used Methods:

player.getDuration(); - Returns Time in Numbers
-------------------
player.playVideo();
 --------------------	
player.pauseVideo();
------------------
player.getVideoUrl():String
------------------
player.getVideoEmbedCode():String
------------------
player.destroy():Void
------------------
player.getPlayerState():

    -1 – unstarted
    0 – ended
    1 – playing
    2 – paused
    3 – buffering
    5 – video cued
-------------------
player.getCurrentTime() - Returns Time in Numbers
-----------------
player.getPlaybackQuality():String

highres, hd1080, hd720, large, medium and small 
-----------------
player.setPlaybackQuality(suggestedQuality:String) - Return type Void

*/

function progress(percent, $element) {
  var progressBarWidth = (percent * $element.width()) / 100;

  // $element.find('div').animate({ width: progressBarWidth }, 500).html(percent + "%&nbsp;");

  $element.find("div").animate({ width: progressBarWidth });
}

$(document).ready(function (e) {
  $("#volume").on("mousemove", function () {
    //alert();
    $(".vol").text($(this).val());
    player.setVolume($(this).val());
  });
});



console.log(totalPages)
$('body')
  .on('click', '#next', nextPage)
  .on('click', '#prev', prevPage);

$('.book').hammer().on("swipeleft", nextPage);
$('.book').hammer().on("swiperight", prevPage);

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