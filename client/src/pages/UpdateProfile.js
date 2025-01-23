import { useForm } from "react-hook-form";
import { useRecoilState } from "recoil";
import { userState } from "../store/atoms/user";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaIndianRupeeSign, FaUser } from "react-icons/fa6";
import { IoHomeOutline } from "react-icons/io5";
import LogoutButton from "./LogoutButton";
import { ToastContainer } from "react-toastify";
import { notifyError, notifySuccess } from "./Nofity";
import { useEffect } from "react";


const UpdateProfile =()=>{

    const { register, handleSubmit } = useForm();
    const [user, setUser] = useRecoilState(userState);


    async function getUser() {
        try{

            const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/user/me`,
                {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token")
                    },
                },
            );
            setUser(data.user);
        }
        catch(err){
            setUser({});
        }
    }


    async function updateProfile(updateData) {
        try{

            const { data } = await axios.put(`${process.env.REACT_APP_API_URL}/user`,
                updateData,
                {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token")
                    }
                }
            )

            await getUser();
            notifySuccess(data.message);
        }catch(err){
            if(err.response){
                notifyError(err.response.data.message);
            }else if(err.request){
                notifyError(err.response.responseText);
            }else{
                notifyError(err)
            }
        }
    }

    useEffect(()=> {
        getUser();
    },[getUser]);


    return(
        <div className="grid min-h-screen w-full overflow-hidden lg:grid-cols-[280px_1fr] bg-gray-50">
            <div className="hidden border-r bg-gray-200/40 lg:block">
                <div className="flex h-full max-h-screen flex-col">
                    <div className="flex h-[60px] items-center border-b px-6 bg-gray-100">
                        <Link className="flex items-center gap-2 font-semibold text-lg text-gray-800">
                            <FaIndianRupeeSign/>
                            <span>PayApp</span>
                        </Link>
                    </div>

                    <div className="flex-1 overflow-auto py-2 bg-gray-800">
                        <nav className="grid items-start px-4 text-sm font-medium">
                            <Link
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400"
                                to={'/dashboard'}
                            >
                                <IoHomeOutline />
                                Dashboard
                            </Link>

                            <Link 
                                className="flex items-center gap-3 rounded-lg bg-gray-700 px-3 py-2 text-white"
                            >
                                <FaUser />
                                Update Profile
                            </Link>
                        </nav>
                    </div>
                </div>
            </div>

            <div className="flex flex-col">
                <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6">
                    <Link className="lg:hidden" href="#">
                        <span className="sr-only">Home</span>
                    </Link>

                    <div className="w-full flex-1">
                        <h1 className="font-semibold text-xl text-gray-800">
                            Update Profile
                        </h1>
                    </div>
                    <LogoutButton/>
                </header>


                <main className="flex flex-col gap-4 p-4 md:gap-8 md:p-6">
                    <div className="flex items-center">
                        <h1 className="font-semibold text-lg md:text-2xl">Profile</h1>
                    </div>

                    <div className="flex">
                        <div className="flex-1 mx-2 gap-6">
                            <div className="rounded-lg bg-white text-gary-900 shadow-lg">
                                <div>
                                    <h3>
                                        Personal Information
                                    </h3>
                                </div>

                                <div className="p-6 pt-3">
                                    <form
                                        onSubmit={handleSubmit(updateProfile)}
                                        className="space-y-5"
                                    >
                                        <div className="space-y-2">
                                            <div className="space-y-1">
                                                <label className="text-sm font-medium leading-none text-gray-800">
                                                    First Name
                                                </label>
                                                <input
                                                    className="shadow-sm flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
                                                    placeholder="Enter your first name"
                                                    {...register("firstName")}
                                                />
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-sm font-medium leading-none text-gray-800">
                                                    Last Name
                                                </label>
                                                <input
                                                    className="shadow-sm flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
                                                    placeholder="Enter your Last name"
                                                    {...register("lastName")}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-medium leading-none text-gray-800">
                                                    New Password
                                                </label>
                                                <input
                                                    className="shadow-sm flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
                                                    placeholder="Enter new password"
                                                    {...register("password")}
                                                />
                                            </div>
                                        </div>

                                        <button
                                            className="rounded-md bg-gray-800 text-white hover:bg-gray-700 hover:bg-gray-900/90 h-10 px-4 py-2"
                                            type="submit"
                                        >
                                            Update
                                        </button>
                                        <ToastContainer/>
                                    </form>
                                </div>
                            </div>
                        </div>

                        {/* second div */}
                        <div className="flex-1 mx-2 gap-6 rounded-lg bg-white text-gray-900 shadow-lg">
                            <div className="flex flex-col space-y-2 p-3 bg-gray-200 rounded-t-lg">
                                <h3 className="text-2xl font-semibold leading-none tracking-tight">User Details</h3>
                            </div>

                            <p className="text-center italic text-lg text-gray-500">
                                Here are the details of the user.
                            </p>

                            <div className="p-6 pt-3">
                                <div className="inline-flex items-baseline mt-6">
                                    <h2 className="text-2xl ml-2 text-gray-500">Name: </h2>
                                    <p className="text-2xl ml-2 text-gray-500 italic">
                                        {user.firstName} {user.lastName}
                                    </p>

                                </div>
                                <div className="inline-flex items-baseline mt-4 ml-10">
                                    <h2 className="text-3xl font-semibold">Email:</h2>
                                    <p className="text-2xl ml-2 text-gray-500 italic">
                                        {user.email}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default UpdateProfile;