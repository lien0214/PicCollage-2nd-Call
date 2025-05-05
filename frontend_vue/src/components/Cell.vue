<template>
    <div
      class="cell"
      :class="[baseClass, isFlagged ? 'flag' : '']"
      @click="handleClick"
      @contextmenu.prevent="handleRightClick"
    >
      <template v-if="cell.revealed">
        <span v-if="cell.bomb">💣</span>
        <span v-else-if="cell.adjacent > 0">{{ cell.adjacent }}</span>
      </template>
      <template v-else>
        <span v-if="isFlagged">🚩</span>
      </template>
    </div>
  </template>
  
  <script setup lang="ts">
  import type { CellInfo } from '@/types/game';
  import { computed } from 'vue';
  
  const props = defineProps<{
    cell: CellInfo;
    isFlagged: boolean;
  }>();
  
  const emit = defineEmits(['click', 'right-click']);
  
  const handleClick = () => {
    if (!props.cell.revealed) emit('click');
  };
  
  const handleRightClick = () => {
    emit('right-click');
  };
  
  const baseClass = computed(() => {
    if (!props.cell.revealed) return 'unrevealed';
    return props.cell.bomb ? 'bomb' : 'revealed';
  });
  </script>
  
  <style scoped>
  .cell {
    width: var(--cell-size);
    height: var(--cell-size);
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
    font-weight: 700;
    font-size: 1rem;
    text-align: center;
    border-radius: 0.4rem;
    border: 1px solid #ffffff;
    transition: background 0.12s, filter 0.12s;
  }
  </style>  