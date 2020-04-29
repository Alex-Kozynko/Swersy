var wow = new WOW({
    offset: 60
});
wow.init();

$(window).on('load', function () {
    $('input[type="tel"]').focus(function () {
        $(this).mask("+?99999999999999999999999999999", {
            placeholder: '',
            autoclear: false
        });
    })
    $("input[type='radio'], input[type='date'], select").styler();
    $('.video').click(function () {
        $('.popup_form').removeClass('hide');
    });
    $('.popup_form .close').click(function () {
        $('.popup_form').addClass('hide');
    });
    $('.partner').click(function () {
        $('.popup_form1').removeClass('hide');
    });
    $('.popup_form1 .close').click(function () {
        $('.popup_form1').addClass('hide');
    });
})
