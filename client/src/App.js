import React, { useEffect } from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import { Home } from './pages/Home'
import Signup from './pages/Signup'
import Signin from './pages/Signin'
import Dashboard from './pages/Dashboard'
import { UserProfile } from './components/UserProfile'
import { SendMoney } from './pages/SendMoney';
import { useSetRecoilState } from 'recoil';
import { userState } from './store/atoms/user';
import axios from 'axios';
import UpdateProfile from './pages/UpdateProfile';

const App = () => {
  // const setUser = useSetRecoilState(userState)

  // async function getUser() {
  //   try{
  //     const { data } = await axios.get(`http://localhost:8000/api/v1/user/me`,
  //       {
  //         headers: {
  //           Authorization: "Bearer " + localStorage.getItem("token"),
  //         }
  //       }
  //     )

  //     setUser(data.user);

  //   }catch (err){
  //     setUser({});
  //   }
  // }

  // useEffect(()=>{
  //   getUser();
  // },[])


  return (
    <div className='h-screen w-full flex flex-col justify-between mt-10'>
      <BrowserRouter>
        <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/signup' element={<Signup/>}/>
            <Route path='/signin' element={<Signin/>}/>
            <Route path='/dashboard' element={<Dashboard/>}/>  
            <Route path='/updateProfile' element={<UpdateProfile/>}/>            
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
