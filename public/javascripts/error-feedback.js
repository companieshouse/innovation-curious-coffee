$(function() {
    window.onload = displayError();
});

function displayError() {
  email();
  feedback();
};

function email() {
    var fn = document.getElementById('email_error').textContent;

    if (undefined === fn || '' == fn) {
        $('#email').removeClass('is-valid');
    } else {
        $('#email').addClass('is-invalid');
    }
};

function feedback() {
    var fn = document.getElementById('feedback_error').textContent;

    if (undefined === fn || '' == fn) {
        $('#feedback').removeClass('is-valid');
    } else {
        $('#feedback').addClass('is-invalid');
    }
};