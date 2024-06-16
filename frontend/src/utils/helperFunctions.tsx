
export const getAccessToken = () => {
    return localStorage.getItem("token");
  };

export const getRefreshToken = () => {
    return localStorage.getItem("refreshToken");
  };



export const signOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("username");
    localStorage.removeItem("id");
    window.location.href = "/login";
  };

export const concatinatePictureUrl = (url: string) => {
  return `http://localhost:3000${url}`
}