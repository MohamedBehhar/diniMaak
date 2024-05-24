import { getBookedCarpooling } from "../api/methods";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { cancelBookingRequest, confirmBookingRequest } from "../api/methods";
import { socket } from "../socket/socket";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

const CarpoolingHistory = () => {
  const user_id = localStorage.getItem("id");
  const [bookedCarpooling, setBookedCarpooling] = useState([]);
  useEffect(() => {
    fetchBookedCarpooling();
    socket.on("requestAccepted", () => {
      alert("new booking");
      fetchBookedCarpooling();
    });
  }, []);

  const fetchBookedCarpooling = async () => {
    await getBookedCarpooling(user_id)
      .then((response: any) => {
        setBookedCarpooling(response);
      })
      .catch((error: any) => {
        message.error("error fetching booked carpooling");
      });
  };

  const cancelBooking = async (carpooling: any) => {
    try {
      await cancelBookingRequest(carpooling);
    } catch (error) {
      console.log(error);
    }
  };

  const confirmBooking = async (carpooling: any) => {
    await confirmBookingRequest(carpooling)
      .then((response: any) => {
        console.log("response: ", response);
        message.success("booking confirmed");
        fetchBookedCarpooling();
      })
      .catch((error: any) => {
        message.error("error confirming booking");
      });
  };

  const Navigate = useNavigate();

  return (
    <div className="container p-3">
      {bookedCarpooling.map((carpooling: any) => {
        return (
          <div
            className=" border border-gray-400 rounded-md p-2 "
            key={carpooling.id}
          >
            <div className="flex justify-between items-center">
              <h1>
                {carpooling.departure} to {carpooling.destination}
              </h1>
              <div
                className={`${
                  carpooling.status === "accepted"
                    ? "border border-green-600 text-green-600"
                    : carpooling.status === "pending"
                    ? "border border-yellow-600 text-yellow-600 "
                    : "border border-red-600 text-red-600"
                }  rounded-md p-2 capitalize`}
              >
                {carpooling.status}
              </div>
            </div>
            <h2>{format(carpooling.departure_day, "EEEE, MM-yyyy")}</h2>
            <h3>price: {carpooling.price}</h3>
            <h4>Number of Seats: {carpooling.number_of_seats}</h4>
            <h5>{carpooling.car}</h5>
            <h6>driver : {carpooling.driver_name}</h6>
            <div className="grid  ">
              <p>
                {carpooling.driver_name} Has accepted your request, pay to
                confirm your seat and start a conversation
              </p>
              <div className="justify-self-end flex gap-10">
                {carpooling.status === "confirmed" && (
                  <button
                    className="bg-red-700 text-white rounded-md p-2"
                    onClick={() => cancelBooking(carpooling)}
                  >
                    Cancel Booking
                  </button>
                )}
                {carpooling.status === "accepted" && (
                  <button
                    className="bg-green-700 text-white rounded-md p-2"
                    onClick={() => {
                      confirmBooking(carpooling);
                      Navigate(
                        "/chat/" + user_id + "/" + carpooling.publisher_id
                      );
                    }}
                  >
                    Pay
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CarpoolingHistory;
