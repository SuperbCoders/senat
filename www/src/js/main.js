var body_var,
  html,
  doc,
  wnd,
  global_window_Height,
  popupOrderItem,
  controlPanelBtn,
  header,
  overlay,
  popupBtn,
  $completed_orders_form;

$(function ($) {
  body_var = $('body');
  html = $('html');
  doc = $(document);
  wnd = $(window);
  global_window_Height = $(window).height();
  popupOrderItem = $('.popup_order_item');
  controlPanelBtn = $('.controlPanelBtn');
  header = $('.header');
  overlay = $('.glOverlay');

  body_var
    .delegate('.scrollTo', 'click', function () {
      var el = $(this);
      docScrollTo($(el.attr('data-scroll')).offset().top - header.outerHeight() - 20, 800, function () {
        el.parent().addClass('scroll_done').siblings().removeClass('scroll_done');
      });
      return false;
    })
    .delegate('.openForm', 'click', function () {
      var btn = $(this),
        form = $(btn.attr('data-href'));

      html.toggleClass(form.attr('data-class'));

      overlay.toggle();

      form.fadeToggle(600);

    })
    .delegate('.popupWrapper', 'click', function (e) {
      var target = $(e.target), el = $(this);

      if (!(target.hasClass('noClose') || target.closest('.noClose').length)) {
        $(this).fadeOut(600);

        overlay.fadeOut(600, function () {
          html.removeClass(el.attr('data-class'));
        });
      }

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
    .delegate('.userMenuBtn', 'click', function () {
      var dd = $(this).parent();
      hideDropDowns(dd);
      dd.toggleClass('open_menu');
      return false;
    })
    .delegate('.dashMenuBtn', 'click', function () {
      var dd = $(this).parent();
      hideDropDowns(dd);
      dd.toggleClass('open_menu');
      return false;
    });

  $(document).click(function (e) {
    if ($(e.target).parents().filter('.open_menu').length != 1) {
      hideDropDowns();
    }
  });

  catchNavBar();

  all_dialog_close();

});

function catchNavBar() {

  wnd.on('scroll', function () {
    var navBarMark = $('.navBarMark'), navBar = $('.navBar');

    console.log(navBarMark.offset().top, doc.scrollTop(), navBar.outerHeight());

    navBar.css('top', ((navBarMark.offset().top - header.outerHeight()) <= doc.scrollTop()) ? header.outerHeight() : 0);


  });

}

function hideDropDowns(excl) {
  $('.open_menu').not(excl).removeClass('open_menu');
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
