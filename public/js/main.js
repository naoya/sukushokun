$(function(){
  $('#btn-screenshot').click(function () {
    $('#indicator').show();

    var url = $('#url').val();
    // TODO: URL Validation

    var request = '/screenshot?url=' + url;

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
