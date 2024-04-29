import { socket } from "../socket/socket";
import { useEffect, useState } from "react";
import { getBookingRequest } from "../api/methods";
import { Link } from "react-router-dom";

const Layout = ({ children }: any) => {
  const user_id = localStorage.getItem("id");
  const [notifications, setNotifications] = useState([]);
  useEffect(() => {
    socket.on("newBooking", (data: any) => {
      console.log("socket ==== ", data);
      if (data.publisher_id == user_id) alert("new booking");
    });
    const user_id = localStorage.getItem("id");
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
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };
  return (
    <div className="">
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
            className="relative border p-2 rounded-md cursor-pointer bg-red-500
              
            "

            onClick={toggleNotifications}
          >
            <p>demande de reservation</p>
            <div className="absolute top-0 right-0 bg-red-500 text-white rounded-full flex justify-center items-center  text-[12px] w-[15px] h-[15px]">
              {notifications.length}
            </div>
            <div
              className="absolute top-10 right-0 bg-white text-black rounded-md p-2 z-40 w-[300px] "
              style={{ display: showNotifications ? "block" : "none" }}
            >
              {notifications.map((notification: any, index: any) => (
                <div
                  key={index}
                  className="flex gap-2 border border-gray-300 rounded-md p-1 my-2 items-center justify-between"
                >

                  <span>{notification.departure} to {notification.destination}</span>
                  <span>{notification.number_of_seats}</span>
                  <button className="bg-green-700 text-white p-1 rounded-md cursor-pointer"
                    type="button"
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
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
