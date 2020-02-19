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
    var fn = document.getElementById('nameError').textContent;

    if (undefined === fn || '' == fn) {
        $('#name').removeClass('is-valid');
    } else {
        $('#name').addClass('is-invalid');
    }
};

function email() {
    var fn = document.getElementById('emailError').textContent;

    if (undefined === fn || '' == fn) {
        $('#email').removeClass('is-valid');
    } else {
        $('#email').addClass('is-invalid');
    }
};

function department() {
    var fn = document.getElementById('departmentError').textContent;

    if (undefined === fn || '' == fn) {
        $('#department').removeClass('is-valid');
    } else {
        $('#department').addClass('is-invalid');
    }
};

function consent() {
    var fn = document.getElementById('consentError').textContent;

    if (undefined === fn || '' == fn) {
        $('#consent').removeClass('is-valid');
    } else {
        $('#consent').addClass('is-invalid');
    }
};