import React, { useEffect, useState } from "react";
import { getUserInfo, updateUserInfo } from "../api/methods";
import { PlusOutlined } from "@ant-design/icons";
import { Image, message } from "antd";
import  DefaultUserImage  from "../assets/user.png";
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
    <div className="flex flex-col items-center justify-center gap-4 container">
      <h1 className="w-[100%] text-3xl text-center p-7">Profile</h1>
      <div className="   ">
        <div className=" flex flex-col items-center gap-3">
          <Image
            width={"200px"}
            height={"200px"}
            className="rounded-full object-cover border-none"
            src={image ? URL.createObjectURL(image) : `http://localhost:3000${user.profile_picture}`
            
          }
            onError={(e) => {
              e.currentTarget.src = DefaultUserImage;
            }}
          />
          <div className="flex items-center  ">
            <label
              htmlFor="avatar"
              className="cursor-pointer w-full flex justify-center items-center bg-gray-200  mx-4 rounded-md gap-5 px-4"
            >
              <PlusOutlined className="text-4xl text-gray-500" />
              <p>Upload your profile picture</p>
            </label>
            <input
              type="file"
              id="avatar"
              name="avatar"
              accept="image/png, image/jpeg"
              onChange={(e) => {
                setImage(e.target.files![0]);
              }}
              className="hidden"
            />
          </div>
        </div>

        <div className="info">
          <div className="flex gap-4">
            <h1 className="text-xl text-cyan-600 font-bold">Name :</h1>
            <p className="text-lg text-gray-800">{user.username}</p>
          </div>
          <div className="flex gap-4">
            <h1 className="text-xl text-cyan-600 font-bold">Email :</h1>
            <p className="text-lg text-gray-800">{user.email}</p>
          </div>
          <div className="flex gap-4">
            <h1 className="text-xl text-cyan-600 font-bold">Phone :</h1>
            <p className="text-lg text-gray-800">{user.phone_number}</p>
          </div>
        </div>
      </div>
      <button
        className="w-[100%] bg-cyan-600 text-white p-3 my-5"
        onClick={updateProfile}
      >
        Update
      </button>
    </div>
  );
};

export default Profile;
