import {BrowserRouter,Routes,Route} from 'react-router-dom';
import { Home } from './pages/Home'
import Signup from './pages/Signup'
import Signin from './pages/Signin'
import Dashboard from './pages/Dashboard'

import UpdateProfile from './pages/UpdateProfile';

const App = () => {

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
