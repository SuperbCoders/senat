$(function ($) {

  $('.sortable').sortable();

  $('.tagIt').tagit();

  var dropZone = $('.dropzone'),
    maxFileSize = 1024 * 1024 * 1024; // максимальный размер фалйа

  // Проверка поддержки браузером
  if (typeof(window.FileReader) == 'undefined') {
    dropZone.text('Не поддерживается браузером!');
    dropZone.addClass('drag_error');
  }

  // Добавляем класс hover при наведении
  dropZone[0].ondragover = function () {
    dropZone.addClass('drag_in');
    return false;
  };

  // Убираем класс hover
  dropZone[0].ondragleave = function () {
    dropZone.removeClass('drag_in');
    return false;
  };

  // Обрабатываем событие Drop
  dropZone[0].ondrop = function (event) {
    event.preventDefault();
    dropZone.removeClass('drag_in');
    dropZone.addClass('drop');

    var file = event.dataTransfer.files[0];

    console.log(file);

    // Проверяем размер файла
    if (file.size > maxFileSize) {
      console.log('Файл слишком большой!');
      dropZone.addClass('drag_error');
      return false;
    }

    $('.uploadTip').before($(
      '<li class="newUpload">\
        <div class="upload_file rmUnit _loading"><span class="btn_red_2 unit_rm_btn rmBtn"></span>\
          <div class="mb"><span class="upload_icon"><img src="./img/file_doc.svg"></span></div>\
          <div class="upload_name mb">' + file.name + '</div>\
          <div class="loading_progress">\
            <div class="loading_progress_val loadingProgressVal"></div>\
            <div class="loading_progress_text loadingProgressText"></div>\
          </div>\
        </div>\
      </li>'));

    // Создаем запрос
    var xhr = new XMLHttpRequest();
    xhr.upload.addEventListener('progress', uploadProgress, false);
    xhr.onreadystatechange = stateChange;
    xhr.open('POST', './actions/upload.php');
    xhr.setRequestHeader('X-FILE-NAME', file.name);
    xhr.send(file);
  };

  // Показываем процент загрузки
  function uploadProgress(event) {
    var percent = parseInt(event.loaded / event.total * 100);
    $('.newUpload .loadingProgressVal').css('width', percent + '%');
    $('.newUpload .loadingProgressText').text(percent + '%');

    if (percent == 100) {
      $('.newUpload ._loading').removeClass('_loading');
      $('.newUpload .loadingProgressVal').removeClass('loadingProgressVal');
      $('.newUpload .loadingProgressText').removeClass('loadingProgressText');
      $('.newUpload').removeClass('newUpload');
    }
  }

  // Пост обрабочик
  function stateChange(event) {
    if (event.target.readyState == 4) {
      if (event.target.status == 200) {
        console.log('Загрузка успешно завершена!');
      } else {
        $('.newUpload').remove();
        console.log('Произошла ошибка!');
      }
    }
  }
});
