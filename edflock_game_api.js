//This is the game API that commnucates with the player API. The Game API is used by the game.
(function(){

var GameAPI = function(options){

};

GameAPI.prototype.alert = function(){
	alert("Hello");
};
 GameAPI.prototype.event = Object.create(EventEmitter.prototype);
 GameAPI.prototype.on = GameAPI.prototype.event.addListener;
 GameAPI.prototype.off = GameAPI.prototype.event.removeListener;

window.EdFlockGameAPI = GameAPI;
})();