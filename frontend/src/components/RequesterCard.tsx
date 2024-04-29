import { format } from "date-fns";
import { getSingleRequestInfo } from "../api/methods";
import { useEffect, useState } from "react";
import {
  acceptCarpoolingRequest,
  rejectCarpoolingRequest,
} from "../api/methods";

interface Props {
  requester_id: number;
  carpooling_id: number;
  handleClose: () => void;
}

function RequesterCard({ requester_id, carpooling_id, handleClose }: Props) {
  const [requestData, setRequestData] = useState({});
  useEffect(() => {
    getSingleRequestInfo(requester_id, carpooling_id)
      .then((response: any) => {
        console.log("s8f7sf7s89fs7fds7fds9 ", response);
        setRequestData(response);
      })
      .catch((error: any) => {
        console.log(error);
      });
  }, []);

  const acceptRequest = async () => {
    await acceptCarpoolingRequest(requestData)
      .then((response: any) => {
        alert(response.message);
      })
      .catch((error: any) => {
        alert(error);
      });
    handleClose();
  };

  const declineRequest = async () => {
    await rejectCarpoolingRequest(requestData)
      .then((response: any) => {})
      .catch((error: any) => {
        alert(error);
      });
    handleClose();
  };
  return (
    <div>
      {requestData.departure &&
      requestData.destination &&
      requestData.departure_day &&
      requestData.departure_time &&
      requestData.booker_name &&
      requestData.number_of_seats ? (
        <div className=" flex flex-col gap-5">
          <h1
            className="text-center text-2xl font-bold"
            style={{ color: "#4B5563" }}
          >
            Requester Card
          </h1>
          <div>
            {requestData.departure} to {requestData.destination}
          </div>
          <div>
            Date:
            {requestData.departure_day
              ? format(
                  new Date(requestData.departure_day),
                  "EEEE dd, MMMM yyyy"
                )
              : ""}
          </div>
          <div>Time: {requestData.departure_time}</div>
          <div>Booker Name: {requestData.booker_name}</div>
          <div>Number of seats: {requestData.number_of_seats}</div>
          <div className="flex justify-between items-center ">
            <button
              className="bg-green-700 text-white p-1 rounded-md cursor-pointer"
              type="button"
              onClick={acceptRequest}
            >
              Accept
            </button>
            <button
              className="bg-red-700 text-white p-1 rounded-md cursor-pointer"
              type="button"
              onClick={declineRequest}
            >
              Decline
            </button>
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}

export default RequesterCard;
