import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "./Button";
import { InputBox } from "./InputBox";

export const UserProfile = () => {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    username: ""
  });
  const [editable, setEditable] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    password: ""
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get( process.env.REACT_APP_API_URL + "/user/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data);
        setFormData({
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          password: ""
        });
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError("Error fetching profile data.");
      }
    };

    fetchUserProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");

      // Prepare updateData object, omitting password if empty
      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        ...(formData.password.length >= 6 ? { password: formData.password } : {})
      };

      const response = await axios.put( process.env.REACT_APP_API_URL + "/user/update", updateData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUser((prev) => ({
        ...prev,
        ...formData
      }));
      console.log(response)
      setEditable(false);
      setError(null); // Clear previous errors
      alert(response.data.message);
    } catch (err) {
      console.error("Error updating profile:", err.response?.data || err);
      setError("Error updating profile.");
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">User Profile</h1>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Username</label>
        <div className="text-gray-900">{user.username}</div>
      </div>
      <div className="mb-4">
        <InputBox
          name="firstName"
          label="First Name"
          value={editable ? formData.firstName : user.firstName}
          onChange={handleInputChange}
          disabled={!editable}
        />
      </div>
      <div className="mb-4">
        <InputBox
          name="lastName"
          label="Last Name"
          value={editable ? formData.lastName : user.lastName}
          onChange={handleInputChange}
          disabled={!editable}
        />
      </div>
      <div className="mb-4">
        {editable ? (
          <InputBox
            name="password"
            label="Password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
          />
        ) : (
          <div className="text-gray-900">******</div>
        )}
      </div>
      <div className="flex justify-between">
        {editable ? (
          <Button onPress={handleUpdate} label="Save Changes" />
        ) : (
          <Button onPress={() => setEditable(true)} label="Edit Profile" />
        )}
      </div>
    </div>
  );
};