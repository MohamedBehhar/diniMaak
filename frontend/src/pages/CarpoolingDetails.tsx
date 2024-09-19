import { useEffect, useState } from "react";
import { getCarpoolingById } from "../api/methods";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import { bookCarpooling } from "../api/methods";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import {
  FaCarSide,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaChair,
  FaCheckCircle,
  FaUser,
  FaPhone,
} from "react-icons/fa";
import { PiSeatbeltFill } from "react-icons/pi";

interface Carpooling {
  id: number;
  departure: string;
  destination: string;
  departure_day: string;
  departure_time: string;
  price: number;
  brand: string;
  year: number;
  number_of_seats: number;
  available_seats: number;
  driver_name: string;
  phone_number: string;
  status: string;
}

const CarpoolingDetails = () => {
  const [numberOfSeats, setNumberOfSeats] = useState(1);
  const { carpooling_id } = useParams();
  const [carpooling, setCarpooling] = useState({} as Carpooling);
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
      requested_seats: numberOfSeats,
    };
    try {
      await bookCarpooling(data);
      message.success("Carpooling booked successfully");
      navigate("/carpooling/history/" + localStorage.getItem("id"));
    } catch (error) {
      console.log(error.response);
      message.error(error.response.data.error).then(() => {
        navigate("/");
      });
    }
  };

  return (
    <div className="min-h-screen flex justify-center p-4 mt-4">
      {carpooling ? (
        <div
          className="max-w-4xl w-full bg-white shadow-lg rounded-lg overflow-hidden h-fit
        "
        >
          <div className="p-6 bg-gray-100 ">
            <div className="flex ">
              <div className="flex items-center gap-3 text-cyan-700 mb-6 flex-1">
                <FaCalendarAlt className="text-4xl" />
                <div className="text-4xl font-semibold">
                  {carpooling.departure_day &&
                    format(
                      new Date(carpooling.departure_day),
                      "EEEE dd MMMM yyyy"
                    )}
                </div>
              </div>
              {/* <div
                className={
                  "h-fit p-2 rounded-md text-cyan-700 text-xl capitalize " +
                  (carpooling.status === "pending"
                    ? "border border-yellow-500 text-yellow-500"
                    : carpooling.status === "completed"
                    ? "border border-green-500 text-green-500"
                    : "border border-red-500 text-red-500")
                }
              >
                {carpooling.status}
              </div> */}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start">
                <FaMapMarkerAlt className="text-2xl text-cyan-700 mr-2" />
                <div className="">
                  <h1 className="text-xl font-semibold ">
                    {carpooling.departure}
                  </h1>
                  <h1>
                    <FaClock className="inline mr-1" />
                    {carpooling.departure_time &&
                      carpooling.departure_time.split(":")[0] +
                        ":" +
                        carpooling.departure_time.split(":")[1]}
                  </h1>
                </div>
              </div>
              <div className="flex items-center">
                <FaMapMarkerAlt className="text-2xl text-cyan-700 mr-2" />
                <div>
                  <h1 className="text-xl font-semibold">
                    {carpooling.destination}
                  </h1>
                </div>
              </div>

              <div className="flex items-center">
                <FaMoneyBillWave className="text-2xl text-cyan-700 mr-2" />
                <h1 className="text-xl font-semibold">{carpooling.price} €</h1>
              </div>
              <div className="flex items-center">
                <FaCarSide className="text-2xl text-cyan-700 mr-2" />
                <div>
                  <h1 className="text-xl font-semibold">{carpooling.brand}</h1>
                  <p>{carpooling.year}</p>
                </div>
              </div>

              <div className="flex items-center">
                <FaChair className="text-2xl text-cyan-700 mr-2" />
                <div>
                  <p className="m-0">Number of seats:</p>
                  <h1 className="text-xl font-semibold">
                    {carpooling.number_of_seats}
                  </h1>
                </div>
              </div>
              <div className="flex items-center">
                <FaCheckCircle className="text-2xl text-cyan-700 mr-2" />
                <div>
                  <p className="m-0">Available Seats:</p>
                  <h1 className="text-xl font-semibold">
                    {carpooling.available_seats}
                  </h1>
                </div>
              </div>
              <div className="flex items-center mb-4">
                <FaUser className="text-2xl text-cyan-700 mr-2" />
                <div>
                  <p className="m-0">Driver:</p>
                  <h1 className="text-xl font-semibold capitalize">
                    {carpooling.driver_name}
                  </h1>
                </div>
              </div>
              <div className="flex items-center mb-4">
                <FaPhone className="text-2xl text-cyan-700 mr-2" />
                <div>
                  <p className="m-0">Phone Number:</p>
                  <h1 className="text-xl font-semibold">
                    {carpooling.phone_number}
                  </h1>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white border-t">
            <p>
              Number of seats you want to book:{" "}
              <span className="text-xl font-semibold">{numberOfSeats}</span>
            </p>
            {
              // creat an array of length 4 and map over it to create 4 buttons
              Array.from({ length: carpooling.available_seats }).map(
                (_, index) => (
                  <button
                    type="button"
                    key={index}
                    onClick={() => {
                      setNumberOfSeats(index + 1);
                    }}
                    className={`${
                      numberOfSeats >= index + 1
                        ? "bg-cyan-700 text-white"
                        : "bg-gray-300"
                    } border-none p-2 mx-[2px] text-xl rounded-md`}
                  >
                    <PiSeatbeltFill />
                  </button>
                )
              )
            }
            <div className="text-center">
              <button
                className={
                  "ant-btn min-w-[300px] p-4" +
                  (carpooling.status !== "available" ? " hidden" : "")
                }
                onClick={handleBook}
              >
                Book
              </button>
            </div>
          </div>
        </div>
      ) : (
        <h1 className="text-center text-2xl text-white">Loading...</h1>
      )}
    </div>
  );
};

export default CarpoolingDetails;
