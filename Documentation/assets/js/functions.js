$(function() {

  "use strict";

  /*===============================================
    Smooth Scrolling
  ===============================================*/
  var htmlBody = $("html,body");
  var smoothLinks = $(".nav-link");

  smoothLinks.on("click", function(e) {
      htmlBody.animate({scrollTop: $(this.hash).offset().top}, 700, "easeInOutQuart");  
    e.preventDefault();
  });

  /*===============================================
    Scroll Spy
  ===============================================*/
  $('body').scrollspy({ 
    target: '.nav',
    offset: 0
  });

});