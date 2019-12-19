$(function() {
    window.onload = displayError();
});

function displayError() {
  applyError('email');
  applyError('feedback');
};

function applyError(textToCheck) {
    var elById = document.getElementById( textToCheck + '_error');

    if (elById != null) {
        var tc = elById.textContent;

        if (undefined === tc || '' == tc) {
            $('#' + textToCheck).removeClass('is-valid');
        } else {
            $('#' + textToCheck).addClass('is-invalid');
        }
    }
}