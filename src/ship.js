export class Ship {
  constructor(length) {
    this.length = length;
    this.hits = 0;
  }

  hit() {
    this.hits += 1;
  }

  isSunk() {
    return this.hits >= this.length; // returns true/false
  }
}

class Gameboard {
  constructor() {
    this.ships = [];
    this.missedAttacks = [];
  }

  placeShip(ship, coordinates) {
    this.ships.push({
      ship: ship,
      coordinates: coordinates,
    });
  }

  receiveAttack(coordinate) {
    let hit = false; // Track whether we hit a ship

    for (let shipObj of this.ships) {
      if (
        shipObj.coordinates.some(
          (coord) => coord[0] === coordinate[0] && coord[1] === coordinate[1],
        )
      ) {
        shipObj.ship.hit();
        hit = true;
        break;
      }
    }

    if (!hit) {
      this.missedAttacks.push(coordinate);
    }
  }

  allShipsSunk() {
    return this.ships.every((shipObj) => shipObj.ship.isSunk());
  }
}

export { Gameboard };
