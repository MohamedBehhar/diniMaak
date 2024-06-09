import { useEffect, useState } from "react";
import { getCarpoolingById } from "../api/methods";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import { bookCarpooling } from "../api/methods";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

const CarpoolingDetails = () => {
  const { carpooling_id, number_of_seats } = useParams();
  const [carpooling, setCarpooling] = useState({});
  useEffect(() => {
    getCarpoolingById(carpooling_id).then((response: any) => {
      setCarpooling(response);
    });
  }, []);
  const navigate = useNavigate();

  const handleBook = async () => {
    const data = {
      requester_id: localStorage.getItem("id"),
      carpooling_id: carpooling_id,
      requested_seats: number_of_seats,
    };
    console.log('---- =- -= ',data);
    try {
      await bookCarpooling(data);
      message.success("Carpooling booked successfully");
      navigate("/carpooling/history/" + localStorage.getItem("id"));
    } catch (error) {
      alert("error booking carpooling");
    }
  };

  return (
    <>
      {carpooling ? (
        <div className="flex flex-col gap-3 text-xl  items-center justify-center ">

          <div className="mt-5">
            <div className="text-4xl text-cyan-700 font-semibold my-5">
              {carpooling.departure_day && format(new Date(carpooling.departure_day), "EEEE dd MMMM yyyy")}
            </div>
            <div className="mb-2">
              <h1 className="text-2xl font-semibold ">
                {carpooling.departure}
              </h1>
              <h1>
                {
                  carpooling.departure_time && (
                  carpooling.departure_time.split(":")[0] + ":" + carpooling.departure_time.split(":")[1])
                }
              </h1>
            </div>
            <div className="mb-2">
              <h1 className="text-2xl font-semibold ">
                {carpooling.destination}
              </h1>
            </div>

            <div className="mb-2">
              <h1 className="text-2xl font-semibold ">
                {carpooling.price} €
              </h1>
            </div>

            <div className="mb-2">
              <h1 className="text-2xl font-semibold ">
                {carpooling.brand}
              </h1>
              <p>
                {carpooling.year} 
              </p>
            </div>


            <div className="mb-2 flex my-5 gap-2">
              <p className="m-0">Number of seats: </p>
              <h1 className="text-2xl font-semibold ">
                {carpooling.number_of_seats}
              </h1>
            </div>
            <div className="flex gap-2 my-5 border">
              <p className="m-0">Available Seats</p>
              <h1 className="text-2xl font-semibold ">
                {carpooling.available_seats}
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
