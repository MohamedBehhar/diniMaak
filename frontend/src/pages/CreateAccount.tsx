import { signUp } from "../api/methods";
import { useForm, SubmitHandler } from "react-hook-form";
import TextField from "@mui/material/TextField";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

function CreateAccount() {
  const schema = z.object({
    username: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
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

  const onsubmit: SubmitHandler<Inputs> = async (data) => {
    console.log(data);
    const { username, email, password } = data;
    await signUp({ username, email, password })
      .then((response: any) => {
        localStorage.setItem("token", response.token);
        localStorage.setItem("refreshToken", response.refreshToken);
        localStorage.setItem("username", response.username);
        localStorage.setItem("id", response.id);
        window.location.href = "/";
      })
      .catch((error: any) => {
        console.log(error.response.data);
        if (error.response) {
          const key = error.response.data.error.key;
          const message = error.response.data.error.message;
          setError(key, { message: message });
        }
      });
  };

  const errorClass: string = "text-red-500 text-sm font-semibold";

  return (
    <form
      onSubmit={handleSubmit(onsubmit)}
      className="flex flex-col gap-5 justify-center items-center"
    >
      <div className="flex min-h-full w-full max-w-[600px] flex-col justify-center px-6 py-12 lg:px-8 ">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm  ">
          <img
            className="mx-auto h-10 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Creat an account
          </h2>
        </div>

        <div className="mt-10 flex flex-col gap-4 sm:mx-auto sm:w-full ">
          <div>
            <TextField
              id="username"
              label="Username"
              {...register("username")}
              className="w-full"
            />
            {errors.username && (
              <p className={errorClass}>{errors.username.message}</p>
            )}
          </div>
          <div>
            <TextField
              id="email"
              label="email"
              {...register("email")}
              className="w-full"
            />
            {errors.email && (
              <p className={errorClass}>{errors.email.message}</p>
            )}
          </div>
          <div>
            <TextField
              id="password"
              type="password"
              label="password"
              {...register("password")}
              className="w-full"
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
  );
}

export default CreateAccount;
