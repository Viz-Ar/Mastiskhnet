import axiosInstance from "./axios";

export async function getChatHistory(user1, user2) {
  const response = await axiosInstance.get(
    `/chat/history/${user1}/${user2}`
  );

  return response.data;
}