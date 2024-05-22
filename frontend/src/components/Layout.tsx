import { socket } from "../socket/socket";
import { useEffect, useState } from "react";
import {
  getNotifications,
  getNotificationsCount,
  getUserInfo,
} from "../api/methods";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { FaCarSide } from "react-icons/fa";
import type { MenuProps } from "antd";
import { Dropdown } from "antd";
import { concatinatePictureUrl, signOut } from "../utils/helperFunctions";
import { message } from "antd";
import { useDispatch } from "react-redux";
import { setUserInfo } from "../store/user/userSlice";
import { IoChatboxEllipses } from "react-icons/io5";
import DefaultUserImage from "../assets/user.png";

const Layout = ({ children }: any) => {
  const userInfo = useSelector((state: RootState) => state.user.user);

  const dispatch = useDispatch();

  console.log("userInfo === ", userInfo);
  const [notifications, setNotifications] = useState([]);

  const user_id = localStorage.getItem("id");
  useEffect(() => {
    socket.on("connection", () => {
      console.log("connected-----------------socket");
      socket.emit("join", user_id);
    });
    socket.on("newBookingRequest", (data: any) => {
      console.log("new booking request === ", data);
      message.info(data.message);
      getNotifications(user_id);
    });

    socket.on("requestAccepted", (data: any) => {
      message.info(data.message);
      getNotifications(user_id);
    });

    getNotificationsCount(user_id)
      .then((response: any) => {
        setNotifications(response);
      })
      .catch((error: any) => {
        console.log(error);
      });

    getUserInfo(user_id)
      .then((response: any) => {
        dispatch(setUserInfo(response));
      })
      .catch(() => {
        message.error("Error fetching user info");
      });

    return () => {
      socket.off("connection");
      socket.off("newBookingRequest");
    };
  }, []);

  const Navigate = useNavigate();

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: "Profile",
      onClick: () => {
        Navigate("/profile/" + user_id);
      },
    },
    {
      key: "5",
      label: "Manage your carpooling",
      onClick: () => {
        Navigate("/carpooling/published-carpooling/" + user_id);
      },
    },
    {
      key: "notifications",
      label: "Notifications",
      onClick: () => {
        Navigate("/notifications/" + user_id);
      },
    },
    {
      key: "2",
      label: (
        <div className="flex items-center justify-between cursor-pointer gap-5">
          Requests
          {notifications.requestsCount > 0 && (
            <span className=" w-6 h-6 flex justify-center items-center bg-red-500 text-white rounded-full p-1">
              {notifications.requestsCount}
            </span>
          )}
        </div>
      ),
      onClick: () => {
        Navigate("/carpooling/requests/" + user_id);
      },
    },
    {
      key: "reservations",
      label: "Reservations",
      onClick: () => {
        Navigate("/carpooling/history/" + user_id);
      },
    },
    {
      key: "3",
      label: "Settings",
    },
    {
      key: "4",
      label: "Sign Out",
      onClick: () => {
        signOut();
      },
    },
  ];

  return (
    <div className="h-full relative ">
      <header className="border-b border-b-gray-200 h-[3.5rem]   ">
        <div className="container flex justify-between items-center p-3  text-gray-600 ">
          <Link to="/">
            <div className="bg-[#F3D0D7]  flex flex-col items-center  justify-center rounded-full p-2">
              <FaCarSide className="text-cyan-600 " />
              {/* <p className="text-xs">Dini-Maak</p> */}
            </div>
          </Link>

          <div className="text-xl ">{userInfo.username}</div>
          <div
            className="flex items-center gap-5 cursor-pointer relative"
            onClick={() => Navigate("/conversations/" + user_id)}
          >
            <div className="notifications bg-red-600 absolute bottom-4 -right-1 w-2 aspect-square rounded-full "></div>
            <IoChatboxEllipses
              className="text-cyan-600 text-2xl"
            />
          </div>
          <Dropdown menu={{ items }} placement="bottomRight">
            <div className="  rounded-full relative">
              {notifications.length > 0 && (
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
              <img
                src={concatinatePictureUrl(userInfo.profile_picture)}
                alt=""
                className="w-8 h-8 rounded-full"
                onError={(e) => {
                  e.currentTarget.src = DefaultUserImage;
                }}
              />
            </div>
          </Dropdown>
        </div>
      </header>
      <div className="  "
        style={{ height: "calc(100vh - (3.5rem + 4rem))" }}
      >{children}</div>
      <footer className="p-3 bg-blue-500 text-white h-[4rem] ">footer</footer>
    </div>
  );
};

export default Layout;
