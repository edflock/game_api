$(function() {
	edflockGameApi = new EdflockGameApi();

    /*$("#msg2").on('click', function(){
		edflockGameApi.requestForUserName()
			.then(function(data) {
					$("#msgs").html(data)
				}, function(err) {
					console.log(err)
				}
			);
    });*/
	var a = 10;
	/*setTimeout(function() {
		edflockGameApi.requestForUserName(function ( d, e ) {
	        $( "#msgs" ).append( "<div><pre>" + e.data + "</pre></div>" );
	    });	
	}, 1000);*/
	

    $("#msg2").on('click', function(){
		edflockGameApi.requestForUserName(function ( d, e ) {
            $( "#msgs" ).append( "<div><pre>" + e.data + "</pre></div>" );
        });
    });

    $("#addScore").on('click', function() {
    	edflockGameApi.addPoints(a++);
    });

    $("#changeStatus").on('click', function() {
    	edflockGameApi.changeStatus("completed");
    })
});