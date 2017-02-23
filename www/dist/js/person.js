$(function ($) {

  $('.personBG').each(function (ind) {
    var el = $(this);

    console.log(el.find('.personIMG').attr('src'));

    el.css('background-image', 'url(' + el.find('.personIMG').attr('src') + ')');
  });

});
