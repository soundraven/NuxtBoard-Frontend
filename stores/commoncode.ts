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
        try {
          const { $apiGet } = useNuxtApp();
          const response = await $apiGet<{ boardInfo: BoardInfo[] }>(
            "/posts/boardInfo"
          );
          console.log(response.data?.boardInfo);
          if (response.data?.boardInfo) {
            this.boards = response.data.boardInfo;
          }
        } catch (error: any) {
          errorHandler(error);
        }
      }
    },
  },
});
