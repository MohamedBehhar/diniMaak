import { socket } from "../socket/socket";
import { useEffect, useState } from "react";
import { getBookingRequest } from "../api/methods";
import { Link } from "react-router-dom";
import MyDialog from "./MyDialog";
import RequesterCard from "./RequesterCard";

const Layout = ({ children }: any) => {
  const user_id = localStorage.getItem("id");
  const [notifications, setNotifications] = useState([]);
  useEffect(() => {
    socket.on("connection", () => {
      console.log("connected");
      // emit user id
      socket.emit("join", user_id);
    });

    // socket.emit("join", user_id);

    getBookingRequest(user_id)
      .then((response: any) => {
        setNotifications(response);
      })
      .catch((error: any) => {
        console.log(error);
      });

    socket.on("newBooking", (data: any) => {
      console.log("socket ==== ", data);
      if (data.publisher_id == user_id) {
        getBookingRequest(user_id)
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
      getBookingRequest(user_id)
        .then((response: any) => {
          setNotifications(response);
        })
        .catch((error: any) => {
          console.log(error);
        });
    });

    getBookingRequest(user_id)
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

  return (
    <div className="">
      <MyDialog open={openDialog} handleClose={handleCloseDialog} title="title">
        <RequesterCard
          requester_id={requester_id}
          carpooling_id={carpooling_id}
          handleClose={handleCloseDialog}
        />
      </MyDialog>
      <header className="flex justify-between items-center p-3 bg-blue-500 text-white ">
        <div>
          <Link to="/">
            <div>Home</div>
          </Link>
        </div>
        <div className="text-white font-semibold text-lg text-center">
          {localStorage.getItem("username")}
        </div>
        <div
          className="flex gap-10
		items-center  "
        >
          <Link to={`/carpooling/history/${user_id}`}>
            <div>Gerer vos Reservations</div>
          </Link>
          <div
            className="relative border p-2 rounded-md cursor-pointer peer hover:bg-gray-200 hover:text-black
              
            "
            onMouseEnter={() => setShowNotifications(true)}
            onMouseLeave={() => setShowNotifications(false)}
          >
            <p>demande de reservation</p>
            <div className="absolute top-0 right-0 bg-red-500 text-white rounded-full flex justify-center items-center  text-[12px] w-[15px] h-[15px]">
              {notifications.length}
            </div>
            {showNotifications && (
              <div className="absolute r top-10 right-0 bg-white text-black rounded-md p-2 z-40 w-[400px] h-[350px] overflow-y-scroll text-sm ">
                {notifications.map((notification: any, index: any) => (
                  <div
                    key={index}
                    className="flex gap-2 border border-gray-300 rounded-md p-1 my-2 items-center justify-between"
                  >
                    <span className="flex flex-col">
                      <span>{notification.departure} to</span>
                      {notification.destination}
                    </span>
                    <span>seats: {notification.number_of_seats}</span>
                    <span>name : {notification.booker_name}</span>
                    <button
                      className="bg-green-700 text-white p-1 rounded-md cursor-pointer"
                      type="button"
                      onClick={() => {
                        setBookerId(notification.requester_id);
                        setCarpoolingId(notification.carpooling_id);
                        setOpenDialog(true);
                      }}
                    >
                      View details
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>menu</div>
        </div>
      </header>
      <div className="p-2 ">{children}</div>
      <footer className="p-3 bg-blue-500 text-white">footer</footer>
    </div>
  );
};

export default Layout;
