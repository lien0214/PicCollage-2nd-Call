<template>
  <div class="app-shell">
    <div class="timer-box">
      ⏱ {{ formatTime(time) }}<br />
      Safe cell: {{ safeCellsLeft }}
    </div>

    <div class="panel">
      <h1>Minesweeper</h1>

      <div class="controls">
        <label>
          Rows
          <input type="number" v-model.number="rows" min="1" />
        </label>

        <label>
          Columns
          <input type="number" v-model.number="cols" min="1" />
        </label>

        <label>
          Bombs
          <input type="number" v-model.number="bombs" :max="rows * cols - 1" min="1" />
        </label>

        <button class="primary" @click="startNewGame">Start Game</button>
      </div>

      <div class="error" v-if="error">{{ error }}</div>

      <div v-if="board.length > 0">
        <Board
          :board="board"
          :flagged="flagged"
          :onCellClick="onCellClick"
          :toggleFlag="toggleFlag"
        />
      </div>
    </div>

    <div v-if="status !== 'playing'" class="overlay" @click.self="status = 'playing'">
      <div class="overlay-message">
        <h2>{{ status === 'won' ? '🎉 You Won!' : '💥 Game Over' }}</h2>
        <p>⏱ Time: {{ formatTime(time) }}</p>
        <p>🚩 Flags used: {{ flagged.size }}</p>
        <p>✅ Revealed: {{ revealedCells }} / {{ totalSafeCells }}</p>
        <button class="primary" @click="startNewGame">🔄 Restart Game</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted, computed } from "vue";
import Board from "@/components/Board.vue";
import { startGame, reveal } from "@/api/index";
import type { CellInfo, GameStatus } from "@/types/game";

const rows = ref(10);
const cols = ref(10);
const bombs = ref(10);
const board = ref<CellInfo[][]>([]);
const flagged = ref<Set<string>>(new Set());
const gameId = ref("");
const status = ref<GameStatus>("playing");
const error = ref("");
const safeCellsLeft = ref(0);
const time = ref(0);
const timerRunning = ref(false);

const totalSafeCells = computed(() => rows.value * cols.value - bombs.value);
const revealedCells = computed(() => totalSafeCells.value - safeCellsLeft.value);

let interval: any;

watch([timerRunning, status], () => {
  clearInterval(interval);
  if (timerRunning.value && status.value === "playing") {
    interval = setInterval(() => time.value++, 1000);
  }
});

function formatTime(seconds: number) {
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

async function startNewGame() {
  error.value = "";
  if (rows.value < 1 || cols.value < 1) {
    error.value = "Rows and columns must be at least 1.";
    return;
  }
  if (bombs.value < 1 || bombs.value >= rows.value * cols.value) {
    error.value = "Bombs must be between 1 and total cells - 1.";
    return;
  }
  const res = await startGame(rows.value, cols.value, bombs.value, gameId.value);
  gameId.value = res.id;
  board.value = generateEmptyBoard(rows.value, cols.value);
  status.value = "playing";
  flagged.value = new Set();
  safeCellsLeft.value = rows.value * cols.value - bombs.value;
  time.value = 0;
  timerRunning.value = true;
}

async function onCellClick(r: number, c: number) {
  if (status.value !== "playing") return; // Ensure the game is in the "playing" state
  if (flagged.value.has(`${r}-${c}`)) return; // Ignore clicks on flagged cells

  try {
    const res = await reveal(gameId.value, r, c); // Call the reveal API
    console.log("Reveal response:", res);

    // Update the board with revealed cells
    board.value = board.value.map((row, rowIndex) =>
      row.map((cell, colIndex) => {
        const revealedCell = res.revealedCell.find(
          ({ position }) => position[0] === rowIndex && position[1] === colIndex
        );
        return revealedCell ? revealedCell.cell : cell;
      })
    );

    // Update game status and remaining safe cells
    status.value = res.status;
    safeCellsLeft.value = res.safeCellsLeft;
  } catch (error) {
    console.error("Error revealing cell:", error);
  }
}

function toggleFlag(r: number, c: number) {
  const key = `${r}-${c}`;
  if (flagged.value.has(key)) {
    flagged.value.delete(key);
  } else {
    flagged.value.add(key);
  }
  flagged.value = new Set(flagged.value);
}

function generateEmptyBoard(rows: number, cols: number): CellInfo[][] {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({ revealed: false, bomb: false, adjacent: 0 }))
  );
}
</script>

<style scoped>
</style>
