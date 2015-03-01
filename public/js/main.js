$(function(){
  $('#btn-screenshot').click(function () {
    $('#indicator').show();

    var url = $('#url').val();
    // TODO: URL Validation

    $.ajax({
      url: '/screenshot?url=' + url
    }).done(function (data) {
      $('#indicator').hide();
      $('#result').prepend( $('<img>').attr('src', 'data:image/png;base64,' + data) );
    }).fail(function (data) {
      // TODO
    });
  });
});
