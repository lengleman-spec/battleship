import { Player, Gameboard, Ship } from "./ship.js";

// 1️⃣ Create players
const human = new Player("human");
const computer = new Player("computer");

// 2️⃣ Ships the human must place
const shipsToPlace = [new Ship(2), new Ship(3)];
let currentShipIndex = 0;
let placingHorizontal = true; // rotation state

// 3️⃣ Place computer ships
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

// 4️⃣ Grab DOM containers
const humanContainer = document.getElementById("human-board");
const computerContainer = document.getElementById("computer-board");
const rotateButton = document.getElementById("rotate-button");

// 5️⃣ Rotation button
rotateButton.addEventListener("click", () => {
  placingHorizontal = !placingHorizontal;
  rotateButton.textContent = placingHorizontal
    ? "Rotate Ship (Horizontal)"
    : "Rotate Ship (Vertical)";
});

// 6️⃣ Handle human ship placement
humanContainer.addEventListener("click", handlePlacement);
humanContainer.addEventListener("mouseover", handleHover);
humanContainer.addEventListener("mouseout", handleHoverOut);

function handlePlacement(e) {
  if (currentShipIndex >= shipsToPlace.length) return; // all ships placed

  const square = e.target;
  if (!square.classList.contains("square")) return;

  const row = parseInt(square.dataset.row);
  const col = parseInt(square.dataset.col);
  const ship = shipsToPlace[currentShipIndex];

  // Calculate coordinates
  const coordinates = [];
  for (let i = 0; i < ship.length; i++) {
    const r = row + (placingHorizontal ? 0 : i);
    const c = col + (placingHorizontal ? i : 0);
    if (r > 9 || c > 9) return; // out of bounds
    coordinates.push([r, c]);
  }

  // Prevent overlap
  const overlap = human.gameboard.ships.some((s) =>
    s.coordinates.some((c) =>
      coordinates.some((coord) => coord[0] === c[0] && coord[1] === c[1]),
    ),
  );
  if (overlap) return;

  // Place the ship
  human.gameboard.placeShip(ship, coordinates);

  // Re-render human board showing ships
  renderBoard(human.gameboard, humanContainer, true);

  currentShipIndex++;

  if (currentShipIndex === shipsToPlace.length) {
    console.log("All ships placed! Ready to start the game.");
  }
}

// 7️⃣ Hover preview functions
function handleHover(e) {
  const square = e.target;
  if (!square.classList.contains("square")) return;
  if (currentShipIndex >= shipsToPlace.length) return;

  const row = parseInt(square.dataset.row);
  const col = parseInt(square.dataset.col);
  const ship = shipsToPlace[currentShipIndex];

  const coordinates = [];
  for (let i = 0; i < ship.length; i++) {
    const r = row + (placingHorizontal ? 0 : i);
    const c = col + (placingHorizontal ? i : 0);
    if (r > 9 || c > 9) return;
    coordinates.push([r, c]);
  }

  // Check for overlap
  const overlap = human.gameboard.ships.some((s) =>
    s.coordinates.some((c) =>
      coordinates.some((coord) => coord[0] === c[0] && coord[1] === c[1]),
    ),
  );

  // Add hover class
  coordinates.forEach(([r, c]) => {
    const sq = humanContainer.querySelector(
      `[data-row='${r}'][data-col='${c}']`,
    );
    if (!sq) return;
    sq.classList.add(overlap ? "hover-invalid" : "hover-valid");
  });
}

function handleHoverOut(e) {
  const squares = humanContainer.querySelectorAll(
    ".hover-valid, .hover-invalid",
  );
  squares.forEach((sq) => sq.classList.remove("hover-valid", "hover-invalid"));
}

// 8️⃣ Render boards
function renderBoard(board, container, showShips = false) {
  container.innerHTML = "";

  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      const square = document.createElement("div");
      square.classList.add("square");

      square.dataset.row = row;
      square.dataset.col = col;

      // hits/misses
      if (board.hitAttacks.some((c) => c[0] === row && c[1] === col)) {
        square.classList.add("hit");
      } else if (
        board.missedAttacks.some((c) => c[0] === row && c[1] === col)
      ) {
        square.classList.add("miss");
      }

      // ships (only if showShips = true)
      if (
        showShips &&
        board.ships.some((ship) =>
          ship.coordinates.some((c) => c[0] === row && c[1] === col),
        )
      ) {
        square.classList.add("ship");
      }

      container.appendChild(square);

      // Computer board clicks (attack)
      if (container === computerContainer) {
        square.addEventListener("click", () => {
          const row = parseInt(square.dataset.row);
          const col = parseInt(square.dataset.col);

          const alreadyAttacked =
            computer.gameboard.hitAttacks.some(
              (c) => c[0] === row && c[1] === col,
            ) ||
            computer.gameboard.missedAttacks.some(
              (c) => c[0] === row && c[1] === col,
            );

          if (alreadyAttacked) return;

          // Human attacks computer
          human.attack(computer.gameboard, [row, col]);
          renderBoard(human.gameboard, humanContainer, true);
          renderBoard(computer.gameboard, computerContainer);

          if (computer.gameboard.allShipsSunk()) {
            alert("You win!");
            return;
          }

          // Computer random move
          computer.makeRandomMove(human.gameboard);
          renderBoard(human.gameboard, humanContainer, true);

          if (human.gameboard.allShipsSunk()) {
            alert("Computer wins!");
            return;
          }
        });
      }
    }
  }
}

// Initial render
renderBoard(human.gameboard, humanContainer, true);
renderBoard(computer.gameboard, computerContainer);
