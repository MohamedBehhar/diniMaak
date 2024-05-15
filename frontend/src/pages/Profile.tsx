import React, { useEffect, useState } from "react";
import { getUserInfo, updateUserInfo } from "../api/methods";
import { PlusOutlined } from "@ant-design/icons";
import { Image, message } from "antd";

const Profile = () => {
  const [image, setImage] = useState<File | null>(null);
  const user_id = localStorage.getItem("id");
  const [user, setUser] = useState({
    username: "",
    email: "",
    phone_number: "",
    profile_picture: "",
    
  });

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
    <div className="h-full flex flex-wrap container">
      <h1 className="w-[100%] text-3xl text-center p-7">Profile</h1>
      <div className="w-[50%] h-[100%] ">
        {Object.keys(user).map((key) => {
          return (
            <div className="flex items-center gap-5">
              <p>{key}</p>
              <input
                type="text"
                value={user[key as keyof typeof user]}
                onChange={(e) => {
                  setUser({ ...user, [key]: e.target.value });
                }}
              />
            </div>
          );
        })}
      </div>
      <div className="  w-[50%] flex flex-col ">
        <div className="h-[72%] flex items-center justify-center ">
          <div className="w-[100px] h-[100px] bg-gray-200 rounded-full object-cover">
            <Image
              width={"100%"}
              height={"100%"}
              className="rounded-full object-cover border-none"
              src={image ? URL.createObjectURL(image) : ""}
            />
          </div>
        </div>
        <div className="flex items-center ">
          <label
            htmlFor="avatar"
            className="cursor-pointer w-full flex justify-center items-center bg-gray-200  mx-4 rounded-md gap-5"
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
