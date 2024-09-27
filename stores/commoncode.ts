import { defineStore } from "pinia";
import type { BoardInfo } from "~/types/interface";

interface State {
  boards: BoardInfo[];
}

export const useCommoncodeStore = defineStore<
  string,
  State,
  {},
  { getBoards(): Promise<void> }
>("commoncode", {
  state: (): State => ({
    boards: [],
  }),

  actions: {
    async getBoards(): Promise<void> {
      if (this.boards.length === 0) {
        const { $apiGet } = useNuxtApp();

        const response = await $apiGet<{ boardInfo: BoardInfo[] }>(
          "/posts/boardInfo"
        );

        if (response.data?.boardInfo) {
          this.boards = response.data.boardInfo;
        }
      }
    },
  },
});
