

import axios from "axios";

const apiBaseURL = import.meta.env.VITE_BASE_URL;

const getHeaders = () => ({
  headers: {
    token: localStorage.getItem("token"),
  },
});

export const getPosts = async () => {
  const response = await axios.get(`${apiBaseURL}posts`, getHeaders());
  return response.data.data.posts;
};

export const updatePost = async ({ id, body, image }) => {
  const formData = new FormData();
  formData.append("body", body);
  if (image) formData.append("image", image);

  const response = await axios.put(`${apiBaseURL}posts/${id}`, formData, {
    headers: {
      token: localStorage.getItem("token"),
    },
  });
  return response.data;
};

export const deletePost = async (id) => {
  const response = await axios.delete(`${apiBaseURL}posts/${id}`, getHeaders());
  return response.data;
};