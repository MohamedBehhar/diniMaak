import { useEffect, useState } from "react";
import { socket } from "../socket/socket";
import {
  getNotifications,
  getNotificationsCount,
  getUserInfo,
  getUnreadLastMessagesCount,
} from "../api/methods";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import type { MenuProps } from "antd";
import { Dropdown } from "antd";
import { concatinatePictureUrl, signOut } from "../utils/helperFunctions";
import { message } from "antd";
import { useDispatch } from "react-redux";
import { resetUserInfos, setUserInfo } from "../store/user/userSlice";
import { IoChatboxEllipses } from "react-icons/io5";
import DefaultUserImage from "../assets/user.png";
import Logo from "../assets/logo.png";

interface Notifications {
  total: number;
  requestsCount: number;
  reservationsCount: number;
  carpoolingPublishedCount: number;
}

const Layout = () => {
  const userInfo = useSelector((state: RootState) => state.user.user);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const token = localStorage.getItem("token");
  const [notifications, setNotifications] = useState({} as Notifications);

  const dispatch = useDispatch();

  const getMessagesCount = async () => {
    // check if the user is the sender or the receiver

    await getUnreadLastMessagesCount(user_id)
      .then((response: any) => {
        setUnreadMessages(response);
      })
      .catch((error: any) => {
        message.error("Error fetching unread messages");
      });
  };

  const fetchNotificationsCount = async () => {
    await getNotificationsCount(user_id)
      .then((response: any) => {
        setNotifications(response);
      })
      .catch((error: any) => {
        message.error("Error fetching notifications");
      });
  };

  const fetchUserInfo = async () => {
    await getUserInfo(user_id)
      .then((response: any) => {
        console.log("response === ", response);
        dispatch(setUserInfo(response));
      })
      .catch((error: any) => {
        message.error("Error fetching user info");
      });
  };

  console.log("userInfo === ", userInfo);

  const user_id = localStorage.getItem("id");
  useEffect(() => {
    socket.on("connection", () => {
      socket.emit("join", user_id);
    });
    socket.on("newBookingRequest", (data: any) => {
      message.info(data.message);
      getNotifications(user_id);
      fetchNotificationsCount();
    });

    socket.on("requestAccepted", (data: any) => {
      message.info(data.message);
      getNotifications(user_id);
      fetchNotificationsCount();
      getMessagesCount();
    });

    socket.on("newMsg", () => {
      alert("New message");
      getMessagesCount();
    });

    socket.on("updateMsgCount", () => {
      alert("updateMsgCounte");
      getMessagesCount();
    });

    socket.on("carpoolingDeleted", (data: any) => {
      console.log("carpoolingDeleted", data);
      alert("Carpooling deleted");
    });

    socket.on("carpoolingPublished", (data: any) => {
      console.log("carpoolingPublished", data);
      alert("Carpooling published");
      getNotifications(user_id);
      fetchNotificationsCount();
    });

    socket.on("updateNotificationCount", () => {
      alert("updateNotificationCount");
      fetchNotificationsCount();
    });

    if (token !== "undefined" && token) {
      getMessagesCount();
      fetchNotificationsCount();
      fetchUserInfo();
    }
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
      label: (
        <p className="flex gap-1">
          Notifications
          {notifications.total > 0 && (
            <span className=" w-6 h-6 flex justify-center items-center bg-red-500 text-white rounded-full p-1">
              {notifications.total}
            </span>
          )}
        </p>
      ),
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
        dispatch(resetUserInfos());
        signOut();
      },
    },
  ];

  return (
    <div className="relative h-full flex flex-col">
      <header className=" fixed z-50 w-full bg-white shadow-md top-0 left-0 overflow-hidden ">
        <div className="container flex justify-between items-center p-3  text-gray-600 ">
          <Link to="/">
            <img
              src={Logo}
              alt="Dini-Maak"
              className="w-[50px] aspect-square"
            />
          </Link>
          {token !== "undefined" && token !== null && (
            <div
              className="flex items-center gap-5 cursor-pointer relative"
              onClick={() => Navigate("/conversations/" + user_id)}
            >
              {unreadMessages > 0 && (
                <div className="notifications bg-red-600 absolute bottom-4 -right-1 w-[12px] aspect-square rounded-full text-[10px] flex  justify-center text-white ">
                  {unreadMessages}
                </div>
              )}
              <IoChatboxEllipses className="text-cyan-600 text-2xl" />
            </div>
          )}
          {token !== "undefined" && token !== null ? (
            <div className="flex gap-1 items-center">
              <h1 className="text-lg font-bold text-cyan-600 capitalize">
                {userInfo.username}
              </h1>
              <Dropdown menu={{ items }} placement="bottomRight">
                <div className="  rounded-full relative">
                  <img
                    src={concatinatePictureUrl(userInfo.profile_picture)}
                    alt=""
                    className={`${
                      notifications.total ? "ring-1 ring-red-500" : ""
                    } w-10 h-10 rounded-full object-cover`}
                    onError={(e) => {
                      e.currentTarget.src = DefaultUserImage;
                    }}
                  />
                </div>
              </Dropdown>
            </div>
          ) : (
            <button
              className="btn bg-cyan-700 p-1 rounded-md text-white"
              onClick={() => Navigate("/login", { replace: true })}
            >
              Sign In
            </button>
          )}
        </div>
      </header>
      <div className="bg-white flex flex-col flex-1 pt-12">
        <div className="container flex-1 ">
          <Outlet />
        </div>

        <div className="p-3 bg-cyan-700 text-white h-[4rem] ">
          <div className="container">
            <p className="text-center text-sm">
              &copy; 2024 Dini-Maak. All rights reserved
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
