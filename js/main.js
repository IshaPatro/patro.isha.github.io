AOS.init({
  duration: 800,
  easing: "slide",
});

(function ($) {
  "use strict";

  $(window).stellar({
    responsive: true,
    parallaxBackgrounds: true,
    parallaxElements: true,
    horizontalScrolling: false,
    hideDistantElements: false,
    scrollProperty: "scroll",
  });

  var fullHeight = function () {
    $(".js-fullheight").css("height", $(window).height());
    $(window).resize(function () {
      $(".js-fullheight").css("height", $(window).height());
    });
  };
  fullHeight();

  // loader
  var loader = function () {
    setTimeout(function () {
      if ($("#ftco-loader").length > 0) {
        $("#ftco-loader").removeClass("show");
      }
    }, 1);
  };
  loader();

  // Scrollax
  $.Scrollax();

  // Mobile Sidebar Menu
  var sidebarMenu = function () {
    var $body = $("body");
    var $navbar = $("#ftco-nav");
    var $overlay = $("#mobile-overlay");
    var $toggleBtn = $(".js-fh5co-nav-toggle");
    var $closeBtn = $("#sidebar-close");

    // Function to open sidebar
    function openSidebar() {
      $navbar.addClass("show");
      $overlay.addClass("show");
      $toggleBtn.addClass("active");
      $body.addClass("sidebar-open");

      // Focus management for accessibility
      setTimeout(function () {
        $navbar.find(".nav-link:first").focus();
      }, 300);
    }

    // Function to close sidebar
    function closeSidebar() {
      $navbar.removeClass("show");
      $overlay.removeClass("show");
      $toggleBtn.removeClass("active");
      $body.removeClass("sidebar-open");

      // Return focus to toggle button for accessibility
      $toggleBtn.focus();
    }

    // Toggle button click
    $toggleBtn.on("click", function (event) {
      event.preventDefault();
      event.stopPropagation();

      if ($navbar.hasClass("show")) {
        closeSidebar();
      } else {
        openSidebar();
      }
    });

    // Close button click
    $closeBtn.on("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      closeSidebar();
    });

    // Overlay click to close (only when clicking the actual overlay, not sidebar content)
    $overlay.on("click", function (event) {
      // Only close if the click target is the overlay itself
      if (event.target === this) {
        closeSidebar();
      }
    });

    // Close sidebar when clicking on nav links (mobile) and update active state
    $("#ftco-nav .nav-link").on("click", function (event) {
      if (window.innerWidth <= 991) {
        // Don't prevent default here as we want the link to work

        // Remove active class from all nav items
        $("#ftco-nav .nav-item").removeClass("active");
        // Add active class to clicked nav item
        $(this).parent().addClass("active");

        // Close sidebar after a short delay to show the selection and allow navigation
        setTimeout(function () {
          closeSidebar();
        }, 150);
      }
    });

    // Close sidebar on window resize if screen becomes larger
    $(window).on("resize", function () {
      if (window.innerWidth > 991 && $navbar.hasClass("show")) {
        closeSidebar();
      }
    });

    // Close sidebar on escape key
    $(document).on("keydown", function (event) {
      if (event.key === "Escape" && $navbar.hasClass("show")) {
        closeSidebar();
      }
    });
  };
  sidebarMenu();

  var onePageClick = function () {
    $(document).on("click", '#ftco-nav a[href^="#"]', function (event) {
      event.preventDefault();

      var href = $.attr(this, "href");

      $("html, body").animate(
        {
          scrollTop: $($.attr(this, "href")).offset().top - 70,
        },
        500,
        function () {
          // window.location.hash = href;
        }
      );
    });
  };

  onePageClick();

  var carousel = function () {
    $(".home-slider").owlCarousel({
      loop: true,
      autoplay: true,
      margin: 0,
      animateOut: "fadeOut",
      animateIn: "fadeIn",
      nav: false,
      autoplayHoverPause: false,
      items: 1,
      navText: [
        "<span class='ion-md-arrow-back'></span>",
        "<span class='ion-chevron-right'></span>",
      ],
      responsive: {
        0: {
          items: 1,
        },
        600: {
          items: 1,
        },
        1000: {
          items: 1,
        },
      },
    });
  };
  carousel();

  $("nav .dropdown").hover(
    function () {
      var $this = $(this);
      // 	 timer;
      // clearTimeout(timer);
      $this.addClass("show");
      $this.find("> a").attr("aria-expanded", true);
      // $this.find('.dropdown-menu').addClass('animated-fast fadeInUp show');
      $this.find(".dropdown-menu").addClass("show");
    },
    function () {
      var $this = $(this);
      // timer;
      // timer = setTimeout(function(){
      $this.removeClass("show");
      $this.find("> a").attr("aria-expanded", false);
      // $this.find('.dropdown-menu').removeClass('animated-fast fadeInUp show');
      $this.find(".dropdown-menu").removeClass("show");
      // }, 100);
    }
  );

  $("#dropdown04").on("show.bs.dropdown", function () {
    console.log("show");
  });

  // scroll
  var scrollWindow = function () {
    $(window).scroll(function () {
      var $w = $(this),
        st = $w.scrollTop(),
        navbar = $(".ftco_navbar"),
        sd = $(".js-scroll-wrap");

      if (st > 150) {
        if (!navbar.hasClass("scrolled")) {
          navbar.addClass("scrolled");
        }
      }
      if (st < 150) {
        if (navbar.hasClass("scrolled")) {
          navbar.removeClass("scrolled sleep");
        }
      }
      if (st > 350) {
        if (!navbar.hasClass("awake")) {
          navbar.addClass("awake");
        }

        if (sd.length > 0) {
          sd.addClass("sleep");
        }
      }
      if (st < 350) {
        if (navbar.hasClass("awake")) {
          navbar.removeClass("awake");
          navbar.addClass("sleep");
        }
        if (sd.length > 0) {
          sd.removeClass("sleep");
        }
      }
    });
  };
  scrollWindow();

  var counter = function () {
    $("#section-counter, .hero-wrap, .ftco-counter, .ftco-about").waypoint(
      function (direction) {
        if (
          direction === "down" &&
          !$(this.element).hasClass("ftco-animated")
        ) {
          var comma_separator_number_step =
            $.animateNumber.numberStepFactories.separator(",");
          $(".number").each(function () {
            var $this = $(this),
              num = $this.data("number");
            console.log(num);
            $this.animateNumber(
              {
                number: num,
                numberStep: comma_separator_number_step,
              },
              7000
            );
          });
        }
      },
      { offset: "95%" }
    );
  };
  counter();

  var contentWayPoint = function () {
    var i = 0;
    $(".ftco-animate").waypoint(
      function (direction) {
        if (
          direction === "down" &&
          !$(this.element).hasClass("ftco-animated")
        ) {
          i++;

          $(this.element).addClass("item-animate");
          setTimeout(function () {
            $("body .ftco-animate.item-animate").each(function (k) {
              var el = $(this);
              setTimeout(
                function () {
                  var effect = el.data("animate-effect");
                  if (effect === "fadeIn") {
                    el.addClass("fadeIn ftco-animated");
                  } else if (effect === "fadeInLeft") {
                    el.addClass("fadeInLeft ftco-animated");
                  } else if (effect === "fadeInRight") {
                    el.addClass("fadeInRight ftco-animated");
                  } else {
                    el.addClass("fadeInUp ftco-animated");
                  }
                  el.removeClass("item-animate");
                },
                k * 50,
                "easeInOutExpo"
              );
            });
          }, 100);
        }
      },
      { offset: "95%" }
    );
  };
  contentWayPoint();

  $(".image-popup").magnificPopup({
    type: "image",
    closeOnContentClick: true,
    closeBtnInside: false,
    fixedContentPos: true,
    mainClass: "mfp-no-margins mfp-with-zoom", // class to remove default margin from left and right side
    gallery: {
      enabled: true,
      navigateByImgClick: true,
      preload: [0, 1], // Will preload 0 - before current, and 1 after the current image
    },
    image: {
      verticalFit: true,
    },
    zoom: {
      enabled: true,
      duration: 300, // don't foget to change the duration also in CSS
    },
  });

  $(".popup-youtube, .popup-vimeo, .popup-gmaps").magnificPopup({
    disableOn: 700,
    type: "iframe",
    mainClass: "mfp-fade",
    removalDelay: 160,
    preloader: false,

    fixedContentPos: false,
  });

  $(document).ready(function () {
    const hobbyImage = $("#hobby-image");
    const hobbies = $("#about-section p span.hobby");
    let slideIndex = 0;
    let slideInterval;

    function showSlide(index) {
      const hobby = $(hobbies[index]);
      hobbies.css({
        "font-size": "",
        "text-transform": "",
        "-webkit-text-fill-color": "",
        "-moz-text-fill-color": "",
        "letter-spacing": "",
      });

      hobby.css({
        "font-size": "1.2em",
        "text-transform": "uppercase",
        "-webkit-text-fill-color": "#8f00ff",
        "-moz-text-fill-color": "#8f00ff",
        "letter-spacing": "2px",
      });

      switch (hobby.text()) {
        case "paintings":
          hobbyImage.css("background-image", "url(images/paintings.png)");
          break;
        case "digital art":
          hobbyImage.css("background-image", "url(images/digitalArt.png)");
          break;
        case "classical dance":
          hobbyImage.css("background-image", "url(images/odissi.png)");
          break;
        case "candles":
          hobbyImage.css("background-image", "url(images/candle-making.png)");
          break;
        case "tribal dance":
          hobbyImage.css("background-image", "url(images/tribaldance.png)");
          break;
        case "DIY club":
          hobbyImage.css("background-image", "url(images/diy-club.png)");
          break;
        case "school leader":
          hobbyImage.css("background-image", "url(images/captain.png)");
          break;
        case "NCC cadet":
          hobbyImage.css("background-image", "url(images/ncc.png)");
          break;
      }
    }

    function startSlideshow() {
      slideInterval = setInterval(function () {
        showSlide(slideIndex);
        slideIndex = (slideIndex + 1) % hobbies.length;
      }, 2000);
    }

    function stopSlideshow() {
      clearInterval(slideInterval);
    }

    hobbies.hover(
      function () {
        stopSlideshow();
        showSlide(hobbies.index(this));
      },
      function () {
        hobbyImage.css("background-image", "url(images/bg_1.png)");
        startSlideshow();
      }
    );

    $("#about-section")
      .on("mouseenter", function () {
        startSlideshow();
      })
      .on("mouseleave", function () {
        stopSlideshow();
        hobbyImage.css("background-image", "url(images/bg_1.png)");
        hobbies.css("background-color", "");
      });
  });
})(jQuery);
