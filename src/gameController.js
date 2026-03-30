import { Player, Gameboard, Ship } from "./ship.js";

const human = new Player("human");
const computer = new Player("computer");

const ship1 = new Ship(2);
const ship2 = new Ship(3);

human.gameboard.placeShip(ship1, [
  [0, 0],
  [0, 1],
]);
human.gameboard.placeShip(ship2, [
  [1, 0],
  [1, 1],
  [1, 2],
]);

computer.gameboard.placeShip(ship1, [
  [2, 2],
  [2, 3],
]);
computer.gameboard.placeShip(ship2, [
  [3, 2],
  [3, 3],
  [3, 4],
]);

const humanContainer = document.getElementById("human-board");
const computerContainer = document.getElementById("computer-board");
function renderBoard(board, container, showShips = false) {
  container.innerHTML = "";

  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      const square = document.createElement("div");
      square.classList.add("square");

      square.dataset.row = row;
      square.dataset.col = col;

      if (board.hitAttacks.some((c) => c[0] === row && c[1] === col)) {
        square.classList.add("hit");
      } else if (
        board.missedAttacks.some((c) => c[0] === row && c[1] === col)
      ) {
        square.classList.add("miss");
      }

      if (
        showShips &&
        board.ships.some((ship) =>
          ship.coordinates.some((c) => c[0] === row && c[1] === col),
        )
      ) {
        square.classList.add("ship");
      }

      container.appendChild(square);

      if (container === computerContainer) {
        square.addEventListener("click", () => {
          const row = parseInt(square.dataset.row); // dataset values are strings, so we convert them to numbers using parseInt
          const col = parseInt(square.dataset.col);

          human.attack(computer.gameboard, [row, col]);

          renderBoard(human.gameboard, humanContainer, true);
          renderBoard(computer.gameboard, computerContainer);
        });
      }
    }
  }
}

renderBoard(human.gameboard, humanContainer, true);
renderBoard(computer.gameboard, computerContainer);
