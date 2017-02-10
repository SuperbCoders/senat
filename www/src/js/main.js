var body_var,
  global_window_Height,
  popupOrderItem,
  controlPanelBtn,
  popupBtn,
  header,
  $completed_orders_form,
  $send_confirmation,
  $send_to_client,
  $cart_orders_form,
  $postpone_orders_form,
  $contacts_form;

$(function ($) {

  body_var = $('body');
  global_window_Height = $(window).height();
  popupOrderItem = $('.popup_order_item');
  controlPanelBtn = $('.controlPanelBtn');
  header = $('.header');

  $('body')
    .delegate('.scrollTo', 'click', function () {
      docScrollTo($($(this).attr('data-scroll')).offset().top - header.outerHeight() - 20, 800);
      return false;
    })
    .delegate('.asideAddOpen', 'click', function () {
      $(this).parent().toggleClass('open_aside_add');
      return false;
    })
    .delegate('.preloader', 'click', function () {
      runCircle($(this), 4000);
      return false;
    })
    .delegate('.dashMenuBtn', 'click', function () {
      var dd = $(this).parent();
      hideDropDowns(dd);
      dd.toggleClass('open_dash_menu');
      return false;
    });

  $(document).click(function (e) {
    if ($(e.target).parents().filter('.open_dash_menu').length != 1) {
      hideDropDowns();
    }
  });

  all_dialog_close();

});

function hideDropDowns(excl) {
  $('.open_dash_menu').not(excl).removeClass('open_dash_menu');
}

function all_dialog_close() {
  body_var.on('click', '.ui-widget-overlay', all_dialog_close_gl);
}

function all_dialog_close_gl() {
  $(".ui-dialog-content").each(function () {
    var $this = $(this);
    if (!$this.parent().hasClass('always_open')) {
      $this.dialog("close");
    }
  });
}

function docScrollTo(pos, speed, callback) {

  $('html,body').animate({'scrollTop': pos}, speed, function () {
    if (typeof(callback) == 'function') {
      callback();
    }
  });
}

function runCircle(pager_dot, duration) {

  var circle_1 = $('.timer_r', pager_dot), circle_2 = $('.timer_l', pager_dot);

  circle_1.attr('style', '');
  circle_2.attr('style', '');

  circle_1.snabbt({
    fromRotation: [0, 0, Math.PI],
    rotation: [0, 0, 0],
    duration: duration,
    callback: function () {
      circle_2.snabbt({
        fromRotation: [0, 0, Math.PI],
        rotation: [0, 0, 0],
        duration: duration,
        callback: function () {

        }
      })
    }
  });
}
