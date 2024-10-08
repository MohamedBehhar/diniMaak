import { signUp } from "../api/methods";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { setUserInfo } from "../store/user/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Logo from "../assets/logo.png";
import SignInSvg from "../assets/signin.svg";

function CreateAccount() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const schema = z.object({
    username: z.string().min(2, "Username must have at least 2 characters"),
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(6, "Password must have at least 6 characters"),
    phone_number: z.string().optional(),
  });

  type Inputs = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
  });

  const dispatch = useDispatch();

  const onsubmit: SubmitHandler<Inputs> = async (data) => {
    const { username, email, password, phone_number } = data;
    try {
      const response = await signUp({
        username,
        email,
        password,
        phone_number,
      });
      console.log("Response: ", response);
      dispatch(setUserInfo(response));
      localStorage.setItem("token", response.token);
      localStorage.setItem("refresh_token", response.refresh_token);
      localStorage.setItem("id", response.id);
      navigate(from, { replace: true });
    } catch (error: any) {
      if (error.response && error.response.data?.error) {
        const { key, message } = error.response.data.error;
        setError(key, { message });
      }
    }
  };

  const errorClass: string = "text-red-500 text-sm font-semibold";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 p-4">
      <h2 className="mt-6 text-center text-xl sm:text-3xl font-extrabold text-cyan-800 capitalize">
        Create your account
      </h2>

      <div className="w-full max-w-[800px] flex flex-col md:flex-row justify-center items-center text-center gap-4">
        <div className="md:flex-1 max-w-[300px] md:max-w-full">
          <img
            className=" flex-1 flex-shrink"
            src={SignInSvg}
            alt="Your Company"
            onError={(e: any) => {
              e.target.onerror = null;
              e.target.src = Logo;
            }}
          />
        </div>
        <form
          onSubmit={handleSubmit(onsubmit)}
          className="space-y-6  w-full sm:w-[500px] md:flex-1 "
        >
          <div className=" flex flex-col gap-4">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                {...register("username")}
                className="relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Username"
              />
              {errors.username && (
                <p className={errorClass} aria-live="polite">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                {...register("email")}
                className="relative block w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md "
                placeholder="Email"
              />
              {errors.email && (
                <p className={errorClass} aria-live="polite">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="phone_number" className="sr-only">
                Phone Number
              </label>
              <input
                id="phone_number"
                {...register("phone_number")}
                className=" rounded-md  relative block w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Phone Number (optional)"
              />
              {errors.phone_number && (
                <p className={errorClass} aria-live="polite">
                  {errors.phone_number.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                type="password"
                {...register("password")}
                className="relative rounded-md  block w-full px-3 py-2 border border-gray-300 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Password"
              />
              {errors.password && (
                <p className={errorClass} aria-live="polite">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="ant-btn max-w-[200px] mx-auto group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white  focus:outline-none focus:ring-2 focus:ring-offset-2 "
            >
              {isSubmitting ? "Creating account..." : "Create account"}
            </button>
          </div>
        </form>
      </div>
      <div className="text-sm text-gray-600">
        Already have an account?{" "}
        <button
          onClick={() => navigate("/login")}
          className="text-cyan-700 hover:underline font-semibold cursor-pointer"
        >
          Login
        </button>
      </div>
    </div>
  );
}

export default CreateAccount;
