import { getBookedCarpooling } from "../api/methods";
import { useEffect, useState } from "react";
import { format } from "date-fns";

const CarpoolingHistory = () => {
  const [bookedCarpooling, setBookedCarpooling] = useState([]);
  useEffect(() => {
    getBookedCarpooling(localStorage.getItem("id")).then((response: any) => {
      setBookedCarpooling(response);
    });
  }, []);

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
                    ? "bg-green-600"
                    : carpooling.status === "pending"
                    ? "bg-yellow-600"
                    : "bg-red-600"
                } text-white rounded-md p-2 capitalize`}
              >
                {carpooling.status}
              </div>
            </div>
            <h2>{format(carpooling.departure_day, "EEEE, MM-yyyy")}</h2>
            <h3>{carpooling.price}</h3>
            <h4>{carpooling.seats}</h4>
            <h5>{carpooling.car}</h5>
            <h6>driver : {carpooling.driver_name}</h6>
          </div>
        );
      })}
    </div>
  );
};

export default CarpoolingHistory;
