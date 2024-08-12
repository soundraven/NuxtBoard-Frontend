import type { Dayjs } from "dayjs"

interface ApiResponse {
    code: string
    message: string
    errorCode?: string
    user?: Userinfo
    token?: string
}

interface UserInfo {
    email: string
    password?: string
    id?: number
    username?: string
}

interface PostInfo {
    id: number
    board_id: number
    board_name: string
    registered_by: number
    registered_date: Date
    formatted_date: Dayjs
    title: string
    content: string
    report: number
}

interface GroupedPost {
    [key: number]: Postinfo[]
}

interface LikeInfo {
    total_likes: number
    total_dislikes: number
}

interface CommentInfo {
    id: number
    post_id: number
    comment_id?: number
    registered_by: number
    username: string
    content: string
    registered_date: Date
    replies: CommentInfo[]
}

enum BoardId {
    공지 = 1,
    자유 = 2,
    유머 = 3,
    질문 = 4,
    자랑 = 5,
    후기 = 6,
}

export type {
    UserInfo,
    ApiResponse,
    PostInfo,
    LikeInfo,
    CommentInfo,
    GroupedPost,
}
export { BoardId }
