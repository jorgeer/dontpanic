/*  Engine module

    This module will be a game "Class".
*/

var ge = module.exports = function (id, client, template) {

	this.id = id || 0;
	this.map = {};
	this.settings = {};
	this.players = [];
	this.client = client;
	this.active_player = 0;
	this.turn = 0;
	var SCALE= 90;
	var PADD = 50;
    this.map.nodes = [];
    this.map.zones = [];
    this.timer = 20;
    this.information_centers = 0;
    this.road_blocks = 0;
    this.max_information_centers = 5;
    this.max_road_blocks = 2;
	this.cards_left = 10;
	//how often events should fire
	this.eventTurns = 3;
	this.turnsSinceEvent = 0;

    
	this.info_cards = [
       {
    	   desc:"Calm financial districts",
    	   effects: [{
    		   domain:'zone',
    		   type:'panic',
    		   panic:(-5),
    		   affects:'largecity'
    	   }]
       },
       {
    	   desc:"Calm industry districts",
    	   effects: [{
    		   domain:'zone',
    		   type:'panic',
    		   panic:(-5),
    		   affects:'industry'
    	   }]
       },
       {
    	   desc:"Calm residential districts",
    	   effects: [{
    		   domain:'zone',
    		   type:'panic',
    		   panic:(-5),
    		   affects:'residential'
    	   }]
       },
   ];
    

    var conn = [
        [1, 2, 3], // 0 
        [0, 4, 6],
        [0, 5, 7],
        [0, 4, 5, 8],
        [1, 3, 9],
        [2, 3, 7, 8], // 5
        [1, 9, 11],
        [2, 5, 10],
        [3, 5, 9, 13, 16],
        [4, 6, 8, 14, 16],
        [7, 12, 13], //10
        [6, 14, 17],
        [10, 15],
        [8, 10, 15, 16],
        [9, 11, 17, 19],
        [12, 13, 16, 18],//15
        [8, 9, 13, 15, 18, 19],
        [11, 14, 20],
        [15, 16, 19],
        [14, 16, 18, 20],
        [17, 19] // 20
           ],
    posx = [
        1*SCALE, 1*SCALE, 3*SCALE, 3*SCALE, 3*SCALE,
        5*SCALE, 5*SCALE, 7*SCALE, 7*SCALE, 7*SCALE,
        9*SCALE, 9*SCALE, 11*SCALE, 10*SCALE, 11*SCALE,
        14*SCALE, 11*SCALE, 13*SCALE, 15*SCALE, 15*SCALE,
        15*SCALE
    ],
    posy = [
        5*SCALE, 13*SCALE, 3*SCALE, 7*SCALE, 11*SCALE,
        5*SCALE, 15*SCALE, 3*SCALE, 7*SCALE, 11*SCALE,
        3*SCALE, 15*SCALE, 1*SCALE, 5*SCALE, 11*SCALE,
        3*SCALE, 8*SCALE, 15*SCALE, 7*SCALE, 11*SCALE,
        15*SCALE
    ];

    for (var i = 0; i < conn.length; i++){
        posy[i] = posy[i]+PADD;
        posx[i] = posx[i]+PADD;
    }

    for(var i = 0; i < 21; i++){
		    node = new ge.Node(i, posx[i], posy[i], true, conn[i]);
		    this.map.nodes.push(node);
    }
    
    //TEST add some road blocks
//    this.map.nodes[0].has_road_block = true;
//    this.map.nodes[2].has_road_block = true;
//    this.map.nodes[3].has_road_block = true;
//    this.map.nodes[5].has_road_block = true;
//    this.map.nodes[8].has_road_block = true;
//    this.map.nodes[13].has_road_block = true;
//    this.map.nodes[16].has_road_block = true;
    
    //add road blocks on all nodes for testing node/node connections
//    for (var i=0; i<this.map.nodes.length; i++){
//    	this.map.nodes[i].has_road_block = true;
//    }
	


    var zones = [];
    //Zones are 'residential' by default
    zones[0] = new ge.Zone(0, [0, 1, 4, 3], [1, 2, 5]);
    zones[1] = new ge.Zone(1, [0, 2, 5, 3], [0, 3, 4]);
    zones[2] = new ge.Zone(2, [1, 4, 9, 6], [0, 5, 7]);
    zones[3] = new ge.Zone(3, [2, 5, 7], [1, 4, 6]);
    zones[4] = new ge.Zone(4, [3, 5, 8], [1, 5, 6]);
    zones[5] = new ge.Zone(5, [3, 4, 9, 8], [0, 2, 4, 10]);
    zones[6] = new ge.Zone(6, [5, 7, 10, 13, 8], [3, 4, 8, 9]);
    zones[7] = new ge.Zone(7, [6, 9, 14, 11], [2, 11, 12]);
    zones[8] = new ge.Zone(8, [10, 12, 15, 13], [6, 13]);
    zones[9] = new ge.Zone(9, [8, 13, 16], [6, 10, 13]);
    zones[10] = new ge.Zone(10, [8, 9, 16], [5, 9, 11]);
    zones[11] = new ge.Zone(11, [9, 14, 19, 16], [7, 10, 15, 16]);
    zones[12] = new ge.Zone(12, [11, 14, 17], [7, 11, 16]);
    zones[13] = new ge.Zone(13, [13, 15, 16], [8, 9, 14]);
    zones[14] = new ge.Zone(14, [15, 16, 18], [13, 15]);
    zones[15] = new ge.Zone(15, [16, 18, 19], [11, 14]);
    zones[16] = new ge.Zone(16, [14, 17, 20, 19], [11, 12]);

    //change some zones from residential
    zones[5].type="park";
    zones[16].type="park";
    zones[6].type="industry";
    zones[7].type="industry";
    zones[11].type="largecity";
    zones[10].type="largecity";
    zones[9].type="largecity";
    
    zones[0].color = "aqua";
    zones[1].color = "steelblue";
    zones[2].color = "brown";
    zones[3].color = "darkblue";
    zones[4].color = "darkgreen";
    zones[5].color = "indigo";
    zones[6].color = "gold";
    zones[7].color = "orange";
    zones[8].color = "grey";
    zones[9].color = "peru";
    zones[10].color = "silver";
    zones[11].color = "teal";
    zones[12].color = "yellow";
    zones[13].color = "yellowgreen";
    zones[14].color = "tomato";
    zones[15].color = "seashell";
    zones[16].color = "lightgoldenrodyellow";
    
    this.map.zones = zones;
    
    //TEST add panic on a few random zones
    zones[0].panic_level = 0;
    zones[1].panic_level = 5;
    zones[2].panic_level = 15;
    zones[3].panic_level = 30;
    zones[5].panic_level = 30;
    zones[6].panic_level = 40;
    zones[11].panic_level = 50;
	
	zones[0].people = 20;
	zones[1].people = 25;
	zones[3].people = 80;
	zones[5].people = 5;
	zones[7].people = 35;
	zones[9].people = 50;
	zones[11].people = 15;
	zones[8].people = 125;
	zones[4].people = 10;
	

    //set centroidX and centroidY for test zone
    //TODO THIS IS ACTUALLY CENTER, NOT CENTROID. For better result, 
    // centroid has to be calculated (might not be of use to us since
    // polygons aren't that extreme)
    for (var zon=0; zon<zones.length; zon++){
    	var xx=0, yy=0;
	    for (var i=0; i<zones[zon].nodes.length; i++){
	    	xx+=this.map.nodes[zones[zon].nodes[i]].x;
	    	yy+=this.map.nodes[zones[zon].nodes[i]].y;
	    }
    zones[zon].centroid=[xx/zones[zon].nodes.length, yy/zones[zon].nodes.length];
    }
    
    
    this.players = [];
    player_colors = ["red","orange","yellow","chartreuse ","green","aqua","blue","purple"];
	player_role =["crowd manager", "driver", "volunteer", "operation expert", "coordinator","passer by"];
	/*this.randomrole =  
		[{title: "Constructor",
		
        info:"Can create roadblocs alone",
		effects: [{
            domain:'zone',
			type:'panic',
			panic:(-5),
			affects:[0,1,2,3,4,5,6,7,8,9]
		}]
		}];
	*/
	
    for(var i = 0; i < 8; i++){
		player = new ge.Player(i, "player" + i, i*2, player_colors[i], player_role[Math.floor(Math.random()*player_role.length)],4);
    	player.info_cards.push(this.info_cards[Math.floor((Math.random()*(this.info_cards.length-1)))]);
    	player.info_cards.push(this.info_cards[Math.floor((Math.random()*(this.info_cards.length-1)))]);
    	this.players.push(player);
    }
  /*  //add dummy roles
    this.players[0].role = "Passer By";
    this.players[1].role = "Crowd Manager";
    this.players[2].role = "Driver";
    this.players[3].role = "Operation Expert";
    this.players[4].role = "Volunteer";
    this.players[5].role = "Passer By";
    this.players[6].role = "Coordinator";
    this.players[7].role = "Crowd Manager";
*/
    //add some event(s)

    this.events = [
                   { id:0,
                 name:"Fire in all industry zones!",
                 effects: [{
                 domain:'zone',
                 type:'panic',
                 panic:(20),
                 affects:'industry'
                 }]
            },
            {	id:1,
            name:"Power outage in all residential zones!",
                     effects: [{
                     domain:'zone',
                     type:'panic',
                     panic:(5),
                     affects:'residential'
                     }]
                    },
            {	id:2,
                     name:"Terrorist attack in all city zones!",
                     effects: [{
                     domain:'zone',
                     type:'panic',
                     panic:(35),
                     affects:[9, 10, 11]
                     }]
                    }
            ];
                
            }
    
//round panic by nearest five
function round5(x)
{
    return (x % 5) >= 2.5 ? parseInt(x / 5) * 5 + 5 : parseInt(x / 5) * 5;
}


/*  Decode command

    Executes in-game commands.
*/
ge.prototype.command = function(client, c){
    var nodes = this.map.nodes,
		zones = this.map.zones,
        players = this.players,
        changed = {none:true};
    
	
    switch (c.type) {
        case 'move_player':
            if (c.player_id === this.active_player) {
                var p = players[c.player_id];
		    	if(p.move_player(nodes[p.node], nodes[c.node_id]))
		    		{changed.players = [p];}
            }
            break;
            
  		case 'select_node':
  			var n = c.node_id,
  				options = [],
  				p = players[this.active_player];
  				if(nodes[n].can_add_information_center(p)) {
  					options.push('info');
  				}
  				if (nodes[n].can_add_road_block(p, players)) {
  					options.push('block');
  				}
  				if (nodes[n].can_remove_road_block(p, players)) {
  					options.push('rem_block');
  				}
  			changed.options = options;
  			
  			break;
  			
  		case 'select_zone':
  			var z = zones[c.zone_id],
  				options = [],
  				p = players[this.active_player];
  				
  			if(z.can_move_people_from(p, 5)) {
				options.push('people');
  			}
  			if(z.can_dec_panic(p,nodes[p.node])){
  				options.push('panic');
  			}
  			changed.options = options;
  			break;
  
  
		case 'decrease_panic':
			console.log("Trying to decrease panic in zone: " + c.zone_id);
            
            var z = zones[c.selected_zone],
                p = players[this.active_player]
            
            if (z.dec_panic(p, nodes[p.node])){
                changed.zones = [z];
                changed.players = [p];
            }
			
			else {
				client.emit('error', 'Could not decrease panic');
				break;
			}
					
			break;
			
			
			
		case 'move_people':
			// TODO: find out how many people we can move
			console.log("Trying to move people from zone: " + c.zone_from+
				"to zone: " + c.zone_to);

			
			if (zones[c.zone_from].move_people(players[this.active_player], zones[c.zone_to], 5)) {
				changed.zones=[zones[c.zone_to], zones[c.zone_from]];
				changed.players = [players[this.active_player]];
			}
			


			break;
			

			//TODO Finish this
		case 'create_info_center':

			var p = players[this.active_player],
				n = nodes[c.selected_node];


			if(
				this.information_centers < this.max_information_centers
				&& p.node === n.id 
				&& n.add_information_center(p)){
				
				changed.nodes = [n];
				changed.players = [p];
				this.information_centers++;
			}
			break;

			//TODO finish this
		case 'create_road_block':

			var p = players[this.active_player];
			
			if((this.road_blocks < this.max_road_blocks) && nodes[p.node].add_road_block(p, players)){
				changed.nodes = [nodes[p.node]];
				changed.players = [p];
				this.road_blocks++;
			}

			break;

		case 'remove_road_block':
			
			var p = players[this.active_player];

			if(nodes[p.node].remove_road_block(p, players)){
				changed.nodes = [nodes[p.node]];
				changed.players = [p];
				this.road_blocks--;
			}

			break;		



		case 'use_card':
			var ic = players[this.active_player].info_cards.splice(c.card,1)[0];
			changed = effect(ic, this);
            changed.players = changed.players ? changed.players.push(players[this.active_player]) :  [players[this.active_player]];
			break;
			
			
	    case 'inc_panic':
	        for (var i = 0; i < zones.length;i++) {
				if (!zones[i].is_panic_zero()){
					zones[i].update_panic(10);
				}
	        }
	        this.timer += 20;
	        
	        changed.timer = this.timer;
	        changed.zones = zones;
	        
	        break;
		
		
		
		case 'end_turn':
		    
		    var ap = players[this.active_player];
            ap.actions_left = ap.role === 'activist' ?  5 : 4;
            
			this.turn++;
			this.turnsSinceEvent++;
			this.active_player = this.active_player >= this.players.length-1 ?  0 : this.active_player+1;

            ap = players[this.active_player];
            //TODO Add random info cards
			client.emit('msg', this.cards_left);
			if(this.cards_left > 0){
				ap.info_cards.push(this.info_cards[Math.floor((Math.random()*(this.info_cards.length-1)))]);
				this.cards_left -= 1;
			}
			

			//fire a random event every Xth turn
			if (this.turnsSinceEvent===this.eventTurns){
			var randomEvent=Math.floor(Math.random()*this.events.length);
			changed = effect(this.events[randomEvent], this);
			changed.event = this.events[randomEvent];
			this.turnsSinceEvent=0;
			}
			
			
			changed.players = [ap];
			changed.turn = this.turn;
			changed.active_player = this.active_player;

			break;
        
        console.log("No matching command types");
            
    }
    
    if(changed.players || changed.nodes || changed.zones || changed.turn || changed.event){
        changed.none = false;
    }
    
    console.log("");
    console.log("Sending:");
    if (c.type === "inc_panic"){
        console.log("Updating Panic");
    }
    else {
        console.log(changed);
    }
    var stringed = JSON.stringify(changed);
    client.emit('change', stringed);	
    
}



ge.prototype.start = function(){
    var g = state(this);
    this.client.emit('start_game', JSON.stringify(g));
}




ge.prototype.reconnect_game = function(client, c) {
    
}

ge.prototype.save_state = function(client, c) {

}
ge.prototype.delete_game = function(client, c) {
}




ge.prototype.next_player = function(game) {
	game.active_player.set_actions_left(4);
	game.active_player = ge.players[(game.turn-1) % game.players-length];
}


ge.prototype.timer_tick = function(client, c) {	
	//TODO: all paniced zones get +5, unpaniced get +1, 
	// Full panic spreads, and gives +5 to neighbours
}

function effect(card, g) {
    var effects = card.effects,
        e, i, z, p,
        zones = g.map.zones,
        nodes = g.map.nodes,
        players = g.players,
        changed = {};
        
      
     
    console.log("Executing card");
    console.log(card);
    console.log("Desc:");
    console.log(card.desc);
    console.log("Effects:");
    console.log(card.effects);

    for (i = 0; i<effects.length; i++){
        e = effects[i];
        console.log("Effect nr "+i);
        console.log(e);
        switch(e.domain){
            case 'zone':
                changed.zones = [];
                if(typeof e.affects === 'string'){
                	var afflicted = e.affects;
                	e.affects = [];
                	for (z = 0; z<zones.length; z++){
                		if (zones[z].type === afflicted){
                			e.affects.push(z);
                		}
                	}
                }
                switch(e.type){
                    case 'panic':
                        for (z = 0; z<e.affects.length; z++){
                            zones[e.affects[z]].update_panic(e.panic);
                            changed.zones.push(zones[e.affects[z]]);
                        }
                        break;
                        
                    case 'event':
                    	var infoCenter=false;
                    	for (z = 0; z<e.affects.length; z++){
                    		for (var n=0; n<zones[e.affects[z]].nodes.length; n++){
                    			var checkZone = zones[e.affects[z]];
                    			var checkNode = nodes[checkZone.nodes[n]];
                    			if (checkNode.has_information_center){
                    				
                    				infoCenter=true;
                    			}
                    		}
                    		if (infoCenter){
                    			console.log("LOL INFO");
                    			zones[e.affects[z]].update_panic(round5((e.panic)/2));
                    			changed.zones.push(zones[e.affects[z]]);
                    		}
                    		else{
                    			console.log("LOL NOINFO");
                    			zones[e.affects[z]].update_panic(e.panic);
                    			changed.zones.push(zones[e.affects[z]]);
                    		}
                    		infoCenter=false;
                        }
                        break;
                        
                    case 'people':
                        
                        break;
                
                }
            
            
            
                break;
            case 'player':
                changed.players = [];
                switch(e.type){
                    case 'actions':
                        for (p = 0; p < e.affects.length; p++){
                            players[e.affects[p]].update_actions(e.actions);
                            changed.players.push(players[e.affects[p]]);
                        }
                        break;
                    case '':
                        
                        break;
                }
            
            
            
                break;
        }
        
        
    }//end effect list for
    
    return changed;
}//end effect()


function state(g){
    return {
        type : 'state',
        zones : g.map.zones,
        nodes : g.map.nodes,
        players : g.players,
        turn : g.turn,
        timer : g.timer,
        active_player : g.active_player
    };
}

function empty_state(g){
    return {
        type : 'none',
        zones : [],
        nodes : [],
        players : []
    };
}

//----------------------------
//---------MODELS-------------
//----------------------------

ge.Player = function(id, user, node, color, role, actions_left) {
	this.id = id;
	this.user = user;
	this.node = node;//Position of the player
	this.color = color;
	this.role = role;
	this.info_cards = [];
	this.actions_left = actions_left;
	this.class = 'player';
	
}

ge.Player.prototype.update_actions = function (actions) {
	var able = this.can_update_actions(actions);
	if (able) {
	    this.actions_left += actions;
	    console.log("Changed player actions by "+actions);
	    return true
	}
    return false;
}
ge.Player.prototype.can_update_actions = function (actions) {

	var result_action = this.actions_left + actions;
	if (result_action < 0) {
		console.log("Not enough actions left");
	    return false;
	}
    return true;
}

ge.Player.prototype.remove_info_card = function(info_card) {
	for (var i = 0; i < this.info_cards.length; i++) {
		if (this.info_cards[i] === info_card) {
			this.info_cards.splice(i, 1);
		}
	}
}
ge.Player.prototype.add_info_card = function(info_card) {
	this.info_cards.push(info_card);
}

ge.Player.prototype.move_player = function (node_from, node_to) {
	var able = this.can_move_player(node_from, node_to);
	if (able) {
	    this.update_actions(-1);
	    this.node = node_to.id;
	    return true;
	}
	return false;
}
ge.Player.prototype.can_move_player = function (node_from, node_to) {
	console.log("Can move player?");
	if (node_from === node_to) {
	    console.log("node from and to are same");
		return false;
	} 
	else if (node_from.connects_with(node_to)) {
		if (this.can_update_actions(-1)){
			console.log("True");
		    return true;
		}
		return false;
	}
	console.log("node does not connect");
	return false;
}






ge.User = function (username, password, name, email, is_admin) {
	this.username = username;
	this.password = password;
	this.name = name;
	this.email = email;
	this.is_admin = is_admin;
}








ge.Node = function (id, x, y, is_start_position, connects_to) {
	this.id = id;
	this.x = x;
	this.y = y;
	this.is_start_position = is_start_position;
	this.connects_to = connects_to; // Nodes
	this.has_information_center = false;
	this.has_road_block = false;

}
ge.Node.prototype.add_information_center = function (player) {
	var able = this.can_add_information_center(player);
	if (able){
		this.has_information_center = true;
		return true;
	}
	return false;
}
ge.Node.prototype.can_add_information_center = function (player) {
	console.log("Can add info center?");
	if (this.has_information_center) {
		console.log("Already has information center");
		return false;
	}
	if(this.id !== player.node){
		console.log("Player is not on node");
		return false;
	}
	
    if(player.can_update_actions(-4) ){
    	console.log("True");
		return true;
    }
    return false;
}


ge.Node.prototype.add_road_block = function (player, players) {
	var able = this.can_add_road_block(player, players);
	if (able){
		this.has_road_block = true;
		return true;
	}
	return false;	

}
ge.Node.prototype.can_add_road_block = function (player, players) {
	console.log("Can add road block?");
	if (this.has_road_block) {
		console.log('error', "Already has road block");
	    return false;
	}
	
	var another_player = false;
	for (var i = 0; i < players.length; i++) {
		if ((players[i].node===player.node)&&(!(i===player.id))) {
			another_player = true;
		}
	}
	if (!another_player){
		console.log("Player "+player+" failed to add road block, no other players on node!");
		return false
	}
	
	if(player.can_update_actions(-1) ){
		console.log("True");
		return true;
	}
	
	return false;	

}

ge.Node.prototype.remove_road_block = function (player, players) {
	var able = this.can_add_road_block(player, players);
	if (able){
		this.has_road_block = false;
		return true;
	}
	return false;
}
ge.Node.prototype.can_remove_road_block = function (player, players) {
	console.log("Can remove road block?");
	if (!this.has_road_block) {
		console.log("No road block at this node");
	    return false;
	}
	
	var another_player = false;
	for (var i = 0; i < players.length; i++) {
		if ((players[i].node===player.node)&&(!(i===player.id))) {
			another_player = true;
		}
	}
	if (!another_player){
		console.log("No other players on node");
		return false
	}
	if(player.can_update_actions(-1) ){
		console.log("Can remove road block");
		return true;
	}
	return false;	
}
ge.Node.prototype.connects_with = function(n){
    return this.connects_to.indexOf(n.id) > -1;
}









ge.Role = function (title, info, effect) {
	this.title = title;
	this.info = info;
	this.effect = effect;
}






ge.Event = function (text, effect) {
	this.text = text;
	this.effect = effect;
}










ge.Zone = function (id, nodes, zones) {
	this.id = id;
	this.type = "residential";
	this.people = 0;
	this.nodes = nodes;
	this.adjacent_zones = zones;
	this.panic_level = 0;//settes til 0 i starten??
	this.centroid = [0,0];//center (centroid) X and Y of zone polygon to put panic info
	
}
ge.Zone.prototype.update_panic = function (panic_level) {
	this.panic_level += panic_level;		
	if (this.panic_level >= 50) {
		this.panic_level = 50;
	} 
	else if (this.panic_level < 0) {
		this.panic_level = 0;
	}
}
ge.Zone.prototype.is_panic_zero = function () {
	return this.panic_level === 0 ?  true : false;
}
ge.Zone.prototype.dec_panic = function(player, node) {
	var able = this.can_dec_panic(player, node);
	if(able){
		if(player.role === 'crowd manager'){
			this.update_panic(player.role.panic)
		}
		else{
			this.update_panic(-5);
		}
		player.update_actions(-1);
		return true;
	}
	return false;
}
ge.Zone.prototype.can_dec_panic = function(player, node) {
	console.log("Can decrease panic?");
	if (this.nodes.indexOf(node.id) >= 0) {
		if(this.panic_level >= 5){

			if(player.can_update_actions(-1)){
				console.log("True");
				return true;
			}
			
		}
		else{
			console.log("Panic is too low");
		}
	}
	else{
		console.log("Not an adjacent node");
	}
	return false;
}


ge.Zone.prototype.move_people = function (p, to_zone, num) {
	var able = this.can_move_people(p, to_zone, num);
	if(able){
		this.people -= num;
		to_zone.people += num;
		return true;
	}
	return false;
}
ge.Zone.prototype.can_move_people = function (p, to_zone, num) {
	console.log("Can move people?");
	if (this.people >= num){
		if(this.adjacent_zones.indexOf(to_zone.id)>=0 ){
			if(p.can_update_actions(-1)) {
				console.log("True");
				return true;
			}
			
		}
		else{
			console.log("Not an adjacent zone");
		}
	}
	else {
		//error 
		console.log("There isnt that many people in this zone");
	}
	return false;
}
ge.Zone.prototype.can_move_people_from = function (p, num){
	console.log("Can move from this zone?");
	if (this.people >= num){
		if(this.nodes.indexOf(p.node)>=0 ){
			if(p.can_update_actions(-1)) {
				console.log("True");
				return true;
			}
		}
		else{
			console.log("Zone is not adjacent to player");
		}
	}
	else{
		console.log("Not enough people in zone");
	}
	return false;
}




/*
	

	text 	What to be shown to the users when looking at the card
	id 		identification to what case sentence to be called when using the card
	value	value to be used in the effect of the card
*/
ge.Info_card = function (text, id, value) {
	this.text = text;
	this.id = id;
	this.value = value;
}







ge.Map = function (nodes, zones) {
	this.nodes = nodes;
	this.zones = zones;
}






ge.Settings = function (timer_interval) {
	var timer = new timer(timer_interval);
}









