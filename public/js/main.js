$(function(){
  $('#btn-screenshot').click(function () {
    var url = $('#url').val();
    if (!url) {
      window.alert('URLを入力してね');
      return;
    }

    $('#indicator').show();

    var request = '/screenshot?url=' + encodeURIComponent(url);
    if ($('#is-mobile').prop('checked')) {
      request += '&mobile=true';
    }

    $.ajax({
      url: request
    }).done(function (data) {
      $('#indicator').hide();
      $('#result').prepend( $('<img>').attr('src', 'data:image/png;base64,' + data) );
    }).fail(function (data) {
      // TODO
    });
  });
});
