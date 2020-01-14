$(function() {
    window.onload = displayError();
});

function displayError() {
  name();
  email();
  department();
  consent();
};

function name() {
    var fn = document.getElementById('name_error').textContent;

    if (undefined === fn || '' == fn) {
        $('#name').removeClass('is-valid');
    } else {
        $('#name').addClass('is-invalid');
    }
};

function email() {
    var fn = document.getElementById('email_error').textContent;

    if (undefined === fn || '' == fn) {
        $('#email').removeClass('is-valid');
    } else {
        $('#email').addClass('is-invalid');
    }
};

function department() {
    var fn = document.getElementById('department_error').textContent;

    if (undefined === fn || '' == fn) {
        $('#department').removeClass('is-valid');
    } else {
        $('#department').addClass('is-invalid');
    }
};

function consent() {
    var fn = document.getElementById('consent_error').textContent;

    if (undefined === fn || '' == fn) {
        $('#consent').removeClass('is-valid');
    } else {
        $('#consent').addClass('is-invalid');
    }
};