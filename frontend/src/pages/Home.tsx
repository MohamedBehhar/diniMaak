import { getUsers } from "../api/methods";
import { useState, useEffect } from "react";
import PostCarpooling from "../components/PostCarpooling";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import SearchForCarPooling from "../components/SearchForCarPooling";
import { Link } from "react-router-dom";
import { socket } from "../socket/socket";

function Home() {
  const signOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("username");
    window.location.href = "/login";
  };

  const [users, setUsers] = useState([]);
  const user = useSelector((state: RootState) => state.user.user);
  const getUsersData = async () => {
    const response = await getUsers();
    setUsers(response);
    console.log(response);
  };
  return (
    <>
      <header>
        <button
          className="bg-red-600 p-2 rounded-md text-white absolute w-1/4 mx-auto m-1 right-1"
          onClick={signOut}
        >
          Sign Out
        </button>
        <Link to="/post-carpooling">
          <button className="bg-green-600 p-2 rounded-md text-white absolute w-1/4 mx-auto m-1">
            Post Carpooling
          </button>
        </Link>
      </header>
      <div className=" flex flex-col ">
        <h1 className="text-center text-2xl font-bold p-6">Home</h1>
        {user && (
          <h1 className="text-center text-2xl font-bold p-6">
            Welcome {user == null ? "null" : "not null"}
          </h1>
        )}
        <button
          className="bg-blue-600 p-2 rounded-md text-white w-1/4 mx-auto m-5"
          onClick={() => {
            getUsersData();
          }}
        >
          Get users
        </button>
        <ul>
          {users &&
            users.map((user: { id: any; username: any }) => (
              <li key={user.id}>{user.username}</li>
            ))}
        </ul>

        <SearchForCarPooling />
      </div>
    </>
  );
}

export default Home;
