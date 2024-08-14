import { defineStore } from "pinia"

interface BoardInfo {
    boardId: number
    boardName: string
}

export const useCommoncodeStore = defineStore("commoncode", {
    state: () => ({
        boards: [] as BoardInfo[],
    }),

    getters: {
        getBoardName:
            (state) =>
            (boardId: number): string | undefined => {
                const board = state.boards.find(
                    (board) => board.boardId === boardId
                )
                return board ? board.boardName : undefined
            },

        getBoardId:
            (state) =>
            (boardName: string): number | undefined => {
                const board = state.boards.find(
                    (board) => board.boardName === boardName
                )
                return board ? board.boardId : undefined
            },
    },

    actions: {
        async getBoards() {
            try {
                const { $axios } = useNuxtApp()
                const response = await $axios.get("/posts/boardInfo")
                console.log(response.data)
                this.boards = response.data.boardInfo
                console.log(this.boards)
            } catch (error) {
                console.error("Failed to get boards:", error)
                ElMessage.error("Failed to get board information.")
            }
        },
    },
})
