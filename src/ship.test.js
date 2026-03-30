import { Ship } from "../src/ship.js";
import { Gameboard } from "../src/ship.js";

describe("Ship class", () => {
  test("hit() increments the hits counter", () => {
    const ship = new Ship(3);
    expect(ship.hits).toBe(0);
    ship.hit();
    expect(ship.hits).toBe(1);
  });

  test("isSunk() returns false when the number of hits is less than its length", () => {
    const ship = new Ship(3);
    expect(ship.isSunk()).toBe(false);
  });

  test("isSunk returns true when the number of hits is greater than or equal to its length", () => {
    const ship = new Ship(3);
    ship.hit();
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBe(true);
  });
});

describe("Gameboard", () => {
  test("places a ship on the board", () => {
    const board = new Gameboard();
    const ship = new Ship(2);

    board.placeShip(ship, [
      [0, 0],
      [0, 1],
    ]);

    expect(board.ships.length).toBe(1);
    expect(board.ships[0].coordinates).toEqual([
      [0, 0],
      [0, 1],
    ]);
    expect(board.ships[0].ship).toBe(ship);
  });
});
