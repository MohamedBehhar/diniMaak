import React, { useEffect } from "react";
import SearchCarpooling from "../components/SearchCarpooling";
import { searchCarpooling, bookCarpooling, setReminder } from "../api/methods";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { format, set } from "date-fns";
import { url } from "../api/methods";
import { message } from "antd";
import { number } from "zod";

const AvailableCarpooling = () => {
  const [carpoolings, setCarpoolings] = useState([]);
  const [params] = useSearchParams();
  const [reminderValue, setReminderValue] = useState(false);
  const [data, setData] = useState({
    departure: "",
    destination: "",
    departure_day: "",
    number_of_seats: "",
    user_id: "",
  });

  useEffect(() => {}, []);

  const fetchCarpoolings = async () => {
    setData({
      departure: params.get("departure") || "",
      destination: params.get("destination") || "",
      departure_day: params.get("departure_day") || "",
      number_of_seats: params.get("number_of_seats") || "",
      user_id: localStorage.getItem("id") || "",
    });
    await searchCarpooling(data)
      .then((response: any) => {
        setCarpoolings(response);
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  const handelSetReminder = async () => {
    await setReminder(data)
      .then((response: any) => {
        console.log(response);
        message.success("Reminder set successfully");
      }).then(() => {
        navigate("/");
      })
      .catch((error: any) => {
        message.error("Error setting reminder");
      });
  };

  useEffect(() => {
    fetchCarpoolings();
  }, []);

  const navigate = useNavigate();

  const handelBookCarpooling = async (carpooling_id: string) => {
    const requester_id = localStorage.getItem("id");
    const requested_seats = params.get("number_of_seats");
    await bookCarpooling({ requester_id, carpooling_id, requested_seats })
      .then((response: any) => {
        navigate("/carpooling/history/" + requester_id);
      })
      .catch((error: any) => {
        alert("error booking carpooling");
      });
  };

  return (
    <div className="container p-3">
      <div className="p-5 w-full bg-cover bg-center">
        <h1 className=" text-5xl text-center p-10">Available Carpooling</h1>
      </div>
      <SearchCarpooling redirect={false} setCarpoolings={setCarpoolings} />

      {carpoolings && carpoolings.length > 0 ? (
        <div>
          {carpoolings.map((carpooling: any) => {
            return (
              <div
                key={carpooling.id}
                className="container  p-5 border rounded-md shadow-md my-2 flex flex-col gap-2 "
              >
                <div className="sm:text-xl font-bold text-gray-700 flex justify-between">
                  <h2>
                    {carpooling.departure} - {carpooling.destination}
                  </h2>
                  <p>
                    {format(carpooling.departure_day, "EEEE, dd-MM-yyyy")} -{" "}
                    {carpooling.departure_time}
                  </p>
                </div>
                <div className="flex  items-end justify-between mt-2">
                  <div className="flex sm:flex-row flex-col gap-6">
                    <div className="flex  items-center gap-2">
                      <img
                        src={`${url}${carpooling.profile_picture}`}
                        alt="d"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p>Driver: {carpooling.driver_name}</p>
                        <p>Rating: {carpooling.rating}</p>
                      </div>
                    </div>
                    <div className="flex  items-center gap-2">
                      <img
                        src={`${url}${carpooling.image}`}
                        alt="d"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p>Brand: {carpooling.brand}</p>
                        <p>Model: {carpooling.year}</p>
                      </div>
                    </div>
                    <div className="flex  items-center gap-2">
                      <img
                        src={`${url}${carpooling.image}`}
                        alt="d"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p>Price: {carpooling.price}MAD</p>
                        <p>Available Seats: {carpooling.available_seats}</p>
                      </div>
                    </div>
                  </div>
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded-md"
                    onClick={() => {
                      navigate(
                        "/carpooling-details/" +
                          carpooling.id +
                          "/" +
                          params.get("number_of_seats")
                      );
                    }}
                  >
                    Book
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center p-5">
          <h1
            className="text-2xl font-bold text-gray-700"
          >Oops!
         <br /> No carpooling available</h1>
         <p
          className="text-gray-500 font-semibold"
         >
          There is no carpooling available for the selected criteria for the moment, you can set a reminder to get notified when a carpooling is available.
         </p>
         <button
          className="bg-blue-500 text-white px-3 py-1 rounded-md"
          onClick={handelSetReminder}
          
         >
          Set A Reminder
         </button>
        </div>
      )}
    </div>
  );
};

export default AvailableCarpooling;
