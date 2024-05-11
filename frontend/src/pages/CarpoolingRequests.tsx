import { useEffect, useState } from "react";
import { getBookingRequest, acceptCarpoolingRequest } from "../api/methods";

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

  const acceptRequest = async (data: any) => {
    await acceptCarpoolingRequest(data)
      .then((response: any) => {
        console.log("request accepted");
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  return (
    <div className="container p-3">
      {requests.map((request: any) => (
        <div key={request.id} className="border rounded-md p-3 my-2 shadow-md">
          <p>
            {request.departure} to {request.destination}
          </p>
          <p></p>
          <p>{request.booker_name}</p>
          <p>{request.number_of_seats}</p>
          {request.status !== "pending" ? (
            ""
          ) : (
            <div className="flex justify-between">
              <button
                className="bg-green-700 text-white p-1 rounded-md cursor-pointer"
                type="button"
                onClick={() => acceptRequest(request)}
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
          )}
        </div>
      ))}
    </div>
  );
};

export default CarpoolingRequests;
