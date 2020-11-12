$(window).on("load", function () {
  $(".loader-wrapper").fadeOut("slow");
});

$('.navTrigger').click(function () {
    $(this).toggleClass('active');
    console.log("Clicked menu");
    $("#mainListDiv").toggleClass("show_list");
    $("#mainListDiv").fadeIn();
    console.log('hi');
});

/*var prevScrollpos = window.pageYOffset;
    window.onscroll = function() {
      var currentScrollPos = window.pageYOffset;
      if (prevScrollpos > currentScrollPos) {
        document.getElementById("pogger").style.top = "0";
      } else {
        document.getElementById("pogger").style.top = "-110px";
      }
      prevScrollpos = currentScrollPos;
    }*/
    window.onscroll = function() {
      if (window.pageYOffset > 300) {
        document.getElementById("pogger").style.top = "-110px";
        document.getElementById("pogger").style.opacity = 0;
        console.log("fade")

      } else {
        document.getElementById("pogger").style.top = "0";
        document.getElementById("pogger").style.opacity = 1;

        console.log("unfade")


      }
    }

window.dataLayer = window.dataLayer || [];

function gtag() {
    dataLayer.push(arguments);
}
gtag('js', new Date());
gtag('config', 'UA-151251727-1');


