$(document).ready(function() {
    $('#email1').on('change', function() {

        var x = '/match-edit/data/' + this.value;
        console.log(x);

        var jsonData = $.getJSON({
            url: x,
            dataType: 'json',
            success: function(data) {
                console.log(data);
                $('#match1name').val(data.data.name);
                $('#match1email').val(data.data.email);
                $('#match1department').val(data.data.department);
            }
        });
    });

    $('#email2').on('change', function() {

        var x = '/match-edit/data/' + this.value;
        console.log(x);

        var jsonData = $.getJSON({
            url: x,
            dataType: 'json',
            success: function(data) {
                console.log(data);
                $('#match2name').val(data.data.name);
                $('#match2email').val(data.data.email);
                $('#match2department').val(data.data.department);
            }
        });
    });
});