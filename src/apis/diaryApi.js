import { instance } from "./config";

export const diaryApi = {
  createPost: async (title, content) => {
    let req = {
      title: title,
      content: content,
    };
    const data = await instance.post("/api/posts", req);
    return data;
  },

  getDiaryList: async () => {
    const data = await instance.get("/api/posts");
    return data.data;
  },

  getOneDiary: async (postId) => {
    const data = await instance.get(`/api/posts/${postId}`);
    return data.data;
  },

  deleteDiary: async (postId) => {
    const data = await instance.delete(`/api/posts/${postId}`);
    return data;
  },

  // getDetailDiary:
};
