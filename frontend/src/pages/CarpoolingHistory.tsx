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
    <div className="container p-3 mt-8">
      {bookedCarpooling.map((carpooling: any) => {
        return (
          <div
            className="border border-gray-300 shadow-sm rounded-lg p-4 mt-4"
            key={carpooling.id}
          >
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-4">

              <h1 className="text-lg font-semibold">
                {carpooling.departure} to {carpooling.destination}
              </h1>
              <h2 className="text-md text-gray-600">
                {format(carpooling.departure_day, "EEEE, MM-yyyy")}
              </h2>
              </div>

              <div
                className={`${
                  carpooling.status === "confirmed"
                    ? "border border-green-500 text-green-500"
                    : carpooling.status === "pending"
                    ? "border border-yellow-500 text-yellow-500"
                    : "border border-red-500 text-red-500"
                } rounded-md px-3 py-1 text-sm capitalize font-medium`}
              >
                {carpooling.status}
              </div>
            </div>

            <div className="text-gray-600 mb-3 text-md font-semibold">
              <h3 className="">
                Price: {carpooling.price}
              </h3>
              <h4 className="text-md">
                Seats Available: {carpooling.number_of_seats}
              </h4>
              <h5 className="text-md italic">{carpooling.car}</h5>
              <h6 className="text-md">Driver: {carpooling.driver_name}</h6>
            </div>


            <div className="flex justify-end gap-4">
              {carpooling.status === "confirmed" && (
                <button
                  className="bg-red-600 hover:bg-red-700 text-white font-medium rounded-md px-4 py-2"
                  onClick={() => cancelBooking(carpooling)}
                >
                  Cancel Booking
                </button>
              )}
              {carpooling.status === "accepted" && (
                <button
                  className="bg-green-600 hover:bg-green-700 text-white font-medium rounded-md px-4 py-2"
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
        );
      })}
    </div>
  );
};

export default CarpoolingHistory;
