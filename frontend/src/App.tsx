import Login from "./pages/Login";
import { getUsers } from "./api/methods";
import { useState } from "react";

function App() {
  const [token, setToken] = useState("");
  const getUsersData = async () => {
    setToken(localStorage.getItem("token") || "");
    await getUsers()
      .then((response: any) => {
        console.log(response);
      })
      .catch((error: any) => {
        console.log(error);
      });
  };
  return (
    <div className="">
      <h1 class="text-3xl font-bold underline text-center">Hello world!</h1>
      <Login />
      {token && <p class="text-bold break-words">{token}</p>}
      <button onClick={getUsersData}>get users</button>
    </div>
  );
}

export default App;
