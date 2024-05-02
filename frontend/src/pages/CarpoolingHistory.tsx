import { getBookedCarpooling } from "../api/methods";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { cancelBookingRequest, confirmBookingRequest } from "../api/methods";

const CarpoolingHistory = () => {
  const [bookedCarpooling, setBookedCarpooling] = useState([]);
  useEffect(() => {
    getBookedCarpooling(localStorage.getItem("id")).then((response: any) => {
      setBookedCarpooling(response);
    });
  }, []);

  const cancelBooking = async (carpooling: any) => {
    try {
      await cancelBookingRequest(carpooling);
    } catch (error) {
      console.log(error);
    }
  };

  const confirmBooking = async (carpooling: any) => {
    try {
      await confirmBookingRequest(carpooling);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {bookedCarpooling.map((carpooling: any) => {
        return (
          <div
            className="border border-gray-400 rounded-md p-2 my-4"
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
            <h3>{carpooling.price}</h3>
            <h4>{carpooling.seats}</h4>
            <h5>{carpooling.car}</h5>
            <h6>driver : {carpooling.driver_name}</h6>
            <div className="grid  ">
              <div className="justify-self-end flex gap-10">
                <button
                  className="bg-red-700 text-white rounded-md p-2"
                  onClick={() => cancelBooking(carpooling)}
                >
                  Cancel Booking
                </button>
                <button
                  className="bg-green-700 text-white rounded-md p-2"
                  onClick={() => confirmBooking(carpooling)}
                >
                  confirm Booking
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CarpoolingHistory;
