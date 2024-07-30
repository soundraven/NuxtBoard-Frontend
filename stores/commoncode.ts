import { defineStore } from "pinia"

interface Board {
    id: number
    name: string
}

export const useCommoncodeStore = defineStore("commoncode", {
    state: () => ({
        boards: [
            { id: 1, name: "공지" },
            { id: 2, name: "자유" },
            { id: 3, name: "유머" },
            { id: 4, name: "질문" },
            { id: 5, name: "자랑" },
            { id: 6, name: "후기" },
        ] as Board[],
    }),

    getters: {
        getBoardName:
            (state) =>
            (boardId: number): string | undefined => {
                const board = state.boards.find((board) => board.id === boardId)
                return board ? board.name : undefined
            },

        getBoardId:
            (state) =>
            (boardName: string): number | undefined => {
                const board = state.boards.find(
                    (board) => board.name === boardName
                )
                return board ? board.id : undefined
            },
    },
})
