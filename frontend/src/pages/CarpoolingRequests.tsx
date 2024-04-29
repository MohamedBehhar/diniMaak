import { useEffect, useState } from "react";
import { getBookingRequest } from "../api/methods";

const CarpoolingRequests = () => {
  const [requests, setRequests] = useState([]);
  const user_id = localStorage.getItem("id");
  useEffect(() => {
    getBookingRequest(user_id)
      .then((response: any) => {
        setRequests(response);
        console.log("notifs === ", response);
      })
      .catch((error: any) => {
        console.log(error);
      });
  }, []);
  return (
    <div>
      {requests.map((request: any) => (
        <div key={request.id}>
          <p>{request.id}</p>
          <p>{request.departure}</p>
          <p>{request.destination}</p>
          <p>{request.departure_day}</p>
          <p>{request.number_of_seats}</p>
          <div>
            <button
              className="bg-green-700 text-white p-1 rounded-md cursor-pointer"
              type="button"
            >
              Accept
            </button>
            <button
              className="bg-red-700 text-white p-1 rounded-md cursor-pointer"
              type="button"
            >
              Decline
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CarpoolingRequests;
