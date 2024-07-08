interface ApiResponse {
    code: string
    message: string
    errorCode?: string
    data?: any
}

interface Userinfo {
    email: string
    password: string
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

export type { Userinfo, ApiResponse, Postinfo }
