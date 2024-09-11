import { useEffect, useState } from "react";
import { getBookingRequest, acceptCarpoolingRequest } from "../api/methods";
import { socket } from "../socket/socket";
import { format } from "date-fns";

const CarpoolingRequests = () => {
  const [requests, setRequests] = useState([]);
  const user_id = localStorage.getItem("id");

  const getRequest = async (user_id: string | null) => {
    await getBookingRequest(user_id)
      .then((response: any) => {
        setRequests(response);
        console.log("notifs === ", response);
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getRequest(user_id);
  }, []);

  const acceptRequest = async (data: any) => {
    await acceptCarpoolingRequest(data)
      .then((response: any) => {
        alert('ácce')
        getRequest(user_id);
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  return (
    <div className="container p-3">
      {requests.map((request: any) => (
        <div key={request.id} className="border rounded-md p-3 my-2 shadow-md">
          <div className="text-xl flex justify-between">
            <h2>
              {request.departure} - {request.destination}
            </h2>
            <p>
              {format(request.departure_day, "EEEE, dd-MM-yyyy")} -{" "}
              {request.departure_time}
            </p>
          </div>
          <div className="flex items-end justify-between mt-2">
            <div className="text-l ">
              <p>Booker Name: {request.booker_name}</p>
              <p>Price: {request.price}MAD</p>
              <p>Requested Seats: {request.requested_seats}</p>
            </div>
          </div>
          {request.status !== "pending" ? (
            <div
              className={`${
                request.status === "accepted"
                  ? "bg-yellow-700"
                  : request.status === "confirmed"
                  ? "bg-green-700"
                  : "bg-red-700"
              } text-white p-1 rounded-md text-center`}
            >
              {request.status === "accepted"
                ? "Accepted"
                : request.status
                ? "Confirmed"
                : "Declined"}
            </div>
          ) : (
            <div className="flex justify-between">
              <button
                className="bg-green-700 text-white p-1 rounded-md cursor-pointer"
                type="button"
                onClick={() => acceptRequest(request)}
              >
                Accept2
              </button>
              <button
                className="bg-red-700 text-white p-1 rounded-md cursor-pointer"
                type="button"
              >
                Decline
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CarpoolingRequests;
