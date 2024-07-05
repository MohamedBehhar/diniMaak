import React, { useEffect, useState } from "react";
import { getUserInfo, updateUserInfo } from "../api/methods";
import { PlusOutlined } from "@ant-design/icons";
import { Image, message } from "antd";
import DefaultUserImage from "../assets/user.png";
import { setUserInfo } from "../store/user/userSlice";
import { useDispatch } from "react-redux";

const Profile = () => {
  const [image, setImage] = useState<File | null>(null);
  const user_id = localStorage.getItem("id");
  const [user, setUser] = useState({
    username: "",
    email: "",
    phone_number: "",
    profile_picture: "",
  });
  const dispatch = useDispatch();

  const updateProfile = async () => {
    alert("updateProfile" + user_id);
    const formData = new FormData();
    formData.append("profile_picture", image!);
    formData.append("username", user.username);
    formData.append("email", user.email);
    formData.append("phone_number", user.phone_number);

    formData.append("id", user_id!);

    console.log("formData === ", formData);

    await updateUserInfo(formData)
      .then((response: any) => {
        console.log("response === ", response);
        message.success("Profile updated successfully");
        dispatch(setUserInfo(response));
        getUser(user_id);
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  const getUser = async (user_id: string | null) => {
    await getUserInfo(user_id)
      .then((response: any) => {
        setUser(response);
      })
      .catch((error: any) => {
        message.error("Error getting user info");
        console.log(error);
      });
  };

  useEffect(() => {
    getUser(user_id);
  }, []);

  return (
    <div className="  flex flex-col items-center justify-center gap-4 container mx-auto py-8">
      <h1 className="text-3xl font-semibold text-center">Profile</h1>
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <div className="flex flex-col items-center gap-3">
          <img
            src={
              image
                ? URL.createObjectURL(image)
                : `http://localhost:3000${user.profile_picture}`
            }
            onError={(e) => {
              e.currentTarget.src = DefaultUserImage;
            }}
            alt="Profile"
            className="w-40 h-40 rounded-full object-cover"
          />
          <div className="flex items-center w-full mt-4">
            <label
              htmlFor="avatar"
              className="cursor-pointer w-full flex justify-center items-center bg-gray-200 hover:bg-gray-300 transition mx-4 rounded-md gap-2 px-4 py-2"
            >
              <PlusOutlined className="text-2xl text-gray-500" />
              <p className="text-gray-700">Upload your profile picture</p>
            </label>
            <input
              type="file"
              id="avatar"
              name="avatar"
              accept="image/png, image/jpeg"
              onChange={(e) => {
                setImage(e.target.files[0]);
              }}
              className="hidden"
            />
          </div>
        </div>

        <div className="mt-6">
          <div className="flex gap-4 mb-2">
            <h1 className="text-lg text-cyan-600 font-semibold">Name:</h1>
            <p className="text-lg text-gray-800">{user.username}</p>
          </div>
          <div className="flex gap-4 mb-2">
            <h1 className="text-lg text-cyan-600 font-semibold">Email:</h1>
            <p className="text-lg text-gray-800">{user.email}</p>
          </div>
          <div className="flex gap-4 mb-2">
            <h1 className="text-lg text-cyan-600 font-semibold">Phone:</h1>
            <p className="text-lg text-gray-800">{user.phone_number}</p>
          </div>
        </div>
      </div>
      <button
        className="w-full max-w-md bg-cyan-600 text-white py-2 mt-6 rounded-md hover:bg-cyan-700 transition"
        onClick={updateProfile}
      >
        Update
      </button>
    </div>
  );
};

export default Profile;
