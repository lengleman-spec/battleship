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

export class Gameboard {
  constructor() {
    this.ships = [];
    this.missedAttacks = [];
    this.hitAttacks = [];
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
        this.hitAttacks.push(coordinate);
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

export class Player {
  constructor(type) {
    this.type = type; // human or computer
    this.gameboard = new Gameboard(); // each player gets their own gameboard
    this.moves = []; // an array to track coordinates this player has already attacked
  }

  attack(opponentBoard, coordinate) {
    if (
      this.moves.some((c) => c[0] === coordinate[0] && c[1] === coordinate[1])
    ) {
      return;
    }
    this.moves.push(coordinate);
    opponentBoard.receiveAttack(coordinate);
  }

  makeRandomMove(opponentBoard) {
    let row, col, coordinate;
    do {
      row = Math.floor(Math.random() * 10);
      col = Math.floor(Math.random() * 10);
      coordinate = [row, col];
    } while (this.moves.some((c) => c[0] === row && c[1] === col));

    this.attack(opponentBoard, coordinate);
  }
}
