$(function() {
	edflockGameApi = new EdflockGameApi();
    totalPoints = 0;
    function answerCorrect() {
        var a = 10;
        totalPoints += a;
        edflockGameApi.addPoints(a);
    }
    var life = 5;
    function removeLife() {
        life = life-1;
        if(life == 0) {
            edflockGameApi.changeStatusLost({points: totalPoints});
        }
        edflockGameApi.updateLife(life);

    }
    function awardBadge() {
        edflockGameApi.awardBadge({
            badgeUrl: "/assets/badges/winner.jpg",
            name: 'winner',
            id: 1
        });

    }

    edflockGameApi.requestForUser(function(d, e) {
        var userId = e[0].id;
        $( "#msgs" ).append( e[0].name );

        $("#addScore").on('click', function() {
            answerCorrect();
        });

        $("#changeStatus").on('click', function() {
            removeLife();
        });

        $("#awardBadge").on('click', function () {
            awardBadge();
        });

        /*$("#changeStatus").on('click', function() {
            edflockGameApi.changeStatus("completed");
        })*/
    });


});