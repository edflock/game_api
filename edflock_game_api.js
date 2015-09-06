//This is the game API that commnucates with the player API. The Game API is used by the game.
(function(){

var GameAPI = function(options){

};

GameAPI.prototype.alert = function(){
	alert("Hi");
};

window.EdFlockGameAPI = GameAPI;
})();