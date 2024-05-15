import React, { useEffect, useState } from "react";
import { getUserInfo, updateUserInfo } from "../api/methods";
import { PlusOutlined } from "@ant-design/icons";
import { Image, message } from "antd";
import { useSearchParams } from "react-router-dom";

const User = () => {
  const [image, setImage] = useState<File | null>(null);
  const [params] = useSearchParams();
  const user_id = params.get("user_id");
  alert("user_id" + params.get("user_id"));
  const [user, setUser] = useState({
    username: "",
    email: "",
    phone_number: "",
    profile_picture: "",
  });

  const getUser = async (user_id: string | null) => {
	alert("getUser" + user_id);
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
	console.log("useEffec t ", params.get("user_id"));
    getUser(user_id);
  }, []);

  return (
    <div className="h-full flex flex-wrap container">
      <h1 className="w-[100%] text-3xl text-center p-7">Profile i</h1>
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
      </div>
    </div>
  );
};

export default User;
