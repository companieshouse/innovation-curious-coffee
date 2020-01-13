$(document).ready(function() {

    var jsonData = $.getJSON({
        url: '/stats/participantsByDepartment/data',
        dataType: 'json'
    }).done(function(results) {
        
        var ctx = document.getElementById("participants").getContext("2d");
        var chart = new Chart(ctx, results);
    });
});