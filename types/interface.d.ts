interface ApiResponse {
    code: string
    message: string
    errorCode?: string
    user?: Userinfo
    token?: string
}

interface Userinfo {
    email: string
    password?: string
    id?: number
    username?: string
}

interface Postinfo {
    id: number
    board_id: number
    board_name: string
    registered_by: number //추후 Left join 활용해서 string으로 변경
    registered_date: Date
    title: string
    content: string
}

enum BoardId {
    공지 = 1,
    자유 = 2,
    유머 = 3,
    질문 = 4,
    자랑 = 5,
    후기 = 6,
}

export type { Userinfo, ApiResponse, Postinfo }
export { BoardId }
