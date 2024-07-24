import { defineStore } from "pinia"

export const useCommoncodeStore = defineStore("commoncode", {
    state: () => ({
        boardNames: {
            1: "공지",
            2: "자유",
            3: "유머",
            4: "질문",
            5: "자랑",
            6: "후기",
        } as Record<number, string>,
    }),

    getters: {
        getBoardName:
            (state) =>
            (boardNumber: number): string | undefined => {
                return state.boardNames[boardNumber]
            },

        getBoardId:
            (state) =>
            (boardName: string): number | undefined => {
                const key = Object.keys(state.boardNames).find(
                    (key) => state.boardNames[Number(key)] === boardName
                )
                return key ? Number(key) : undefined
            },
    },
})
