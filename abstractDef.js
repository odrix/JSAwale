// definition d'un joueur général (~classe abstraites)
function aJoueur(login) {
	this.login = login;
}
aJoueur.prototype.place = 'bas';
aJoueur.prototype.nb_points = 0;


// definition d'un match général (~classe abstraites)
function aMatch() {
	this.__proto__.__proto__.__proto__.constructor.apply(this, arguments);
}
aMatch.prototype.__proto__ = EventTarget.prototype;
aMatch.prototype.etat = function() { return nil; };
aMatch.prototype.joueurs = new Array();
aMatch.prototype.titre = '';

// definition d'un jeux général = ensemble de matchs (~classe abstraites)
function aJeux() {}
aJeux.prototype.matches = new Array;
aJeux.prototype.match_en_cours = function() {
	var result = new array();
	for(var i=0;i<this.matches.length;i++)
	{
		if(this.matches[i].etat == 'encours')
			result.push(this.matches[i]);
		return result;
	}
};
aJeux.prototype.match_en_attente = function() {
	var result = new array();
	for(var i=0;i<this.matches.length;i++)
	{
		if(this.matches[i].etat == 'attente')
			result.push(this.matches[i]);
		return result;
	}
};




//Copyright (c) 2010 Nicholas C. Zakas. All rights reserved.
//MIT License

function EventTarget(){
    this._listeners = {};
}

EventTarget.prototype.addListener = function(type, listener){
	if (typeof this._listeners[type] == "undefined"){
		this._listeners[type] = [];
	}

	this._listeners[type].push(listener);
};

EventTarget.prototype.fire = function(event, args){
	if (typeof event == "string"){
		event = { type: event };
	}
	if (!event.target){
		event.target = this;
	}

	if (!event.type){  //falsy
		throw new Error("Event object missing 'type' property.");
	}

	if (this._listeners[event.type] instanceof Array){
		var listeners = this._listeners[event.type];
		for (var i=0, len=listeners.length; i < len; i++){
			listeners[i].call(this, args);
		}
	}
};

EventTarget.prototype.removeListener = function(type, listener){
	if (this._listeners[type] instanceof Array){
		var listeners = this._listeners[type];
		for (var i=0, len=listeners.length; i < len; i++){
			if (listeners[i] === listener){
				listeners.splice(i, 1);
				break;
			}
		}
	}
};
