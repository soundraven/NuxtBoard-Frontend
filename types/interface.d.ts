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
    userName?: string
}

interface PostInfo {
    id: number
    boardId: number
    boardName: string
    registeredBy: number
    registeredDate: Date
    formattedDate: Dayjs
    title: string
    content: string
    report: number
}

interface GroupedPost {
    [key: number]: Postinfo[]
}

interface LikeInfo {
    totalLike: number
    totalDislike: number
}

interface CommentInfo {
    id: number
    postId: number
    commentId?: number
    registeredBy: number
    userName: string
    content: string
    registeredDate: Date
    replies: CommentInfo[]
}

export type {
    UserInfo,
    ApiResponse,
    PostInfo,
    LikeInfo,
    CommentInfo,
    GroupedPost,
}
