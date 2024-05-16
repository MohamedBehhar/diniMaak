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
import {  DatePicker, TimePicker, Slider, message } from "antd";
import SearchCities from "../components/SearchCities";
import dayjs from "dayjs";
import { creatCarpooling } from "../api/methods";
import { format } from "date-fns";
import AddCar from "../components/AddCar";
import { useNavigate } from "react-router-dom";
import { addCar, getCarByUserId, test } from "../api/methods";

const CreatCarPooling = () => {
  const [stepNumber, setStepNumber] = useState(0);
  const steps = [
    {
      title: "Car Information",
      icon: <FaCar />,
    },
    {
      title: "Departure & Destination",
      icon: <MdDepartureBoard />,
    },
    {
      title: "Date & Time",
      icon: <BsCalendarDate />,
    },
    {
      title: "Places & Price",
      icon: <PiSeatbeltBold />,
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
  const [car_id, setCar_id] = useState(0);
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

  // useEffect(() => {
  //   if (data.departure && data.destination) {
  //     setStepNumber(2);
  //   }
  // }, [data]);

  const Navigate = useNavigate();
  const handleCreatCarpooling = async () => {
    await creatCarpooling(data)
      .then((response) => {
        message.success("Carpooling created successfully");
        Navigate(
          "/carpooling/published-carpooling/" + localStorage.getItem("id")
        );
      })
      .catch((error) => {
        message.error("Error creating carpooling");
      });
  };

  useEffect(() => { 
    test();
  }, []);

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
      >
        {stepNumber}
        {stepNumber == 0 && (
          <div className="w-full h-[300px]">
            <AddCar increment={increament}
              setCar_id={(id: number) => {
                setCar_id(id);
                setData({ ...data, car_id: id });
              }}
            />
          </div>
        )}
        {stepNumber == 1 && (
          <div>
            <div className="flex flex-col sm:flex-row gap-5">
              <div className="search flex flex-col flex-1 gap-10 sm:gap-0 justify-evenly items-center">
                <div className="w-[300px] ">
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
                  <SearchCities
                    setChoosedCity={(city: string) => {
                      setData({ ...data, destination: city });
                    }}
                    placeholder="Destination"
                    icon={<MdOutlinePlace className="text-cyan-700 text-xl" />}
                    defaultValue={data.destination}
                  />
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
          <div className="flex flex-col sm:flex-row gap-5">
            <div className="search flex flex-col flex-1 gap-10 sm:gap-0 justify-evenly items-center">
              <div className="w-[300px] ">
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
            <div className="svg flex-1">
              <img
                src={postCarpooling}
                alt=""
                width={400}
                className="mx-auto mt-10 max-w-[100%]"
              />
            </div>
          </div>
        )}
        {stepNumber == 3 && (
          <div className="flex flex-col sm:flex-row gap-5">
            <div className="search flex flex-col flex-1 gap-10 sm:gap-0 justify-evenly items-center">
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
                <div className="text-center">{data.number_of_seats} Places</div>
              </div>
              <div className="w-[300px]">
                <Slider
                  defaultValue={0}
                  max={100}
                  min={0}
                  onChange={(value) => {
                    setData({ ...data, price: value });
                  }}
                  value={data.price}
                />

                <div className="text-center">{data.price} MAD</div>
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
        )}
        {stepNumber == 4 && (
          <div>
            <h1>Confirmation</h1>
            <div className=" flex  gap-5 items-center justify-center relative">
              <button
                className="btn bg-gray-800 text-white absolute top-0 right-0"
                onClick={() => setModify(!modify)}
              >
                Modify
              </button>
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
            <button
              className="btn mt-5 bg-cyan-700 py-2  px-4 rounded-md  text-xl text-white mx-auto"
              onClick={handleCreatCarpooling}
            >
              Confirm
            </button>
          </div>
        )}
      </Steper>
    </div>
  );
};

export default CreatCarPooling;
