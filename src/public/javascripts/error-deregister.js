$(function() {
    window.onload = displayError();
});

function displayError() {
  email();
};

function email() {
    var fn = document.getElementById('email_error').textContent;

    if (undefined === fn || '' == fn) {
        $('#email').removeClass('is-valid');
    } else {
        $('#email').addClass('is-invalid');
    }
};