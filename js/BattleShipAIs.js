compFleet = new Fleet("You");
compFleet.addShip(new Ship("Carrier", 5, getLocationsOfShip(1, 2, 5, 2)));
console.log(compFleet.isAValidPlacement(getLocationsOfShip(3, 0, 3, 4)));