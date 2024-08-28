import type { Dayjs } from "dayjs";

interface GeneralServerResponse<T = undefined> {
  success: boolean;
  message: string;
  data?: T;
}

interface UserInfo {
  email: string;
  password?: string;
  id?: number;
  userName?: string;
}

interface BoardInfo {
  boardId: number;
  boardName: string;
}

interface PostInfo {
  id: number;
  boardId: number;
  boardName: string;
  registeredBy: number;
  registeredDate: Dayjs;
  formattedDate: Dayjs;
  title: string;
  content: string;
  report: number;
  registeredByUserName: string;
  active: number;
}

interface GroupedPost {
  [key: number]: PostInfo[];
}

interface LikeInfo {
  totalLikes: number;
  totalDislikes: number;
}

interface CommentInfo {
  id: number;
  postId: number;
  commentId?: number;
  registeredBy: number;
  userName: string;
  content: string;
  registeredDate: Dayjs;
  replies: CommentInfo[];
  formattedDate: Dayjs;
}

export type {
  UserInfo,
  BoardInfo,
  PostInfo,
  LikeInfo,
  CommentInfo,
  GroupedPost,
  GeneralServerResponse,
};
