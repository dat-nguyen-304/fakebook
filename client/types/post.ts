export interface IComment {
  id: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  createdAt: string; // relative label for static UI, e.g. "2h"
  likes: number;
  isLiked?: boolean;
  replies?: IComment[];
}

export interface IPost {
  id: string;
  authorName: string;
  authorAvatar: string;
  createdAt: string; // relative label for static UI, e.g. "12m"
  content: string;
  image?: string;
  likes: number;
  isLiked?: boolean;
  shares: number;
  comments: IComment[];
}
