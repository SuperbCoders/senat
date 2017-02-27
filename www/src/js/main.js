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
      el.parent().addClass('scroll_done').siblings().removeClass('scroll_done');

      docScrollTo($(el.attr('data-scroll')).offset().top - header.outerHeight() - 20, 800);
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
    })
    .delegate('.filterLink', 'click', function () {
      var item = $(this), target = $(item.attr('href'));

      item.parent().addClass('_active').siblings().removeClass('_active');

      if (target.length) {
        $('.filterUnit').hide().addClass('_active');
        target.show();
      } else {
        $('.filterUnit').removeClass('_active').show();
      }

      return false;
    })
    .delegate('.popupClose', 'click', function () {
      var form = $(this).parents('.popupWrapper');

      form.fadeOut(600);
      
      overlay.toggle();
      
      html.toggleClass(form.attr('data-class'));

      return false;
    })
    .delegate('.asideAddOpen', 'click', function () {
      $(this).parent().toggleClass('open_aside_add');
      return false;
    })
    .delegate('.voteCheck', 'change', function () {
      var radio = $(this),
        btn = $('.voteBtn'),
        new_class = btn.attr('class').replace(/btn_green|btn_red_3|btn_gray_2/, '');

      btn.text(radio.attr('data-check-text')).attr('class', new_class).addClass(radio.attr('data-btn-class'));

    })
    .delegate('.filterToggle', 'click', function () {
      var lnk = $(this);
      var dd = $(lnk.attr('href'));
      hideDropDowns(dd);
      lnk.parent().toggleClass('_active').siblings().removeClass('_active');
      dd.toggleClass('open_menu');
      return false;
    })
    .delegate('.preloader', 'click', function () {
      runCircle($(this), 4000);
      return false;
    })
    .delegate('.rmBtn', 'click', function () {
      $(this).closest('.rmUnit').remove();
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
      $('._active').removeClass('_active');
      hideDropDowns();
    }
  });

  $('.select2').each(function (ind) {
    var slct = $(this);

    slct.select2({
      minimumResultsForSearch: Infinity,
      dropdownParent: slct.parent(),
      width: '100%'
    })
  });

  catchNavBar();

  initCalendar();

  initTimePicker();

  all_dialog_close();

});


function customizeSelect(pckr) {

  $(pckr.container).find('select').each(function (ind) {
    var slct = $(this);

    slct.wrap($('<div class="calendar_select"/>'));

    slct.select2({
      minimumResultsForSearch: Infinity,
      dropdownParent: slct.parent(),
      width: '100%'
    })
  });
}

function initTimePicker() {
  $('.timePicker').each(function (ind) {
    var tmp = $(this),
      val = tmp.find('.timePickerVal');

    val.on('focus', function () {
      $(this).parent().addClass('open_menu');
    });

  });

  $('.timeMinus').on('click', function () {
    var valCell = $(this).closest('.valCell'),
      inp = valCell.find('input'),
      tmPckr = valCell.closest('.timePicker'),
      val = parseInt(inp.val()),
      new_val = val - (1 * inp.attr('data-step'));

    inp.val(('0' + (new_val >= (1 * inp.attr('data-min')) ? new_val : inp.attr('data-max'))).substr(-2));

    updateTime(tmPckr);

    return false;
  });

  $('.timePlus').on('click', function () {
    var valCell = $(this).closest('.valCell'),
      inp = valCell.find('input'),
      tmPckr = valCell.closest('.timePicker'),
      val = parseInt(inp.val()),
      new_val = val + (1 * inp.attr('data-step'));

    inp.val(('0' + (new_val <= (1 * inp.attr('data-max')) ? new_val : inp.attr('data-min'))).substr(-2));

    updateTime(tmPckr);

    return false;
  });
}

function updateTime(el) {
  var inp = el.find('.timePickerVal');

  inp.val(inp.attr('data-format').replace('hh', el.find('.valH').val()).replace('mm', el.find('.valM').val()));

}

function initCalendar() {
  var clndr = $('#range_calendar'), sngl = $('.singleDate');

  if (sngl.length) {
    sngl
      .on('show.daterangepicker', function (ev, picker) {

      })
      .on('showCalendar.daterangepicker', function (ev, picker) {
        customizeSelect(picker);
      })
      .each(function (ind) {
        $(this).daterangepicker({
          "alwaysShowCalendars": false,
          "singleDatePicker": true,
          "showDropdowns": true,
          "parentEl": $(this).parent(),
          "startDate": "14/02/2017",
          "endDate": "20/02/2017",
          "locale": {
            "format": "DD/MM/YYYY",
            "separator": " - ",
            "applyLabel": "Apply",
            "cancelLabel": "Cancel",
            "fromLabel": "From",
            "toLabel": "To",
            "customRangeLabel": "Custom",
            "weekLabel": "W",
            "daysOfWeek": [
              "Вс",
              "Пн",
              "Вт",
              "Ср",
              "Чт",
              "Пт",
              "Сб"
            ],
            "monthNames": [
              "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
            ],
            "firstDay": 1
          }
        });
      });
  }

  if (clndr.length) {
    clndr.daterangepicker({
      "alwaysShowCalendars": true,
      "showDropdowns": true,
      "parentEl": clndr.parent(),
      "startDate": "14/02/2017",
      "endDate": "20/02/2017",
      "dateLimit": 20,
      "locale": {
        "format": "DD/MM/YYYY",
        "separator": " - ",
        "applyLabel": "Apply",
        "cancelLabel": "Cancel",
        "fromLabel": "From",
        "toLabel": "To",
        "customRangeLabel": "Custom",
        "weekLabel": "W",
        "daysOfWeek": [
          "Вс",
          "Пн",
          "Вт",
          "Ср",
          "Чт",
          "Пт",
          "Сб"
        ],
        "monthNames": [
          "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
        ],
        "firstDay": 1
      }
    });

    /*
        clndr.dateRangePicker({
          autoClose: false,
          format: 'YYYY-MM-DD',
          separator: ' to ',
          language: 'auto',
          startOfWeek: 'monday',// or monday
          getValue: function () {
            return $(this).val();
          },
          setValue: function (s) {
            if (!$(this).attr('readonly') && !$(this).is(':disabled') && s != $(this).val()) {
              $(this).val(s);
            }
          },
          startDate: false,
          endDate: false,
          time: {
            enabled: false
          },
          minDays: 0,
          maxDays: 0,
          showShortcuts: false,
          shortcuts: {
            //'prev-days': [1,3,5,7],
            //'next-days': [3,5,7],
            //'prev' : ['week','month','year'],
            //'next' : ['week','month','year']
          },
          customShortcuts: [],
          inline: true,
          container: clndr.parent(),
          alwaysOpen: true,
          singleDate: false,
          lookBehind: true,
          batchMode: false,
          duration: 200,
          stickyMonths: true,
          dayDivAttrs: [],
          dayTdAttrs: [],
          applyBtnClass: '',
          singleMonth: 'auto',
          showTopbar: false,
          swapTime: false,
          selectForward: false,
          selectBackward: false,
          showWeekNumbers: false,
          // showDateFilter: function (time, date) {
          //   return '<div style="padding:0 5px;">\
          //     <span style="font-weight:bold">' + date + '</span>\
          //     <div style="opacity:0.3;">$' + Math.round(Math.random() * 999) + '</div>\
          //   </div>';
          // },
          getWeekNumber: function (date) //date will be the first day of a week
          {
            return moment(date).format('w');
          }
        });*/

  }


}

function catchNavBar() {
  var navBarMark = $('.navBarMark'), navBar = $('.navBar');

  if (navBarMark.length && navBar.length) {
    wnd.on('scroll', function () {
      navBar.css('top', ((navBarMark.offset().top - header.outerHeight() - 30) <= doc.scrollTop()) ? header.outerHeight() : 0);
    });
  }
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
