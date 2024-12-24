import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { userState } from "../store/atoms/user";


function LogoutButton() {
    const navigate = useNavigate();
    const setUser = useSetRecoilState(userState);

    return(
        <button 
            className="bg-gray-800 text-white hover:bg-gray-50 hover:bg-gray-900/90 rounded-full h-8 px-4"
            onClick={() =>{
                localStorage.removeItem("token");
                setUser({})
                navigate('/signin')
            }}
        >
            Logout
        </button>
    )
}

export default LogoutButton;