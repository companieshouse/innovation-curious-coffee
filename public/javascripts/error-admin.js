$(function() {
    window.onload = displayError();
});

function displayError() {
  password();
};

function password() {
    var fn = document.getElementById('password_error').textContent;

    if (undefined === fn || '' == fn) {
        $('#password').removeClass('is-valid');
    } else {
        $('#password').addClass('is-invalid');
    }
};