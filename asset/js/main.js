var parameter_url = new URL(window.location.href);
var logged = $("#logged").val();
var base_url = $("#base_url").val();
var base_class = $("#base_class").val();
var base_method = $("#base_method").val();
var monthList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

var ajaxOption = {
    type: "POST",
    dataType: "json",
    async: true,
    enctype: 'multipart/form-data',
    cache: false,
    contentType: false,
    processData: false,
    beforeSend: function () {
        if (!(typeof SlickLoader === 'undefined')) {
            SlickLoader.enable();
        }
    },
    complete: function (data) {
        if (!(typeof SlickLoader === 'undefined')) {
            SlickLoader.disable();
        }

        $.getJSON(base_url + "login/refreshFormToken", function (data, status) {
            $("input[name='" + data.name + "']").val(data.hash);
        });
    },
    error: function (xhr, ajaxOptions, thrownError) {
        var response = xhr.responseText;
        response = response.replace(/<[^>]*>?/gm, '');

        var formData = new FormData();
        formData.append("xhr", response);
        formData.append("ajaxOptions", ajaxOptions);
        formData.append("thrownError", thrownError);

        console.log(xhr);
        console.log(response);

        $.ajax({
            type: "POST",
            url: `${base_url}home/logError`,
            data: formData,
            async: true,
            crossDomain: true,
            enctype: 'multipart/form-data',
            cache: false,
            contentType: false,
            processData: false,
            success: function (data) { }
        });

        var msg = "Unexpected error occured. Please try again later";
        var desc = "";

        displaySwal({ title: msg, html: desc, icon: "error" });
    }
};

$.fn.isInViewport = function () {
    var elementTop = $(this).offset().top;
    var elementBottom = elementTop + $(this).outerHeight();

    var viewportTop = $(window).scrollTop();
    var viewportBottom = viewportTop + $(window).height();

    return elementBottom > viewportTop && elementTop < viewportBottom;
};

$("body").on("submit", "[data-form]", function (event) {
    event.preventDefault();

    var form = this;
    if ($(this).attr("data-confirm") == "true") {
        var title = button = null;
        if ($(this).attr("data-prompt") == "delete") {
            title = "Adakah anda pasti untuk memadamkan data ini?";
            button = "Padam";
        }

        Swal.fire({
            background: "#fff",
            title: title,
            html: null,
            icon: "warning",
            width: 600,
            heightAuto: false,
            showCancelButton: true,
            confirmButtonText: button,
        }).then(function (result) {
            if (result.isConfirmed) {
                formRequest(form);
            }
        });
    } else {
        formRequest(form);
    }
});

$('[type="file"]').bind('change', function () {
    var max = $(this).attr("data-max");
    var accept = $(this).attr("accept");
    var fileType = this.files[0].type.replace(/(.*)\//g, '');
    var fileSize = this.files[0].size;

    if (!empty(max) && fileSize >= max) {
        displaySwal({ title: "Fail yang dipilih melebihi saiz maksimum.", html: null, icon: "warning", timer: null, redirect: null });
        $(this).val("");
    } else if (!empty(accept) && !accept.includes(fileType)) {
        displaySwal({ title: "Fail yang dipilih tidak disokong.", html: null, icon: "warning", timer: null, redirect: null });
        $(this).val("");
    }
});

$("[input-accept=number]").keydown(function (e) {
    var key = e.charCode || e.keyCode || 0;
    return (
        key == 8 ||
        key == 9 ||
        key == 13 ||
        key == 46 ||
        key == 110 ||
        key == 190 ||
        (key >= 35 && key <= 40) ||
        (key >= 48 && key <= 57) ||
        (key >= 96 && key <= 105));
});

function empty(el) {
    if (el != null && el != "") {
        return false;
    } else {
        return true;
    }
}

function formRequest(el) {
    var action = $(el).attr("data-form");
    var formData = new FormData($(el)[0]);

    $.ajax(
        $.extend({
            url: base_url + action,
            data: formData,
            success: function (data) {
                var scrollTo = null;
                $("input,textarea,select,select2").removeClass("input-error");
                $(".error-msg").remove();

                if (data.error_field) {
                    $.each(data.error_field, function (index, item) {
                        var parentEl = $("[name='" + item.name + "']").parent();
                        $("[name='" + item.name + "']").addClass("input-error");
                        parentEl.append("<span class='error-msg'>" + item.msg + "</span>");

                        if (index == 0 && action == "card/submitEdit") {
                            var navTabId = $("[name='" + item.name + "']").closest(".tab-pane").attr("id");
                            $(".nav-link[data-bs-target='#" + navTabId + "']").click();
                        }
                    });
                }

                if (data.result == 1 && action == "card/submitEdit") {
                    $("[data-edit-iframe]").attr('src', function (i, val) { return val; });
                    scrollTo = $("[data-edit-iframe]").offset().top - 150;
                }

                if (data.result == 3 && action == "home/submitCheckout") {
                    $("#rowPhone").show();
                    $("#rowPhone input").focus();
                }

                if (data.result == 1 && action == "home/submitProfilePassword") {
                    $(el).trigger("reset");
                }

                if (data.result == 1 && action == "card/submitRSVP") {
                    $(el).trigger("reset");
                }

                if (data.result == 1 && action == "card/submitGuestbook") {
                    $(el).trigger("reset");

                    var text = '' +
                        '<div class="item">' +
                        '<p class="text">' + data.data.text + '</p>' +
                        '<p class="by" > ~ ' + data.data.by + ' ~</p>' +
                        '</div>';
                    console.log(text);

                    $('.slider-guestbook').trigger('add.owl.carousel', [text]).trigger('refresh.owl.carousel');
                }

                ajaxResult(data, scrollTo);
            }
        }, ajaxOption)
    );
};

function ajaxResult(data, scrollTo = null) {
    var msg = (data.msg ? data.msg : null);
    var desc = (data.desc ? data.desc : null);
    var timer = (data.timer ? data.timer : null);
    var redirect = (data.redirect ? data.redirect : null);

    if (data.result == 1) {
        displaySwal({ title: msg, html: desc, icon: "success", timer: timer, redirect: redirect, scrollTo: scrollTo });
    } else if (data.result == 2) {
        displaySwal({ title: msg, html: desc, icon: "error", timer: timer, redirect: redirect });
    } else if (data.result == 3) {
        displaySwal({ title: msg, html: desc, icon: "warning", timer: timer, redirect: redirect });
    } else if (data.result == 4) {
        displaySwal({ title: msg, html: desc, icon: "info", timer: timer, redirect: redirect });
    }
}

function displaySwal(data) {
    var msg = (data.title ? data.title : null);
    var html = (data.html ? data.html : null);
    var icon = (data.icon ? data.icon : null);
    var timer = (data.timer ? data.timer : null);
    var redirect = (data.redirect ? data.redirect : null);
    var scrollTo = (data.scrollTo ? data.scrollTo : null);

    if (!empty(data.title) || !empty(data.html)) {
        Swal.fire({
            background: "#fff",
            title: msg,
            html: html,
            icon: icon,
            timer: timer,
            width: 600,
            heightAuto: false,
            didClose: function () {
                if (!empty(scrollTo)) {
                    $("html, body").animate({
                        scrollTop: scrollTo
                    }, 0);
                }
            }
        }).then(function (result) {
            redirectLocation(data.redirect);
        });
    } else {
        redirectLocation(redirect);
    }
}

function redirectLocation(location) {
    if (!empty(location)) {
        if (location == "reload") {
            window.location.reload();
        } else if (location == "close") {
            window.close();
        } else {
            window.location = location;
        }
    }
}

function formatDate(date) {
    return date.getDate() + " " + monthList[date.getMonth()] + " " + date.getFullYear();
}

function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}