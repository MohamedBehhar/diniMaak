import Steper from "../components/Steper";
import { useEffect, useState } from "react";
import { MdDepartureBoard, MdOutlinePlace } from "react-icons/md";
import { BsCalendarDate } from "react-icons/bs";
import { PiSeatbeltBold } from "react-icons/pi";
import { MdAttachMoney } from "react-icons/md";
import { FaCar } from "react-icons/fa6";
import { GiConfirmed } from "react-icons/gi";
import postCarpooling from "../assets/postCarpooling.svg";
import { PiSeatbeltFill } from "react-icons/pi";
import { DatePicker, TimePicker, Slider, message } from "antd";
import SearchCities from "../components/SearchCities";
import dayjs from "dayjs";
import { creatCarpooling } from "../api/methods";
import { format } from "date-fns";
import AddCar from "../components/AddCar";
import { useNavigate } from "react-router-dom";
import { addCar, getCarByUserId } from "../api/methods";
import { FaRegEdit } from "react-icons/fa";

const CreatCarPooling = () => {
  const [stepNumber, setStepNumber] = useState(0);
  const steps = [
    {
      title: "Car Information",
      icon: <FaCar />,
    },
    {
      title: "CarPool Information",
      icon: <MdDepartureBoard />,
    },
    {
      title: "Confirm",
      icon: <GiConfirmed />,
    },
  ];
  const increament = () => {
    if (stepNumber < steps.length - 1) setStepNumber(stepNumber + 1);
  };
  const decreament = () => {
    if (stepNumber > 0) setStepNumber(stepNumber - 1);
  };

  const [modify, setModify] = useState(false);
  const [car_id, setCar_id] = useState("");
  const [data, setData] = useState({
    departure: "",
    destination: "",
    departure_day: dayjs().endOf("day").format("YYYY-MM-DD"),
    departure_time: dayjs().format("HH:mm"),
    number_of_seats: 1,
    price: 0,
    user_id: localStorage.getItem("id"),
    car_id: car_id,
  });
  const showNextButton = [car_id ? true : false, true, false];

  const Navigate = useNavigate();
  const handleCreatCarpooling = async () => {
    console.log("909090 ", data);
    await creatCarpooling(data)
      .then((response) => {
        message.success("Carpooling created successfully");
        Navigate(
          "/carpooling/published-carpooling/" + localStorage.getItem("id")
        );
      })
      .catch((error) => {
        message.error(
          "An error occured while creating the carpooling, please try again later"
        );
      });
  };

  return (
    <div className=" ">
      <h1 className="text-3xl text-center font-bold p-10">
        Create a Carpooling
      </h1>
      <Steper
        steps={steps}
        stepNumber={stepNumber}
        increament={increament}
        decreament={decreament}
        showNext={showNextButton}
      >
        {stepNumber == 0 && (
          <div className="w-full h-[300px]">
            <AddCar
              increment={increament}
              setCar_id={(id: string) => {
                setCar_id(id);
                setData({ ...data, car_id: id });
              }}
              car_id={car_id}
            />
          </div>
        )}
        {stepNumber == 1 && (
          <div>
            <div className="flex flex-col lg:flex-row items-center gap-5 mb-3">
              <div className="search flex flex-col flex-1 gap-10 sm:gap-0 justify-evenly items-center">
                <div className="flex flex-col sm:flex-row w-full gap-5  sm:pb-5">
                  <div className="w-[300px] ">
                    <h1 className="text-cyan-700 text-xl">Departure</h1>
                    <SearchCities
                      setChoosedCity={(city: string) => {
                        setData({ ...data, departure: city });
                      }}
                      placeholder="Departure"
                      icon={
                        <MdDepartureBoard className="text-cyan-700 text-xl" />
                      }
                      defaultValue={data.departure}
                    />
                  </div>
                  <div className="w-[300px]">
                    <h1 className="text-cyan-700 text-xl">Destination</h1>
                    <SearchCities
                      setChoosedCity={(city: string) => {
                        setData({ ...data, destination: city });
                      }}
                      placeholder="Destination"
                      icon={
                        <MdOutlinePlace className="text-cyan-700 text-xl" />
                      }
                      defaultValue={data.destination}
                    />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row w-full gap-5  sm:py-5">
                  <div className="w-[300px] ">
                    <h1 className="text-cyan-700 text-xl">Date</h1>
                    <DatePicker
                      className="w-full"
                      size="large"
                      onChange={(date) => {
                        setData({
                          ...data,
                          departure_day: date.endOf("day").format("YYYY-MM-DD"),
                        });
                      }}
                      defaultValue={dayjs().endOf("day")}
                      disabledDate={
                        // disable past dates starting from before today
                        (current) => {
                          return current && current <= dayjs().endOf("day");
                        }
                      }
                    />
                  </div>
                  <div className="w-[300px] ">
                    <h1 className="text-cyan-700 text-xl">Time</h1>
                    <TimePicker
                      size="large"
                      className="w-full"
                      onChange={(time) => {
                        setData({
                          ...data,
                          departure_time: time.format("HH:mm"),
                        });
                      }}
                      defaultOpenValue={dayjs("00:00", "HH:mm")}
                      value={dayjs(data.departure_time, "HH:mm")}
                      minuteStep={5}
                      format={"HH:mm"}
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row w-full gap-5  sm:py-5">
                  <div className="w-[300px]  ">
                    <h1 className="text-xl text-cyan-700">Places</h1>
                    <div className="flex gap-3 items-center">
                      {
                        // creat an array of length 4 and map over it to create 4 buttons
                        Array.from({ length: 4 }).map((_, index) => (
                          <button
                            type="button"
                            key={index}
                            onClick={() => {
                              setData({ ...data, number_of_seats: index + 1 });
                            }}
                            className={`${
                              data.number_of_seats >= index + 1
                                ? "bg-cyan-700 text-white"
                                : "bg-gray-300"
                            } border-none p-2 mx-[2px] text-xl rounded-md`}
                          >
                            <PiSeatbeltFill />
                          </button>
                        ))
                      }
                      <div className="text-center">
                        {data.number_of_seats} Places
                      </div>
                    </div>
                  </div>
                  <div className="w-[300px] ">
                    <h1 className="text-xl text-cyan-700">Price</h1>
                    <div className="flex items-center gap-2">
                      <Slider
                        defaultValue={0}
                        max={100}
                        min={0}
                        onChange={(value) => {
                          setData({ ...data, price: value });
                        }}
                        value={data.price}
                        className="flex-1 "
                      />
                      <div className="text-center">{data.price} MAD</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="svg flex-1">
                <img
                  src={postCarpooling}
                  alt=""
                  width={400}
                  className="mx-auto mt-10 max-w-[100%]"
                />
              </div>
            </div>
          </div>
        )}

        {stepNumber == 2 && (
          <div className="relative">
            <div className=" flex  gap-5 items-center justify-center relative">
              <FaRegEdit
                className="absolute top-0 right-0 primary cursor-pointer font-semibold text-2xl text-cyan-800"
                onClick={() => setModify(!modify)}
              />
              <div className="left flex flex-col  gap-5  text-balance ">
                <h1 className="text-2xl font-bold text-cyan-700 ">
                  Departure:{" "}
                </h1>
                <h1 className="text-2xl font-bold text-cyan-700">
                  Destination:{" "}
                </h1>
                <h1 className="text-2xl font-bold text-cyan-700">Date : </h1>
                <h1 className="text-2xl font-bold text-cyan-700">Time: </h1>
                <h1 className="text-2xl font-bold text-cyan-700">
                  Number of Places:{" "}
                </h1>
                <h1 className="text-2xl font-bold text-cyan-700">Price: </h1>
              </div>
              <div className="right  flex flex-col gap-5">
                <p className="text-2xl font-bold text-gray-800">
                  {modify ? (
                    <SearchCities
                      setChoosedCity={(city: string) => {
                        setData({ ...data, departure: city });
                      }}
                      placeholder="Departure"
                      icon={
                        <MdDepartureBoard className="text-cyan-700 text-xl" />
                      }
                      defaultValue={data.departure}
                    />
                  ) : (
                    data.departure
                  )}
                </p>

                <p className="text-2xl font-bold text-gray-800">
                  {modify ? (
                    <SearchCities
                      setChoosedCity={(city: string) => {
                        setData({ ...data, destination: city });
                      }}
                      placeholder="Destination"
                      icon={
                        <MdOutlinePlace className="text-cyan-700 text-xl" />
                      }
                      defaultValue={data.destination}
                    />
                  ) : (
                    data.destination
                  )}
                </p>

                <p className="text-2xl font-bold text-gray-800">
                  {modify ? (
                    <DatePicker
                      className="w-full"
                      size="large"
                      onChange={(date) => {
                        setData({
                          ...data,
                          departure_day: date.endOf("day").format("YYYY-MM-DD"),
                        });
                      }}
                      defaultValue={dayjs().endOf("day")}
                      disabledDate={
                        // disable past dates starting from before today
                        (current) => {
                          return current && current <= dayjs().endOf("day");
                        }
                      }
                    />
                  ) : (
                    data.departure_day
                  )}
                </p>

                <p className="text-2xl font-bold text-gray-800">
                  {modify ? (
                    <TimePicker
                      size="large"
                      className="w-full"
                      onChange={(time) => {
                        setData({
                          ...data,
                          departure_time: time.format("HH:mm"),
                        });
                      }}
                      defaultOpenValue={dayjs("00:00", "HH:mm")}
                      value={dayjs(data.departure_time, "HH:mm")}
                      minuteStep={5}
                      format={"HH:mm"}
                    />
                  ) : (
                    data.departure_time
                  )}
                </p>

                <p className="text-2xl font-bold text-gray-800">
                  {modify ? (
                    <div className="w-[300px]  flex justify-between items-center">
                      {
                        // creat an array of length 4 and map over it to create 4 buttons
                        Array.from({ length: 4 }).map((_, index) => (
                          <button
                            type="button"
                            key={index}
                            onClick={() => {
                              setData({ ...data, number_of_seats: index + 1 });
                            }}
                            className={`${
                              data.number_of_seats >= index + 1
                                ? "bg-cyan-700 text-white"
                                : "bg-gray-300"
                            } border-none p-2 mx-[2px] text-xl rounded-md`}
                          >
                            <PiSeatbeltFill />
                          </button>
                        ))
                      }
                      <div className="text-center">
                        {data.number_of_seats} Places
                      </div>
                    </div>
                  ) : (
                    data.number_of_seats
                  )}
                </p>
                <p className="text-2xl font-bold text-gray-800">
                  {modify ? (
                    <Slider
                      defaultValue={0}
                      max={100}
                      min={0}
                      onChange={(value) => {
                        setData({ ...data, price: value });
                      }}
                      value={data.price}
                    />
                  ) : (
                    data.price
                  )}
                </p>
              </div>
            </div>
            <div className="flex justify-center items-center gap-5 ">
              <button
                className="btn mt-5 bg-cyan-700 py-2  px-4 rounded-md  text-xl text-white mx-auto"
                onClick={handleCreatCarpooling}
              >
                Confirm
              </button>
            </div>
          </div>
        )}
      </Steper>
    </div>
  );
};

export default CreatCarPooling;
