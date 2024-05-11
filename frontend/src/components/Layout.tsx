import { socket } from "../socket/socket";
import { useEffect, useState } from "react";
import { getNotifications } from "../api/methods";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { FaCarSide } from "react-icons/fa";
import type { MenuProps } from "antd";
import { Button, Dropdown, Space } from "antd";
import { FaRegUserCircle } from "react-icons/fa";
import { signOut } from "../utils/helperFunctions";

const Layout = ({ children }: any) => {
  const user_id = localStorage.getItem("id");
  const userInfo = useSelector((state: RootState) => state.user.test);
  console.log("userInfo === ", userInfo);
  const [notifications, setNotifications] = useState([]);
  useEffect(() => {
    socket.on("connection", () => {
      console.log("connected");
      // emit user id
      socket.emit("join", user_id);
    });

    socket.on("carpooling_request_accepted", (data: any) => {
      alert("carpooling request accepted");
      console.log("socket ==d==00: ", data);
    });

    getNotifications(user_id)
      .then((response: any) => {
        setNotifications(response);
      })
      .catch((error: any) => {
        console.log(error);
      });

    socket.on("newBooking", (data: any) => {
      console.log("socket ==== ", data);
      if (data.publisher_id == user_id) {
        getNotifications(user_id)
          .then((response: any) => {
            setNotifications(response);
          })
          .catch((error: any) => {
            console.log(error);
          });
      }
    });
    socket.on("carpooling_request_accepted", (data: any) => {
      alert("carpooling request accepted");
      console.log("socket ==d== ", data);
    });

    socket.on("updateNotifications", (data: any) => {
      alert("updateNotifications");
      console.log("socket ==== ", data);
      getNotifications(user_id)
        .then((response: any) => {
          setNotifications(response);
        })
        .catch((error: any) => {
          console.log(error);
        });
    });

    getNotifications(user_id)
      .then((response: any) => {
        setNotifications(response);
        console.log("notifs === ", response);
      })
      .catch((error: any) => {
        console.log(error);
      });
    return () => {
      socket.off("connect");
    };
  }, []);

  const [showNotifications, setShowNotifications] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const [requester_id, setBookerId] = useState(0);
  const [carpooling_id, setCarpoolingId] = useState(0);
  const Navigate = useNavigate();
  const items: MenuProps["items"] = [
    {
      key: "1",
      label: "Profile",
    },
    {
      key: "2",
      label: "Carpooling Requests",
      onClick: () => {
        Navigate('/carpooling/requests/' + localStorage.getItem('id'))
      },
    },
    {
      key: 'reservations',
      label: 'Reservations',
      onClick: () => {
        Navigate('/carpooling/history/' + localStorage.getItem('id'))
      }
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
    <div className="h-full  ">
      <header className="border-b border-b-gray-200 h-[5%]   ">
        <div className="container flex justify-between items-center p-3  text-gray-600 ">
          <Link to="/">
            <div className="bg-[#F3D0D7]  flex flex-col items-center  justify-center rounded-full p-2">
              <FaCarSide className="text-cyan-600 size-9" />
              {/* <p className="text-xs">Dini-Maak</p> */}
            </div>
          </Link>
          <div className="text-xl ">{localStorage.getItem("username")}</div>
          <Dropdown menu={{ items }} placement="bottomRight">
            <div className="bg-[#F3D0D7] p-2 rounded-full ">
              <FaRegUserCircle className="size-8 text-cyan-600" />
            </div>
          </Dropdown>
        </div>
      </header>
      <div className="  h-[80%] ">{children}</div>
      <footer className="p-3 bg-blue-500 text-white h-[15%] ">footer</footer>
    </div>
  );
};

export default Layout;
