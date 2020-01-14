$(document).ready(function() {

    var jsonData = $.getJSON({
        url: '/stats/dateParticipantsRegistered/data',
        dataType: 'json'
    }).done(function(results) {
        
        var ctx = document.getElementById("dateRegistered").getContext("2d");
        var chart = new Chart(ctx, results);
    });
});