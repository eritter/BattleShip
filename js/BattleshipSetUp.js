var playerFleet;
var compFleet;
var compAI;

//Player choosing variables
var rowOfClicked;
var colOfClicked;
var currentShipBeingAdded;

//Battle variables
var turnCounter;	//based on number of turns player gets
var partOfTurn;		//playerAttack, playerAttackResponse, game over




//********************************************//
// Object prototype methods and constructors  //
//********************************************//

function Fleet(attacker) {
	this.ships = [];
	this.attacker = attacker;
}

Fleet.prototype.addShip = function(ship) {
	this.ships.push(ship)
};

Fleet.prototype.attack = function(location) {
	console.log("*************************");
	console.log("Attacking " + location);
	for(var s = 0; s < this.ships.length; s++) {
		var status = this.ships[s].attack(location);

		if(status != "missed") {
			var response = this.attacker + " attacked location " + location + " and " + status + "!";
			if(status.indexOf("sunk") != -1) {
				console.log("Sunk " + this.ships.length);
				if(this.ships.length == 1) {
					response += " " + this.attacker + " won!";
					partOfTurn = "game over";
				} else {
					this.ships.splice(s, 1);
				}
			}
			return response;
		}
	}
	return this.attacker + " attacked location " + location + " and missed!";
};

Fleet.prototype.isAValidPlacement = function(locations) {
	for(var l = 0; l < locations.length; l++ ) {
		var row = locations[l][0];
		var col = locations[l][1];
		if(row > 7 || row < 0 || col > 7 || col < 0) {
			return false;
		}
	}
	//^in the grid^

	for(var s = 0; s < this.ships.length; s++) {
		for(var l = 0; l < this.ships[s].locations.length; l++) {
			for(var l2 = 0; l2 < locations.length; l2++) {
				if(locations[l2][0] == this.ships[s].locations[l][0] && locations[l2][1] == this.ships[s].locations[l][1]) {
					return false;
				}
			}
		}
	}
	//^doesn't overlap another ship^

	return true;
};

function Ship(name, length, locs) {
	this.name = name;
	this.length = length;
	this.sunk = false;
	this.locations = locs;
}
//returns list [what happened, ship if it sunk]
Ship.prototype.attack = function(location) {
	for(var l = 0; l < this.locations.length; l++) {
		if(this.locations[l][0] == location[0] && this.locations[l][1] == location[1]) {
			this.locations.splice(l, 1);
			if(this.locations.length < 1) {
				return "sunk the " + this.name;
			} else {
				return "hit";
			}
		}
	}
	return "missed";
};

function ComputerAI(level) {
	this.level = level;
	this.gridOfInformation = [];
	for(var i = 0; i < 8; i++) {
		this.gridOfInformation.push(new Array());
		for(var j = 0; j < 8; j++) {
			this.gridOfInformation[i].push("unknown");
		}
	}
}

ComputerAI.prototype.getNextAttackLocation = function() {
	//default is to randomly choose a spot
	while(true) {
		var row = Math.floor(Math.random() * 8);
		var col = Math.floor(Math.random() * 8);
		if(this.gridOfInformation[row][col] == "unknown") {
			return [row,col];
		}
	}
};

ComputerAI.prototype.setFleet = function() {
	
	//getAllPossibleFleets();

	compFleet.addShip(new Ship("Carrier", 5, getRandomShipLocations(5, compFleet)));
	compFleet.addShip(new Ship("Battleship", 4, getRandomShipLocations(4, compFleet)));
	compFleet.addShip(new Ship("Cruiser", 3, getRandomShipLocations(3, compFleet)));
	compFleet.addShip(new Ship("Submarine", 3, getRandomShipLocations(3, compFleet)));
	compFleet.addShip(new Ship("Destroyer", 2, getRandomShipLocations(2, compFleet)));

	console.log(compFleet);
};

function getRandomShipLocations(length, fleet) {
	while(true) {
		var row = Math.floor(Math.random() * 8);
		var col = Math.floor(Math.random() * 8);

		var allEndPoints = [];
		var validEndPoints = [];
		
		allEndPoints.push([row - (length - 1), col]);
		allEndPoints.push([row + (length - 1), col]);
		allEndPoints.push([row, col - (length - 1)]);
		allEndPoints.push([row, col + (length - 1)]);

		for (var i = allEndPoints.length - 1; i >= 0; i--) {
			var locations = getLocationsOfShip(row,col,allEndPoints[i][0], allEndPoints[i][1]);
			if(fleet.isAValidPlacement(locations)) {
				validEndPoints.push(allEndPoints[i]);
			}
		}

		if(validEndPoints.length > 0) {
			var choosenEndPoint = validEndPoints[Math.floor(Math.random() * validEndPoints.length)];
			return getLocationsOfShip(row, col, choosenEndPoint[0], choosenEndPoint[1]);
		}
	}
}

function CollectionOfFleets() {
	this.fleets = [];
}

CollectionOfFleets.prototype.addFleet = function(fleet) {
	this.fleets.push(fleet);
};

CollectionOfFleets.prototype.filter = function(location, status) {
	
};

function LightFleet() {
	this.grid = new Array(64); //stored in row major form
	for (var i = arguments.length - 1; i >= 0; i--) {
		var ship = arguments[i];
		var locs = getLocationsOfShip(ship[0][0], ship[0][1], ship[1][0], ship[1][1]);
		for (var i = locs.length - 1; i >= 0; i--) {
			this.grid[locs[i][0] * 8 + locs[i][1]] = 1;
		}
	}
}

LightFleet.prototype.getLocStatus = function(location) {
	
};

function getAllPossibleFleets() {
	var collectionOfFleets = new CollectionOfFleets();

	console.log("started");

	var carrierPositions = getAllEndPointLocationsOfAShip(5);
	var battleshipPositions = getAllEndPointLocationsOfAShip(4);
	var cruiserPositions = getAllEndPointLocationsOfAShip(3);
	var submarinePositions = getAllEndPointLocationsOfAShip(3);
	var destroyerPositions = getAllEndPointLocationsOfAShip(2);

	var counter = 0;
	console.log(counter);
	for (var c = carrierPositions.length - 1; c >= 0; c--) {
		var carrier = carrierPositions[c];

		for (var b = battleshipPositions.length - 1; b >= 0; b--) {
			var battleship = battleshipPositions[b];
			if(doesntIntersect(battleship, carrier)) {

				for (var cr = cruiserPositions.length - 1; cr >= 0; cr--) {
					var cruiser = cruiserPositions[cr];

					if(doesntIntersect(cruiser, battleship, carrier)) {	
						for (var s = submarinePositions.length - 1; s >= 0; s--) {
							var submarine = submarinePositions[s];

							if(doesntIntersect(submarine, cruiser, battleship, carrier)) {
								for (var d = destroyerPositions.length - 1; d >= 0; d--) {
									var destroyer = destroyerPositions[d];

									if(doesntIntersect(destroyer, submarine, cruiser, battleship, carrier)) {
										counter++;
										if(counter % 1000 == 0) {
											console.log(counter);
										}
										collectionOfFleets.addFleet(new LightFleet(carrier, battleship, cruiser, submarine, destroyer));
									}
								}
							}
						}
					}
				}
			}
		}
	}
	console.log("COUNTER " + counter);
}

function doesntIntersect() {
	var ship1Start = arguments[0][0];
	var ship1End = arguments[0][1];
	var ship1Horizontal = (ship1Start[0] == ship1End[0]);

	for (var i = 1; i < arguments.length; i++) {
		var ship2Start = arguments[i][0];
		var ship2End = arguments[i][1];
		var ship2Horizontal = (ship2Start[0] == ship2End[0]);
		
		if(ship1Horizontal && ship2Horizontal) {
			if(ship1Start[0] <= ship2Start[0] && ship2Start[0] <= ship1Start[0]) {
				return false;
			}
			if(ship2Start[0] <= ship1Start[0] && ship1Start[0] <= ship2Start[0]) {
				return false;
			}
		} else if(!ship1Horizontal && !ship2Horizontal) {
			if(ship1Start[1] <= ship2Start[1] && ship2Start[1] <= ship1Start[1]) {
				return false;
			}
			if(ship2Start[1] <= ship1Start[1] && ship1Start[1] <= ship2Start[1]) {
				return false;
			}
		} else if(ship1Horizontal) {
			var rowIntersects = ship2Start[0] <= ship1Start[0] && ship1Start[0] <= ship2Start[0];
			var colIntersects = ship1Start[1] <= ship2Start[1] && ship2Start[1] <= ship1Start[1];
			if(colIntersects && rowIntersects) {
				return false;
			}
		} else {
			var rowIntersects = ship1Start[0] <= ship2Start[0] && ship2Start[0] <= ship1Start[0];
			var colIntersects = ship2Start[1] <= ship1Start[1] && ship1Start[1] <= ship2Start[1];
			if(colIntersects && rowIntersects) {
				return false;
			}
		}
	}
	return true;
}

function getAllEndPointLocationsOfAShip(length) {
	var shipLocations = [];
	for (var row = 0; row < 8 - (length - 1); row++) {
		for (var col = 0; col < 8 - (length - 1); col++) {
			shipLocations.push([[row, col], [row + length - 1, col]]);
			shipLocations.push([[row, col], [row, col + length - 1]]);
		}
	}
	return shipLocations;
}

//******************************************//
// Methods for multiple parts of the game  //
//*****************************************//

// should return [row,col] of button
function getButtonLocation(buttonId) {
	var buttonIndex = buttonId.indexOf("utton");
	return [buttonId.charAt(buttonIndex + 5), buttonId.charAt(buttonIndex + 6)];
}

function keyPressed(event) {
	if(partOfTurn == "playerAttackResponse") {
		compAttack();
	}
}

//************************************//
// Methods for only the start screen  //
//************************************//

function startGame(level) {
	createChooseShipsScreen();

	playerFleet = new Fleet("The Computer");
	compFleet = new Fleet("You");
	compAI = new ComputerAI(level);

	currentShipBeingAdded = ["Carrier", 5];
}


//*********************************************//
// Methods for only the choosing ships screen  //
//*********************************************//

function buttonClicked(buttonId) {
	var shipBeingAdded = 0;
	var button = $("#" + buttonId);
	if(button.hasClass("firstEndPoint")) {
		button.removeClass("firstEndPoint");
		clearAllUnselectable();
	} else if(button.hasClass("choiceForOtherEndPoint")) {
		addShip(rowOfClicked, colOfClicked, buttonId.charAt(6), buttonId.charAt(7));
	} else if(!button.hasClass("unselectable") && !button.hasClass("chosenShipLocation")) {
		//Clear board. First end point selected
		button.addClass("firstEndPoint");
		makeUnselectablesAndChoices(buttonId);
	}
}

// Change nothing. Just get information
function getLocationsOfShip(row1, col1, row2, col2) {
	var locs = [];
	if(row1 == row2) {
		if(col2 < col1) {
			var temp = col2;
			col2 = col1;
			col1 = temp;
		} //WLOG col2 is larger
		for(var i = col1; i <= col2; i++) {
			var tuple = [row1, i];
			locs.push(tuple);
		}
	} else if(col1 == col2) {
		if(row2 < row1) {
			var temp = row2;
			row2 = row1;
			row1 = temp;
		} //WLOG row2 is larger
		for(var i = row1; i <= row2; i++) {
			locs.push([i, col1]);
		}
	} else return -1;
	return locs;
}

function getAddShipText(shipName, shipLength) {
	return "Please place your "+ shipName +" on the board. It requires "+shipLength+" consecutive spaces.";
}


// v Changes stuff, but doesn't rely on the grid at all v

function incrementShip() {
	switch(currentShipBeingAdded[0]) {
		case "Carrier":
			currentShipBeingAdded = ["Battleship", 4];
			break;
		case "Battleship":
			currentShipBeingAdded = ["Cruiser", 3];
			break;
		case "Cruiser":
			currentShipBeingAdded = ["Submarine", 3];
			break;
		case "Submarine":
			currentShipBeingAdded = ["Destroyer", 2];
			break;
		case "Destroyer":
			currentShipBeingAdded = ["Done", -1];
			break;
	}
}

function addShip(row1, col1, row2, col2) {
	var locations = getLocationsOfShip(row1, col1, row2, col2);
	var ship = new Ship(currentShipBeingAdded[0], currentShipBeingAdded[1], locations);
	
	playerFleet.addShip(ship);
	addShipToGrid(locations);
	incrementShip();

	if(currentShipBeingAdded[1] != -1) {
		$("#instructions").text(getAddShipText(currentShipBeingAdded[0], currentShipBeingAdded[1]));
	} else {
		//last ship has been added
		$("#instructions").text("You have set up your ships. Prepare for battle. Click here to start.");
		$("#instructions").click(function() {
			startBattle();
		});
		makeAllUnselectable();
	}

}

// v Changes stuff on the grid v
function addShipToGrid(locations) {
	for(var i = 0; i < locations.length; i++) {
		var button = $("#button"+locations[i][0]+locations[i][1]);
		button.addClass("chosenShipLocation");
		button.removeClass("unselectable");
		button.removeClass("choiceForOtherEndPoint");
		button.removeClass("firstEndPoint");
	}

	for(var i = 0; i < 8; i++) {
		for(var j = 0; j < 8; j++) {
			var button = $("#button"+i+j);
			button.removeClass("unselectable");
			button.removeClass("choiceForOtherEndPoint");
			button.removeClass("firstEndPoint");
		}
	}
}

function makeAllUnselectable() {
	for(var i = 0; i < 8; i++) {
		for(var j = 0; j < 8; j++) {
			var button = $("#button"+i+j);
			button.addClass("unselectable");
		}
	}
}

function clearAllUnselectable() {
	for(var i = 0; i < 8; i++) {
		for(var j = 0; j < 8; j++) {
			$("#button"+i+j).removeClass("unselectable");
			$("#button"+i+j).removeClass("choiceForOtherEndPoint");
		}
	}
}

function makeUnselectablesAndChoices(buttonId) {
	//TODO shouldn't have so much of the logic
	var row = buttonId.charAt(6);
	var col = buttonId.charAt(7);
	rowOfClicked = row;
	colOfClicked = col;
	for(var i = 0; i < 8; i++) {
		for(var j = 0; j < 8; j++) {
			var button = $("#button"+i+j);
			if(!button.hasClass("firstEndPoint") && !button.hasClass("chosenShipLocation")) {
				//no button should have class unselectable at this point
				if(checkIfValidShipPlacement(row, col, i, j, currentShipBeingAdded[1])) {
					button.addClass("choiceForOtherEndPoint");
				} else {
					button.addClass("unselectable");
				}
				
			}
		}
	}
}
// v Not sorted out v

function checkIfValidShipPlacement(row1, col1, row2, col2, lengthOfShip) {
	//TODO eventually make not rely on grid
	if(((Math.abs(col1 - col2) == lengthOfShip - 1) && row1 == row2) || ((Math.abs(row1 - row2) == lengthOfShip - 1) && col1 == col2)) {
		var locations = getLocationsOfShip(row1, col1, row2, col2);
		for(var i = 0; i < locations.length; i++) {
			var button = $("#button"+locations[i][0]+locations[i][1]);
			if(button.hasClass("chosenShipLocation")) {
				return false;
			}
		}
		return true;
	}
	return false;
}

//*************************************//
// Methods for only the battle screen  //
//*************************************//

function battleButtonClicked(buttonId) {
	var button = $("#"+buttonId);
	if(partOfTurn == "playerAttack") {
		if(!button.hasClass("miss") && !button.hasClass("hit")) {
			partOfTurn = "playerAttackResponse";
			var loc = getButtonLocation(buttonId);
			var response = compFleet.attack(loc);
			if(response.indexOf("hit") != -1 || response.indexOf("sunk") != -1) {
				button.addClass("hit");
			} else {
				button.addClass("miss");
			}
			$("#instructions").text(response);
		}
	}
}

function instructionsClicked() {
	if(partOfTurn == "playerAttackResponse") {
		compAttack();
	}
}

function compAttack() {
	partOfTurn = "playerAttack";
	var locToAttack = compAI.getNextAttackLocation();
	var button = $("#playerBattleButton"+locToAttack[0]+locToAttack[1]);
	var response = playerFleet.attack(locToAttack);
	if(response.indexOf("hit") != -1 || response.indexOf("sunk") != -1) {
		button.addClass("hit");
		compAI.gridOfInformation[locToAttack[0]][locToAttack[1]] = "hit";
	} else {
		button.addClass("miss");
		compAI.gridOfInformation[locToAttack[0]][locToAttack[1]] = "miss";
	}
	$("#instructions").text(response);
}

function startBattle() {
	compAI.setFleet();
	createBattleScreen();

	turnCounter = 0;
	partOfTurn = "playerAttack";

	updateInstructions();

}

function updateInstructions() {
	var message;
	switch(partOfTurn) {
		case "playerAttack":
			message = "Click on a square to attack that square.";
			break;
		case "playerAttackResponse":
			message = "You either missed, hit or sunk";
			break;
		case "compAttack":
			message = "The computer is attacking spot x";
			break;
		case "compAttackResponse":
			message = "The computer either missed, hit or sunk";
			break;
	}
	$("#instructions").text(message);
}

// v Deals with grid V
function showPlayersShips() {
	for(var s = 0;  s < playerFleet.ships.length; s++) {
		var ship = playerFleet.ships[s];

		for(var i = 0; i < ship.locations.length; i++) {
			var buttonId = "#playerBattleButton" + ship.locations[i][0] + ship.locations[i][1];
			var button = $(buttonId);
			button.addClass("notHit");
		}
	}
}

function showAIShips() {
	for(var s = 0;  s < compFleet.ships.length; s++) {
		var ship = compFleet.ships[s];

		for(var i = 0; i < ship.locations.length; i++) {
			var buttonId = "#compBattleButton" + ship.locations[i][0] + ship.locations[i][1];
			var button = $(buttonId);
			button.addClass("notHit");
		}
	}
}

//************************************************************//
// Creating various screens (rules, choose ships, menu, etc)  //
//************************************************************//

function createStartMenuScreen() {
	var main = $("#main");
	main.empty();
	$('body').css('background-image', 'url(img/BattleShipWallpaper.jpg)');
	$("#main").append("<center><div id=\"mainMenu\"></div></center>");
	$("#mainMenu").append("<h1>Let's Play Battleship!</h1>");
	$("#mainMenu").append("<div id=\"line\"></div>");
	$('#mainMenu').append("<h1 onclick=\"startGame(0)\" class=\"choiceLabel\">Easy</h1>");
	$('#mainMenu').append("<h1 onclick=\"startGame(1)\" class=\"choiceLabel\">Medium</h1>");
	$('#mainMenu').append("<h1 class=\"choiceLabel\">Hard (coming sometime)</h1>");
	$('#mainMenu').append("<h1 onclick=\"createRulesScreen()\" class=\"choiceLabel\">Rules (coming sometime)</h1>");
}

function createChooseShipsScreen() {
	var main = $("#main");
	main.empty();
	main.append("<div id=\"communicationsContainer\"></div>")

	$("#communicationsContainer").append("<h3 id=\"instructions\">"+getAddShipText("Carrier", 5)+"</h3>");
	main.append("<table class = \"shipsBoard\" id=\"chooseShipsBoard\"></table>");
	for(var i = 0; i < 8; i++) {
		$("#chooseShipsBoard").append("<tr id=\"chooseShipsRow" + i + "\"></tr>");
		for(var j = 0; j < 8; j++) {
			$("#chooseShipsRow"+i).append("<td id = \"button"+i+j+"\" class = \"squareButton\" onclick = \"buttonClicked(this.id)\"></td>");
		}
	}
}

function createRulesScreen() {
	
}

function createBattleScreen() {
	var main = $("#main");
	main.empty();

	main.append("<div id=\"communicationsContainer\"></div>")
	main.append("<div id=\"leftContainer\" class=\"halfPageContainer\"></div>");
	main.append("<div id=\"rightContainer\" class=\"halfPageContainer\"></div>");

	$("#communicationsContainer").append("<p id=\"instructions\" onclick=\"instructionsClicked()\"></p>");

	$("#leftContainer").append("<h3 class=\"whoseShipsLabel\">Your Ships</h3>");
	$("#leftContainer").append("<table class = \"shipsBoard\" id=\"playerBoard\"></table>");
	for(var i = 0; i < 8; i++) {
		$("#playerBoard").append("<tr id=\"playerShipsRow" + i + "\"></tr>");
		for(var j = 0; j < 8; j++) {
			$("#playerShipsRow"+i).append("<td id = \"playerBattleButton"+i+j+"\" class = \"squareButton\"></td>");
		}
	}

	$("#rightContainer").append("<h3 class=\"whoseShipsLabel\">Their Ships</h3>");
	$("#rightContainer").append("<table class = \"shipsBoard\" id=\"compBoard\"></table>");
	for(var i = 0; i < 8; i++) {
		$("#compBoard").append("<tr id=\"compShipsRow" + i + "\"></tr>");
		for(var j = 0; j < 8; j++) {
			$("#compShipsRow"+i).append("<td id = \"compBattleButton"+i+j+"\" class = \"squareButton\" onclick = \"battleButtonClicked(this.id)\"></td>");
		}
	}

	showPlayersShips();
}