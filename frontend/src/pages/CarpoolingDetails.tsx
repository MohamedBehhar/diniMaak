import { useEffect, useState } from "react";
import { getCarpoolingById } from "../api/methods";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import { bookCarpooling } from "../api/methods";

const CarpoolingDetails = () => {
  const { carpooling_id } = useParams();
  const [carpooling, setCarpooling] = useState({});
  useEffect(() => {
    getCarpoolingById(carpooling_id).then((response: any) => {
      setCarpooling(response);
    });
  }, []);

  const handleBook = async () => {
    const data = {
      booker_id: localStorage.getItem("id"),
      carpooling_id: carpooling_id,
      numberOfSeats: carpooling.number_of_seats,
    };
    try {
      await bookCarpooling(data);
      alert("carpooling booked");
    } catch (error) {
      alert("error booking carpooling");
    }
  }

  return (
    <>
      {carpooling ? (
        <div className="flex flex-col gap-3 text-xl  items-center justify-center ">
          <h1>carpooling details</h1>
          <div>
            <div className="mb-2">
              <p className="m-0">Departure: </p>
              <h1 className="text-2xl font-semibold ">
                {carpooling.departure}
              </h1>
            </div>
            <div className="mb-2">
              <p className="m-0">Destination: </p>
              <h1 className="text-2xl font-semibold ">
                {carpooling.destination}
              </h1>
            </div>
            {/* <div className="mb-2">
              <p className="m-0">Date: </p>
              <h1 className="text-2xl font-semibold ">
                {format(new Date(carpooling.departure_day), "EEEE, MM, yyyy")}
              </h1>
            </div>
            <div className="mb-2">
              <p className="m-0">Time: </p>
              <h1 className="text-2xl font-semibold ">
                {carpooling.departure_time}
              </h1>
            </div> */}

            <div className="mb-2">
              <p className="m-0">Number of seats: </p>
              <h1 className="text-2xl font-semibold ">
                {carpooling.number_of_seats}
              </h1>
            </div>
          </div>
          <button
            className="bg-blue-500 text-white p-2 rounded-md"
            onClick={handleBook}
          >
            Book
          </button>
        </div>
      ) : (
        <h1>loading...</h1>
      )}
    </>
  );
};

export default CarpoolingDetails;
