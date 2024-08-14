import { defineStore } from "pinia"
import { type AxiosResponse } from "axios"

interface BoardInfo {
    boardId: number
    boardName: string
}

interface State {
    boards: BoardInfo[]
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
                    const { $axios } = useNuxtApp()
                    const response: AxiosResponse = await $axios.get(
                        "/posts/boardInfo"
                    )
                    console.log(response.data.boardInfo)
                    this.boards = response.data.boardInfo
                } catch (error: any) {
                    errorHandler(error)
                }
            }
        },
    },
})
