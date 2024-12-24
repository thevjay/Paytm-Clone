import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { userState } from "../store/atoms/user";
import { ToastContainer } from "react-toastify";
import  axios from 'axios'
import { useEffect } from "react";
import { notifyError } from "./Nofity";


const Signin = () => {

  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const [user, setUser] = useRecoilState(userState);

  const onSubmit = async (userData) => {
    try{

      const { data } = await axios.post(`http://localhost:8000/api/v1/user/signin`,userData)

      const userResponse = await axios.get(`http://localhost:8000/api/v1/user/me`,
        {
          headers: {
            Authorization: "Bearer " + data.token,
          }
        }
      );

      setUser(userResponse.data.user);
      localStorage.setItem("token", data.token)
      navigate("/dashboard");
    }
    catch(error){
      if(error.response) {
        notifyError(error.response.data.message)
      }else if (error.request){
        notifyError(error.response.responseText)
      }else {
        notifyError(error);
      }
    }
  };

  useEffect(() => {
    if(Object.keys(user).length !== 0){
      navigate('/dashboard');
    }
  },[user])


  return(
    <div  className="w-full flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center text-gray-900">
          Sign In
        </h2>

        <form onSubmit={handleSubmit(onSubmit)}>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Email</label>
            <input
              className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white"
              placeholder="john@example.com"
              {...register("email", { required: true })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Password</label>
            <input
              className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white"
              placeholder="john@example.com"
              type="password"
              {...register("password", { required: true })}
            />

            <button
              className="w-full h-9 px-3 bg-gray-900 text-gray-50 hover:bg-gray-900/90 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white"
              type="submit"
            >
              Sign In
            </button>
            <ToastContainer/>
          </div>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-500">{"Don't have an account?"}</p>
          <Link to={'/signup'} className="text-blue-500 hover:underline">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Signin;