import { signUp } from "../api/methods";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { setUserInfo } from "../store/user/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

function CreateAccount() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const schema = z.object({
    username: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
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
    await signUp({ username, email, password, phone_number })
      .then((response: any) => {
        console.log("0-0-0-0-0-0-0- ", response);
        dispatch(setUserInfo(response));
        localStorage.setItem("token", response.token);
        localStorage.setItem("refresh_token", response.refresh_token);
        localStorage.setItem("id", response.id);
        alert("Account created successfully: " + from);
        // if (from === "/signup") navigate("/");
        // else
         navigate(from, { replace: true });
      })
      .catch((error: any) => {
        console.log(error.response);
        if (error.response) {
          const key = error.response.data.error.key;
          const message = error.response.data.error.message;
          setError(key, { message: message });
        }
      });
  };

  const errorClass: string = "text-red-500 text-sm font-semibold";

  return (
    <div>
      <form
        onSubmit={handleSubmit(onsubmit)}
        className="flex flex-col gap-5 justify-center items-center min-h-screen"
      >
        <div className="flex min-h-full w-full max-w-[600px] flex-col justify-center px-6 py-12 lg:px-8 ">
          <div className="mt-10 flex flex-col gap-4 sm:mx-auto sm:w-full ">
            <div>
              <label htmlFor="username">Username</label>
              <input
                id="username"
                {...register("username")}
                className="w-full border border-gray-400 rounded p-2"
              />
              {errors.username && (
                <p className={errorClass}>{errors.username.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                {...register("email")}
                className="w-full border border-gray-400 rounded p-2"
              />
              {errors.email && (
                <p className={errorClass}>{errors.email.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="phone_number">Phone number</label>
              <input
                id="phone_number"
                {...register("phone_number")}
                className="w-full border border-gray-400 rounded p-2"
              />
              {errors.phone_number && (
                <p className={errorClass}>{errors.phone_number.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                {...register("password")}
                className="w-full border border-gray-400 rounded p-2"
              />
              {errors.password && (
                <p className={errorClass}>{errors.password.message}</p>
              )}
            </div>
            {errors.root && <p className={errorClass}>{errors.root.message}</p>}

            <div>
              <button
                type="submit"
                className="mt-5  flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {isSubmitting ? "Creating account..." : "Create account"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default CreateAccount;
