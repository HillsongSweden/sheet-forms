exports.handler = async (event) => {
  return {
    statusCode: 200,
    body: `
$(document).ready(function () {
  var $form = $('.hillsong-form')
  var $submitBtn = $form.find('input[type=submit]');
  var $requiredFields = $form.find(':required').each(function () {
    $('<span style="color: red">*</span>').insertBefore($(this).prev('br'));
  });
  $form.on('submit', function (event) {
    event.preventDefault();
    $submitBtn.prop('disabled', true);
    var rowData = $(this)
      .serializeArray()
      .reduce(function (acc, cur) {
          acc[cur.name] = cur.value
          return acc
        }, {});
    var sendingText = 'Skickar ';
    var intervalId = setInterval(function () {
        $submitBtn.val(
          sendingText = sendingText.length < 11
            ? sendingText + '.'
            : 'Skickar '
        );
    }, 500)

    $.ajax({
      url: 'https://sheets-forms.netlify.app/.netlify/functions/save-to-sheet',
      method: 'POST',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      crossDomain: true,
      data: JSON.stringify({
        sheetId: $(this).attr('id'),
        sheetName: $(this).attr('name'),
        rowData: rowData
      }),
      success: function(response) {
        $submitBtn.prop('disabled', false);
        clearInterval(intervalId);
        $form.trigger('reset');
        $submitBtn.val('Skickat!');
        setTimeout(function() {
          $form
            .find('input[type=submit]')
            .val('Skicka');
          }, 3000);
      },
      error: function (error) {
        $submitBtn
          .prop('disabled', false)
          .val('Skicka');
        console.error('Error posting form data:');
        console.log(error);
      }
    });
  });
});
    `,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'text/javascript; charset=UTF-8'
    }
  }
}
