$(window).on("load", function () {
    $(".loader-wrapper").fadeOut("slow");
  });


  window.onscroll = function() {
    if (window.pageYOffset > 50) {
      document.getElementById("pogger").style.top = "-110px";
      document.getElementById("pogger").style.opacity = 0;

    } else {
      document.getElementById("pogger").style.top = "0";
      document.getElementById("pogger").style.opacity = 1;

    }
  }

$('.navTrigger').click(function () {
    $(this).toggleClass('active');
    console.log("Clicked menu");
    $("#mainListDiv").toggleClass("show_list");
    $("#mainListDiv").fadeIn();
    console.log('hi');
});


window.dataLayer = window.dataLayer || [];

function gtag() {
    dataLayer.push(arguments);
}
gtag('js', new Date());
gtag('config', 'UA-151251727-1');
