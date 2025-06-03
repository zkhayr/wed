var playerStatus = false;

PleaseRotateOptions = {
    forcePortrait: true,
    zIndex: 999999999999,
    allowClickBypass: false,
    subMessage: "",
    onlyMobile: false,
};

function copyText(el, text) {
    navigator.clipboard.writeText(text);
    $(el).notify(
        "Copied",
        {
            position: "left",
            className: 'info',
            autoHideDelay: 2000,
        }
    );
}

$(document).ready(function () {
    if (history.scrollRestoration) {
        history.scrollRestoration = 'manual';
    } else {
        window.onbeforeunload = function () {
            window.scrollTo(0, 0);
        }
    }

    if (base_class == "card" && base_method == "preview") {
        $(".floating-preview").show();
    }

    var statusText = true;
    $(".text-bride").each(function () {
        if (!($(this).html() == "-" || $(this).html() == "." || $(this).html() == "&amp;")) {
            statusText = false;
        }
    });
    if (statusText == true) {
        $(".text-bride").remove();
    }

    if ($(".text-parent").length == 3) {
        var parent1 = $(".text-parent:eq(0)");
        var parent2 = $(".text-parent:eq(2)");
        var preg = ["", "-", "."];
        if ($.inArray(parent1.html(), preg) >= 0 || $.inArray(parent2.html(), preg) >= 0) {
            if ($.inArray(parent1.html(), preg) >= 0) {
                parent1.hide();
            }

            if ($.inArray(parent2.html(), preg) >= 0) {
                parent2.hide();
            }

            $(".text-parent:eq(1)").hide();
        }
    }

    var flipArray = ["Hari", "Jam", "Minit", "Saat"];
    if ($('[name="localizationID"]').val() == 2) {
        flipArray = ["Day", "Hour", "Minute", "Second"];
    }
    var flipTheme = "light";
    if ($('[name="theme_tone"]').val() == "light" || $('[name="theme_url"]').val() == "custom-001") {
        flipTheme = "dark";
    }
    var countdown = parseInt($('[name="countdownValue"]').val());
    var flipdown = new FlipDown(countdown, "flipdown", {
        headings: flipArray,
        theme: flipTheme
    }).start();

    var rsvpStatus = $('[name="rsvpStatus"]').val();
    if (rsvpStatus == 0) {
        $('[data-modal-target="rsvp"]').css("opacity", 0.25);
        $('[data-modal-target="rsvp"]').css("pointer-events", "none");
    }
    
    var rsvpChildStatus = $('[name="rsvpChildStatus"]').val();
    if (rsvpChildStatus == 0) {
        $('[name="kanak"]').closest('[class*="col"').hide();
        $('[name="dewasa"]').closest('[class*="col"').removeClass("col-6").addClass("col-12");
        if ($('[name="localizationID"]').val() == 1) {
            $('[name="dewasa"]').closest('[class*="col"').find("label").html("Jumlah Kehadiran");
        }
    }
});

$(window).on("resize", function () {
    if ($("[name='customFont']").val() == 1) {
        // Single Bride Text Autosize
        var textEl1 = $(".title .text-1");
        if (textEl1.length > 0) {
            var ind = 0;
            while (textEl1[0].scrollWidth > (textEl1.width() + 5) && parseFloat(textEl1.css("font-size")) > 12 && ind < 25) {
                var size = parseFloat(textEl1.css("font-size"));
                textEl1.css("font-size", (size - 2) + "px");
                ind++;
            }
        }

        var textEl3 = $(".title .text-3");
        if (textEl3.length > 0) {
            var ind = 0;
            while (textEl3[0].scrollWidth > (textEl3.width() + 5) && parseFloat(textEl3.css("font-size")) > 12 && ind < 25) {
                var size = parseFloat(textEl3.css("font-size"));
                textEl3.css("font-size", (size - 2) + "px");
                ind++;
            }
        }

        var sizeEl;
        if (parseFloat(textEl1.css("font-size")) <= parseFloat(textEl3.css("font-size"))) {
            sizeEl = parseFloat(textEl1.css("font-size"));
        } else {
            sizeEl = parseFloat(textEl3.css("font-size"));
        }

        textEl1.css("font-size", sizeEl + "px");
        textEl3.css("font-size", sizeEl + "px");
    }
});

$(".img-logo").click(function () {
    window.open("https://thekahwin.my");
})

$(".input-counter button:nth-child(1)").click(function () {
    var value = parseInt($(this).closest(".input-counter").find("input").val());

    if (value >= 1) {
        $(this).closest(".input-counter").find("input").val((value - 1));
    }
});

$(".input-counter button:nth-child(3)").click(function () {
    var val1 = $('[name="dewasa"]').val();
    var val2 = $('[name="kanak"]').val();
    var total = parseInt(val1) + parseInt(val2);
    var max = parseInt($('[name="rsvpValue"]').val());
    var value = parseInt($(this).closest(".input-counter").find("input").val());

    if (value >= 0 && total < max) {
        $(this).closest(".input-counter").find("input").val((value + 1));
    }
});


if ($("#audioFrame").length) {
    document.getElementById("audioFrame").addEventListener("ended", function () {
        document.getElementById("audioFrame").currentTime = 0;
        $(".floating-music").trigger("click");
    });

    function toggleAudio() {
        playerStatus = true;
        document.getElementById("audioFrame").volume = 0.5;
        $(".floating-music i").removeClass("fa-play");
        $(".floating-music i").removeClass("fa-stop");
        $(".floating-music").removeClass("active");

        if (document.getElementById("audioFrame").paused) {
            document.getElementById("audioFrame").play();

            if (document.getElementById("audioFrame").paused) {
                document.getElementById("audioFrame").play();
            }

            $(".floating-music i").addClass("fa-stop");
            $(".floating-music").addClass("active");
        } else {
            document.getElementById("audioFrame").pause();
            $(".floating-music i").addClass("fa-play");
        }
    }
}

if ($("#youtubeFrame").length) {
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    var player;
    var playerPlayedStatus = false;
    function onYouTubeIframeAPIReady() {
        player = new YT.Player('youtubeFrame', {
            playerVars: {
                loop: 1,
                playsinline: 1
            },
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            }
        });
    }

    function onPlayerReady(event) {
        //player.loadVideoById($('[name="youtubeID"').val());
        var parameter = {
            "videoId": $('[name="youtubeID"').val()
        };

        if ($('[name="youtubeStart"]').val() >= 0) {
            parameter["startSeconds"] = $('[name="youtubeStart"').val();
        }

        if ($('[name="youtubeEnd"]').val() >= 0) {
            parameter["endSeconds"] = $('[name="youtubeEnd"').val();
        }

        player.loadVideoById(parameter);
    }

    function onPlayerStateChange(event) {
        $(".floating-music i").removeClass("fa-play");
        $(".floating-music i").removeClass("fa-stop");
        $(".floating-music").removeClass("active");

        if (event.data == YT.PlayerState.ENDED) {
            if ($('[name="youtubeStart"]').val() >= 0) {
                player.seekTo($('[name="youtubeStart"').val());
            }

            $(".floating-music i").addClass("fa-play");
            $(".floating-music").trigger("click");
        } else if (event.data == YT.PlayerState.PLAYING) {
            if (playerPlayedStatus == false) {
                player.pauseVideo();
                playerPlayedStatus = true;
            }
            $(".floating-music i").addClass("fa-stop");
            $(".floating-music").addClass("active");
        } else if (event.data == YT.PlayerState.PAUSED) {
            $(".floating-music i").addClass("fa-play");
        } else {
            $(".floating-music i").addClass("fa-play");
        }
    }

    function toggleYoutube() {
        playerStatus = true;
        playerPlayedStatus = true;

        if (player.getPlayerState() == 1) {
            player.pauseVideo();
        } else {
            player.playVideo();
        }
    }
}

$(".floating-music").click(function () {
    if ($("#audioFrame").length) {
        toggleAudio();
    }

    if ($("#youtubeFrame").length) {
        toggleYoutube();
    }
});

