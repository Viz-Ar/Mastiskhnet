import axiosInstance from "./axios";

export async function deleteReport(id) {
  const response = await axiosInstance.delete(
    `/mri/${id}`
  );

  return response.data;
}