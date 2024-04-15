import { getUsers } from "../api/methods";
import { useState } from "react";

function Home() {
  const signOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("username");
    window.location.href = "/login";
  };

  const [users, setUsers] = useState([]);
  const getUsersData = async () => {
    const response = await getUsers();
    setUsers(response);
    console.log(response);
  };
  return (
    <div className="flex justify-between">
      <h1>Home</h1>
      <button
        className="bg-blue-600 p-9"
        onClick={() => {
          getUsersData();
        }}
      >
        Get users
      </button>
      <ul>
        {users && users.map((user) => <li key={user.id}>{user.username}</li>)}
      </ul>
      <button className="bg-red-600 p-9" onClick={signOut}>
        Sign Out
      </button>
    </div>
  );
}

export default Home;
