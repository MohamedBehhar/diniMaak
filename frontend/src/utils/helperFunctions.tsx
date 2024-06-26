import { useDispatch } from "react-redux";

export const getAccessToken = () => {
  return localStorage.getItem("token");
};

export const getrefresh_token = () => {
  return localStorage.getItem("refresh_token");
};

export const signOut = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("username");
  localStorage.removeItem("id");
  window.location.href = "/login";
};

export const concatinatePictureUrl = (url: string) => {
  return `http://localhost:3000${url}`;
};
