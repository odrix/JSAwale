function trou () {  }
trou.prototype.nbgraines = 4;

var joueur_awale_place = { NORD:0, SUD:1 };
function joueur_awale() {
	this.__proto__.__proto__.constructor.apply(this, arguments);
	this.trous = new Array();
	for(var i=0;i<6;i++)
	{
		this.trous.push(new trou());
	}
}
joueur_awale.prototype.__proto__ = aJoueur.prototype;
//joueur_awale.prototype.place = joueur_awale_place.SUD;
// joueur_awale.prototype.trous = new Array();



function match_awale() {
	this.__proto__.__proto__.constructor.apply(this, arguments);
}
match_awale.prototype.__proto__  = aMatch.prototype;
match_awale.prototype.joueur_actuel = joueur_awale_place.SUD;


match_awale.prototype.ajouter_joueur = function(login) {
	var nouveau_joueur = new joueur_awale(login);
	
	if(this.joueurs.length == 0)
		nouveau_joueur.place = joueur_awale_place.SUD;
	else
		nouveau_joueur.place = joueur_awale_place.NORD;
	this.joueurs.push(nouveau_joueur);
	
	//this.send(me.etat());
};

match_awale.prototype.etat = function() {
	if(this.joueurs.length == 1)
		return 'attente';
	else
		return 'encours';
};

match_awale.prototype.joueur_joue = function(place_joueur, index_choix_trou) {
	var nb_graines = 0;
	var dernier_trou_distribue = null;
	nb_graines = this.prise(place_joueur, index_choix_trou);
	if(nb_graines > 0) {
		dernier_trou_distribue = this.egrene(place_joueur, index_choix_trou, nb_graines);
		for(var i=dernier_trou_distribue.index_trou;i>=0;i--) {
			if(this.verifier_trou_gagnant(place_joueur, dernier_trou_distribue.index_place, i)) {// ATTENTION dernier_trou_distribue est un tableau avec index_place, index_trou
				this.gagner_graines(place_joueur, dernier_trou_distribue.index_place, dernier_trou_distribue.index_trou);
			} else { 
				break;
			}
		}
		this.est_fini();
	} else {
		//TODO : on ne peut pas choisir ce trou
	}
};

match_awale.prototype.prise = function(place_joueur, index_choix_trou) {
	var nb_graines = 0;
	var dernier_trou_distribue = null;
	nb_graines = this.joueurs[place_joueur].trous[index_choix_trou].nbgraines;
	if(nb_graines > 0) {
		this.fire("prise", {index_joueur: place_joueur, index_trou: index_choix_trou});
		this.joueurs[place_joueur].trous[index_choix_trou].nbgraines = 0;
	}
	return nb_graines;
};

match_awale.prototype.egrene = function(place_joueur, index_trou_depart, nb_graines) {
	
	var index_trou = index_trou_depart;
	var index_place = place_joueur;
	
	for(var i=0;i<nb_graines;i++)
	{
		index_trou++;
		if(index_trou > 5)
		{
			index_trou = 0;
			index_place++;
			if(index_place >= this.joueurs.length)
				index_place = 0;
		}
		
		if(!(index_trou == index_trou_depart && index_place == place_joueur))  {// on ne re-rempli pas le trou choisit (dans le cas de plus de 11 graines dans le trou de départ
			this.joueurs[index_place].trous[index_trou].nbgraines++;
			this.fire("egrene", {index_joueur: index_place, index_trou: index_trou, nb_graines:this.joueurs[index_place].trous[index_trou].nbgraines});
		}
	}
	return {index_place:index_place, index_trou:index_trou};
};

match_awale.prototype.verifier_trou_gagnant = function (index_joueur_joue, index_place, index_trou) {
	if(this.joueurs[index_place] !== this.joueurs[index_joueur_joue] && index_trou >= 0 && index_trou < 6)
	{
		if(this.joueurs[index_place].trous[index_trou].nbgraines == 3 || this.joueurs[index_place].trous[index_trou].nbgraines == 2)
		{
			return true;
		}
	}
	return false;
};

match_awale.prototype.gagner_graines = function (index_joueur_joue, index_place, index_trou) {
	this.joueurs[index_joueur_joue].nb_points += this.joueurs[index_place].trous[index_trou].nbgraines;
	this.joueurs[index_place].trous[index_trou].nbgraines = 0;
	this.fire("gain", {index_joueur: index_place, index_trou: index_trou});
	this.fire("gagnepoints", {index_joueur: index_joueur_joue, nb_points:this.joueurs[index_joueur_joue].nb_points});
};

match_awale.prototype.est_fini = function() {
	var joueur_gagnant = -1;
	for(var i=0;i<this.joueurs.length;i++)
	{
		if(this.joueurs[i].nb_points >= 24) {
			joueur_gagnant = i;
			break;
		}
	}
	
	if(joueur_gagnant != -1) {
		
	}
};