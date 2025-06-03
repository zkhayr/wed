var particlesArray1 = {
    fpsLimit: 120,
    detectRetina: true,
    fullscreen: false,
    particles: {
        number: {
            value: 80,
            density: {
                enable: true,
                area: 500
            }
        },
        color: {
            value: ["#FFFFFF", "#947439"]
        },
        shape: {
            type: "image",
            image: [
                {
                    src: $("#particleImage1").val(),
                    width: 10,
                },
            ]
        },
        opacity: {
            value: 0.75,
            random: false,
            animation: {
                enable: true,
                speed: 1,
                minimumValue: 0.1,
                sync: false
            }
        },
        size: {
            value: 12,
            random: true,
            animation: {
                enable: true,
                speed: 12,
                minimumValue: 0.1,
                sync: false
            }
        },
        lineLinked: {
            enable: false,
            distance: 150,
            color: "#c8c8c8",
            opacity: 0.4,
            width: 1
        },
        move: {
            enable: true,
            speed: 1,
            direction: "none",
            random: false,
            straight: false,
            outMode: "bounce",
            bounce: false,
            attract: {
                enable: false,
                rotateX: 600,
                rotateY: 1200
            }
        }
    },
};

tsParticles.load("main-particles", particlesArray1);
tsParticles.load("sub-particles", particlesArray1);

$(window).on('load', function () {
    $('#js-preloader-card').fadeOut("slow", function () {
        $('#js-preloader-card').addClass('loaded');

        AOS.init({
            offset: -120,
        });

        setTimeout(function () {
            $(".main-page .main-container").animate({ scrollTop: $(".main-page .main-container").outerHeight() }, 3000);
        }, 2500);
    });
});

$(window).on("resize", function () {
    var sliderWidth = $(".slider-gallery-main").outerWidth();
    $(".slider-gallery-main .image").height(sliderWidth * 9 / 16);
    $(".slider-gallery-sub .image").height(sliderWidth / 3 * 3 / 4);
});
$(window).trigger("resize");

$("[data-open='sub']").click(function () {
    setTimeout(function () {
        $(".main-page").fadeOut(500, "linear", function () {
            AOS.refresh();
        });
    }, 1500);
    $(".main-page .main-bg-1").attr("data-aos", "zoom-out");
    $(".main-page .aos-animate").each(function () {
        var tempEl = $(this);
        var delayValue = $(this).attr("data-aos-delay");
        if (empty(delayValue)) {
            delayValue = 0;
        }
        delayValue = Math.abs(delayValue - 2000) / 3;

        setTimeout(function () {
            tempEl.removeClass("aos-animate");
        }, delayValue);
    });

    $(".sub-page").show(function () {
        $(".sub-page [data-aos-delay]").each(function () {
            if (!$(this).isInViewport()) {
                $(this).attr("data-aos-delay", "0");
            }
        });
        $(".sub-page .aos-animate").removeClass("aos-animate");
        $('.slider-gallery-main').trigger('refresh.owl.carousel');

        $(".appbar-nav").show();
    });

    if (playerStatus == false) {
        $('.floating-music').trigger('click');
        playerStatus = true;
    }

    $("html").removeClass("overflow-hidden");
});

$("[data-open='home']").click(function () {
    if (!$(".main-page").is(':visible')) {
        $("html").scrollTop(0);
        $("html").addClass("overflow-hidden");

        setTimeout(function () {
            $(".main-page .aos-animate").removeClass("aos-animate");
            $(".main-page").fadeIn(500, "linear", function () {
                $(window).trigger("resize");

                AOS.refresh();
            });
        }, 1000);

        setTimeout(function () {
            $(".main-page .main-bg-1").attr("data-aos", "zoom-in");
            $(".sub-page .aos-animate").removeClass("aos-animate");
        }, 250);
    }

    $(".mod-backdrop, [data-modal-action='close']").trigger("click");
    $(".appbar-nav").hide();
});

$("[data-modal-target]").click(function () {
    var target = $(this).attr("data-modal-target");

    if (!$(".modal-backdrop").is(":visible") || !$("[data-modal='" + target + "']").is(":visible")) {
        $(".modal-backdrop").show();
        $("[data-modal]").hide();
        $("[data-modal='" + target + "']").show();
    } else {
        $(".mod-backdrop").trigger("click");
    }
});

$(".modal-backdrop, [data-modal-action='close']").click(function () {
    $("[data-modal]").hide();
    $(".modal-backdrop").hide();
});

$('.slider-gallery-main').owlCarousel({
    autoplay: false,
    autoplayTimeout: 4500,
    autoplayHoverPause: false,
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    margin: 20,
    stagePadding: 0,
    singleItem: true,
    nav: false,
    dots: false,
    items: 1
});

$('.slider-gallery-sub').owlCarousel({
    autoplay: true,
    autoplayTimeout: 4500,
    autoplayHoverPause: true,
    loop: true,
    margin: 5,
    stagePadding: 20,
    nav: false,
    dots: false,
    items: 3,
    center: true,
});

var totalSlide = 0;
$(".slider-gallery-sub").on('click', '.owl-item', function () {
    var number = totalSlide - 3;
    var owlIndex = $(this).index();
    $('.slider-gallery-sub').trigger('to.owl.carousel', owlIndex + number);
});

$('.slider-gallery-sub').on('changed.owl.carousel', function (e) {
    totalSlide = e.item.count;
    var dataImage = $('.slider-gallery-sub .owl-item:nth-child(' + e.item.index + ') .image').attr("data-image");
    if (dataImage != null) {
        $('.slider-gallery-main').trigger('to.owl.carousel', dataImage);
    }
});

$('.slider-guestbook').owlCarousel({
    autoplay: true,
    autoplayTimeout: 4500,
    autoplayHoverPause: true,
    loop: true,
    nav: false,
    dots: true,
    items: 1
});






