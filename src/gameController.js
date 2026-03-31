import { Player, Gameboard, Ship } from "./ship.js";

const human = new Player("human");
const computer = new Player("computer");

const shipsToPlace = [new Ship(2), new Ship(3)];
let currentShipIndex = 0;
let placingHorizontal = true;

const ship1 = new Ship(2);
const ship2 = new Ship(3);

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
const rotateButton = document.getElementById("rotate-button");

rotateButton.addEventListener("click", () => {
  placingHorizontal = !placingHorizontal;
  rotateButton.textContent = placingHorizontal
    ? "Rotate Ship (Horizontal)"
    : "Rotate Ship (Vertical)";
});

humanContainer.addEventListener("click", handlePlacement);

function handlePlacement(e) {
  if (currentShipIndex >= shipsToPlace.length) return;

  const square = e.target;
  if (!square.classList.contains("square")) return;

  const row = parseInt(square.dataset.row);
  const col = parseInt(square.dataset.col);

  const ship = shipsToPlace[currentShipIndex];

  // Calculate coords based on orientation
  const coordinates = [];
  for (let i = 0; i < ship.length; i++) {
    const r = row + (placingHorizontal ? 0 : i);
    const c = col + (placingHorizontal ? i : 0);

    if (r > 9 || c > 9) return; // Out of bounds
    coordinates.push([r, c]);
  }

  // Check for overlap with existing ships
  const overlap = human.gameboard.ships.some((s) =>
    s.coordinates.some((c) =>
      coordinates.some((coord) => coord[0] === c[0] && coord[1] === c[1]),
    ),
  );

  if (overlap) return; // Stop if overlapping

  // Place the ship
  human.gameboard.placeShip(ship, coordinates);

  // Rerender human baord to show ships
  renderBoard(human.gameboard, humanContainer, true);

  currentShipIndex++;

  if (currentShipIndex === shipsToPlace.length) {
    console.log("All ships placed! Ready to start the game");
  }
}

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

          const coordinate = [row, col];

          // Prevent double clicks
          const alreadyAttacked =
            computer.gameboard.hitAttacks.some(
              (c) => c[0] === row && c[1] === col,
            ) ||
            computer.gameboard.missedAttacks.some(
              (c) => c[0] === row && c[1] === col,
            );

          if (alreadyAttacked) return; // Stop if already clicked

          // Human attacks computer
          human.attack(computer.gameboard, [row, col]);

          renderBoard(human.gameboard, humanContainer, true);
          renderBoard(computer.gameboard, computerContainer);

          // Check if computer lost
          if (computer.gameboard.allShipsSunk()) {
            alert("You win!");
            return;
          }

          // Computer makes a random move:
          computer.makeRandomMove(human.gameboard);

          // Re-render human board again:
          renderBoard(human.gameboard, humanContainer, true);

          // Check if human lost:
          if (human.gameboard.allShipsSunk()) {
            alert("Computer wins!");
            return;
          }
        });
      }
    }
  }
}

renderBoard(human.gameboard, humanContainer, true);
renderBoard(computer.gameboard, computerContainer);
