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
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Username
              </label>
              <div className="mt-2">
                <input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
                <div className="text-sm">
                  <a
                    href="#"
                    className="font-semibold text-indigo-600 hover:text-indigo-500"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className=" mt-2 flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign in
              </button>
            </div>

            <p className="mt-10 text-center text-sm text-gray-500">
              Don't have an Account?
              <a
                href="/signup"
                className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
              >
                Sign Up
              </a>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Login;
