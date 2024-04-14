import React from "react";

function Home() {
  const signOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("username");
    window.location.href = "/login";
  };
  return (
    <div class="flex justify-between">
      <h1>Home</h1>
      <button class="bg-red-600 p-9" onClick={signOut}>
        Sign Out
      </button>
    </div>
  );
}

export default Home;
