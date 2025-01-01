import { useState } from "react";
import { useForm } from "react-hook-form";
import useAuth from "../Context/useAuth";
import toast from "react-hot-toast";
import api from "../Api/api_instance";

const Login = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { login } = useAuth();

  const onSubmit = async (data) => {
    try {
      if (isRegistering) {
        // Call the register endpoint
        const register = api.post("/user/register", {
          username: data.usernameOrEmail,
          email: data.email,
          password: data.password,
        });
        await toast.promise(register, {
          loading: "Registering...",
          success: (res) => {
            if (res.status === 201) {
              setIsRegistering(false);
              return "Registered!";
            }
          },
          error: (err) => {
            if (err.response.status === 400) {
              return err.response.data.message;
            } else {
              console.log(err);
            }
          },
        });
      } else {
        // Call the login endpoint
        const signin = api.post("/user/login", {
          usernameOrEmail: data.usernameOrEmail,
          password: data.password,
        });
        await toast.promise(signin, {
          loading: "please wait..",
          success: (res) => {
            if (res.status === 200) {
              login(res.data.token);
              localStorage.setItem("user_details", res.data.user.username);
              location.href = "/mycodes";
            }
          },
          error: (err) => {
            if (err.response.status === 401 || err.response.status === 404) {
              return err.response.data.message;
            }
          },
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-700">
          {isRegistering ? (
            "Register"
          ) : (
            <>
              <p>Signin</p>
              <p className="mt-2 text-sm font-normal text-gray-500">
                Run, Save your code anywhere within few steps
              </p>
            </>
          )}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              {...register("usernameOrEmail", {
                required: "Username is required",
              })}
              className={`mt-1 block w-full border rounded-md p-2 ${
                errors.username ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.username && (
              <p className="text-sm text-red-500">{errors.username.message}</p>
            )}
          </div>

          {isRegistering && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                {...register("email", { required: "Email is required" })}
                className={`mt-1 block w-full border rounded-md p-2 ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              {...register("password", { required: "Password is required" })}
              className={`mt-1 block w-full border rounded-md p-2 ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 mt-4 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none"
          >
            {isRegistering ? "Register" : "Login"}
          </button>
        </form>

        <div className="text-center">
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-sm text-blue-600 hover:underline"
          >
            {isRegistering
              ? "Already have an account? Login"
              : "Need an account? Register"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
