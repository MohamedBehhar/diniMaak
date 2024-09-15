import { useState } from "react";
import { login } from "../api/methods";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserInfo } from "../store/user/userSlice";
import { FaCarSide } from "react-icons/fa";
import Logo from "../assets/logo.png";

function Login() {
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleLogin = async (e: any) => {
    e.preventDefault();
    await login({ username, password })
      .then((response: any) => {
        dispatch(setUserInfo(response));
        localStorage.setItem("token", response.accessToken);
        localStorage.setItem("refresh_token", response.refresh_token);
        localStorage.setItem("id", response.id);
        navigate(from, { replace: true }); // Navigate back to the original route
      })
      .catch((error: any) => {
        setErrorMessage(error.response.data.error);
        console.log(error.response.data.error);
      });
  };

  return (
    <div className="min-h-screen ">
      <form
        onSubmit={handleLogin}
        className="flex flex-col gap-5 justify-center items-center"
      >
        {
          // Show an error message if the login fails
          errorMessage && (
            <div
              className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4
                absolute top-0 left-0 right-0 z-10 mx-auto w-1/2 mt-4 rounded-md
                shadow-lg text-center animate-bounce
              "
              role="alert"
            >
              <p>{errorMessage}</p>
            </div>
          )
        }
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img
              className="mx-auto h-80 w-auto"
              src={Logo}
              alt="Your Company"
              onError={(e: any) => {
                e.target.onerror = null;
                e.target.src = Logo;
              }}
            />
          </div>

          <div className=" sm:mx-auto sm:w-full sm:max-w-sm">
            <div>
              <div className="mt-4">
                <input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6 p-2"
                  placeholder="Username"
                />
              </div>
            </div>

            <div className="mt-4">
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6"
              />
              <div className="text-sm flex justify-end mt-2">
                <a
                  href="#"
                  className="font-semibold text-cyan-700 hover:text-cyan-600"
                >
                  Forgot password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className=" mt-4 flex w-full justify-center rounded-md ant-btn px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm  focus-visible:outline-offset-2 "
              >
                Sign in
              </button>
            </div>

            <p className="mt-10 text-center text-sm text-gray-500">
              Don't have an Account? &nbsp;
              <button
                onClick={() => navigate("/signup")}
                className="hover:underline font-semibold leading-6 text-cyan-700 hover:text-cyan-600"
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Login;
