<template>
    <div
      class="board"
      :style="{
        gridTemplateColumns: `repeat(${board[0]?.length || 0}, var(--cell-size))`,
      }"
    >
      <div v-for="(row, r) in board" :key="r" class="board-row">
        <Cell
          v-for="(cell, c) in row"
          :key="`${r}-${c}`"
          :cell="cell"
          :is-flagged="flagged.has(`${r}-${c}`)"
          @click="() => onCellClick(r, c)"
          @right-click="() => toggleFlag(r, c)"
        ></Cell>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { defineProps } from "vue";
  import Cell from "./Cell.vue";
  import type { CellInfo } from "@/types/game";
  
  const props = defineProps<{
    board: CellInfo[][];
    flagged: Set<string>;
    onCellClick: (r: number, c: number) => void;
    toggleFlag: (r: number, c: number) => void;
  }>();
  </script>
  
  <style scoped>
  .board {
    display: grid;
    gap: var(--cell-gap);
    justify-content: center;
    grid-auto-rows: var(--cell-size);
  }
  .board-row {
    display: contents; /* Ensures proper grid formatting */
  }
  </style>