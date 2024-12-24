import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import log from '../Paytm_Logo.png'
import axios from "axios";

export const Appbar = () => {
  const [currentUser, setCurrentUser] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const response = await axios.get("http://localhost:8000/api/v1/user/profile", {
            headers: {
              Authorization: "Bearer " + token,
            },
          });
          //console.log(response)
          setCurrentUser(response.data.user.firstName); // Assuming the API returns user's first name
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setCurrentUser("");
    navigate("/signin"); // Navigate to sign-in page after logout
  };

  return (
    <div className="shadow-md h-16 flex justify-between items-center bg-white relative p-4">
      <Link to="/" className="flex items-center ml-4 text-xl font-semibold text-gray-800">
        <img src={log} alt="" width={100} />
      </Link>
      <div className="flex items-center">
        <div className="text-gray-700 mr-4">
          Hello {currentUser ? currentUser : "Guest"}
        </div>
        <div
          className="relative cursor-pointer rounded-full h-12 w-12 bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <div className="text-xl font-semibold text-gray-700">
            {currentUser ? currentUser[0].toUpperCase() : "U"}
          </div>
        </div>

        {showDropdown && (
          <div className="absolute right-4 mt-14 bg-white shadow-lg rounded-lg border border-gray-200 w-48">
            <div className="py-2">
              <Link to="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-100 rounded-t-lg transition-colors">
                User Details
              </Link>
              <div
                onClick={handleLogout}
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100 rounded-b-lg cursor-pointer transition-colors"
              >
                Logout
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};