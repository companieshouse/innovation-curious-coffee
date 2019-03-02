$(document).ready(function() {

    var jsonData = $.getJSON({
        url: 'date-participants-registered/data',
        dataType: 'json'
    }).done(function(results) {
        
        var ctx = document.getElementById("dateRegistered").getContext("2d");
        var chart = new Chart(ctx, results);
    });
});