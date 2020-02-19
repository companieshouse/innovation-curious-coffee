$(function() {
    window.onload = displayError();
});

function displayError() {
  email();
};

function email() {
    var fn = document.getElementById('emailError').textContent;

    if (undefined === fn || '' == fn) {
        $('#email').removeClass('is-valid');
    } else {
        $('#email').addClass('is-invalid');
    }
};