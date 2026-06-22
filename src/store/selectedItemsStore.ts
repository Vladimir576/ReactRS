'use client';

import { create } from 'zustand';
import type { Item } from '../types/types';

interface SelectedItemsState {
  selectedItems: Record<number, Item>;
  toggleSelectedItem: (item: Item) => void;
  clearSelectedItems: () => void;
}

export const useSelectedItemsStore = create<SelectedItemsState>((set) => ({
  selectedItems: {},
  toggleSelectedItem: (item) =>
    set((state) => {
      const newSelectedItems = { ...state.selectedItems };

      if (newSelectedItems[item.id]) {
        delete newSelectedItems[item.id];
      } else {
        newSelectedItems[item.id] = item;
      }

      return { selectedItems: newSelectedItems };
    }),
  clearSelectedItems: () => set({ selectedItems: {} }),
}));

export const selectItems = (state: SelectedItemsState) => state.selectedItems;

export const selectToggleItem = (state: SelectedItemsState) =>
  state.toggleSelectedItem;

export const selectClearItems = (state: SelectedItemsState) =>
  state.clearSelectedItems;
