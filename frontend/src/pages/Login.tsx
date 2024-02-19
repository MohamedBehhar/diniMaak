import { useState } from "react";
import { login } from "../api/methods";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e: any) => {
    e.preventDefault();

    // Check the username and password (you may want to replace this with actual authentication logic)
    await login({ username, password })
      .then((response: any) => {
        localStorage.setItem("token", response.accessToken);
        localStorage.setItem("refreshToken", response.refreshToken);
        localStorage.setItem("username", username);
      })
      .catch((error: any) => {
        setErrorMessage(error.response.data.message);
      });
  };

  return (
    <div className="bg-white text-black flex flex-col gap-10">
      <h2>Login</h2>
      <form
        onSubmit={handleLogin}
        className="flex flex-col gap-5 justify-center items-center"
      >
        <div className="bg-white">
          <label htmlFor="username">Username:</label>
          <input
            className="border-2 rounded p-3"
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            className="border-2 rounded p-3"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <button type="submit bg-green">Login</button>
        </div>
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      </form>
    </div>
  );
}

export default Login;
