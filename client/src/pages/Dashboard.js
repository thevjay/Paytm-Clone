import { Link, useNavigate } from "react-router-dom";
import {  useRecoilValue } from "recoil";
import { userState } from "../store/atoms/user";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaIndianRupeeSign, FaUser } from 'react-icons/fa6'
import { IoHomeOutline } from 'react-icons/io5'
import { ToastContainer } from "react-toastify";
import axios from "axios";
import { notifyError, notifySuccess } from "./Nofity";
import useDebounce from "../hooks/Debounce";
import LogoutButton from "./LogoutButton";

const Dashboard =()=> {

  const navigate = useNavigate();
  const user = useRecoilValue(userState)
  const [balance, setBalance] = useState();
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("");
  const [receiverId, setReceiverId] = useState("");
  const debouncedValue = useDebounce(filter,500)
  const { register, setValue, handleSubmit } = useForm();


  const filterUsers = async (filter) => {
    if(filter.length === 0) {
      return setUsers([]);
    }

    try{

      const { data } = await axios.get(  `${process.env.REACT_APP_API_URL}/user/bulk?filter=${filter}`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          }
        }
      )
      setUsers(data.users);
    }catch(err){
      if(err.response){
        notifyError(err.response.data.message);
      }else if (err.request){
        notifyError(err.response.responseText)
      }else {
        notifyError(err)
      }
    }
  }

  const getBalance = async () =>{
    try{

      const { data } = await axios.get( `${process.env.REACT_APP_API_URL}/account/balance`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          }
        }
      )
      setBalance(data.balance.toFixed(2));
    }catch(err){
      if (err.response) {
        notifyError(err.response.data.message);
      } else if (err.request) {
        notifyError(err.response.responseText);
      } else {
        notifyError(err);
      }
    }
  }

  const transferMoney = async (transferData) => {
    if(transferData.receiver){
      try{
        const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/account/transfer`,
          { to: receiverId, amount: transferData.amount},
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            }
          }
        )
        notifySuccess(data.message)
        await getBalance();
      }catch(err){
        if(err.response){
          notifyError(err.response.data.message)
        }else if (err.request){
          notifyError(err.response.responseText)
        }else{
          notifyError(err)
        }
      }
    }
  }

  useEffect(()=>{
    if(Object.keys(user).length === 0){
      navigate("/signin")
    } else {
      getBalance();
    }
  },[user])

  useEffect(()=>{
    filterUsers(filter);
  },[debouncedValue])

  return(
    <div className="grid min-h-screen w-full overflow-hidden lg:grid-cols-[280px_1fr] bg-gray-50">
      <div className="hidden border-r bg-gray-200/40 lg:block">
        <div className="flex h-full max-h-screen flex-col">
          <div className="flex h-[60px] items-center border-b px-6 bg-gray-100">
            <Link className="flex items-center justify-center gap-2 font-semibold text-lg text-gray-800">
              <FaIndianRupeeSign />
              <span>PayApp</span>
            </Link>
          </div>

          <div className="flex-1 overflow-auto py-2 bg-gray-800">
            <nav className="grid items-start px-4 text-sm font-medium">
              <Link className="flex items-center gap-3 text-white rounded-lg bg-gray-700 px-3 py-2">
                <IoHomeOutline />
                Dashboard
              </Link>
              <Link
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400"
                to={'/updateProfile'}
              >
                <FaUser/>
                Update Profile
              </Link>
            </nav>
          </div>
        </div>
      </div>


      <div className="flex flex-col">
        <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6">
          <Link className="lg:hidden">
              <FaIndianRupeeSign/>
              <span className="sr-only">Home</span>
          </Link>

          <div className="w-full flex-1">
            <h1 className="font-semibold text-xl text-gray-800">Dashboard</h1>
          </div>

          <LogoutButton/>
        </header>


        <main className="flex flex-1 flex-col gap-6 p-6">
          <div className="flex items-center gap-4">
            <h1 className="font-semibold text-3xl md:text-3xl text-gray-800">
              Welcome, {" "}
              <span className="font-medium text-gray-500">
                {user.firstName} {user.lastName}
              </span>
            </h1>
          </div>

          <div className="flex flex-col md:grid md:grid-cols-6 gap-6">
            <div className="md:col-span-4 lg:col-span-3 xl:col-span-5 flex flex-col gap-6">
              <div className="shadow-lg rounded-lg bg-white text-gray-900">
                <div className="flex flex-col rounded-t-lg space-y-2 p-3 bg-gray-200">
                  <div className="text-lg text-gray-800 font-semibold leading-none tracking-tight">
                    Balance
                  </div>
                </div>

                <div className="flex items-center p-3 gap-1 rounded-b bg-gray-100">
                  <FaIndianRupeeSign className="text-2xl"/>
                  <span className="text-2xl">{balance}</span>
                </div>
              </div>

              <div className="shadow-lg rounded-lg bg-white text-gray-900">
                <div className="flex rounded-t-lg flex-col space-t-2 p-3 bg-gray-200">
                  <div className="text-lg text-gray-800 font-semibold leading-none tracking-tight">
                    Send Money
                  </div>
                </div>
                <div className="p-3 rounded-b-lg bg-gray-100">
                  <form
                    onSubmit={handleSubmit(transferMoney)}
                    className="space-y-4"
                  >
                    <div>
                      <label className="text-sm font-medium leading-none text-gray-800 peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Receiver
                      </label>
                      <input
                        className="shadow-sm flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Search users..."
                        {...register("receiver",{
                          onChange: (e) => setFilter(e.target.value),
                        })}
                      />
                      {
                        users.length !== 0 && (
                          <div className="flex h-8 w-full cursor-pointer border-y border-gray-200 bg-white px-3 py-1 text-sm">
                            {users.map((user) => (
                              <div 
                                className="flex h-8 w-full cursor-pointer border-y border-gray-200 bg-white px-3 py-1 text-sm"
                                key={user._id}
                                onClick={() => {
                                  const userName = `${user.firstName} ${user.lastName}`;
                                  setValue("receiver",userName);
                                  setReceiverId(user._id);
                                  setUsers([]);
                                }}
                              >
                                {user.firstName} {user.lastName}
                              </div>
                            ))}
                          </div>
                        )
                      }
                    </div>

                    <div>
                      <label className="text-sm font-medium leading-none text-gray-800 peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Amount
                      </label>
                      <input  
                          className="shadow-sm flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="Enter amount"
                          type="number"
                          { ...register("amount", {required: true})}
                      />
                    </div>
                    <button
                      className="shadow-sm flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      type="submit"
                    >
                      Send
                    </button>
                    <ToastContainer/>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Dashboard;