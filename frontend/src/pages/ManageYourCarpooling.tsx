import { getCarpoolingByPublisherId, deleteCarpooling } from "../api/methods";
import { useEffect, useState } from "react";
import { PiSeatbeltFill } from "react-icons/pi";
import MyModal from "../components/MyModal";
import { acceptCarpoolingRequest, url } from "../api/methods";
import { socket } from "../socket/socket";
import { format } from "date-fns";
import { IoMdStar } from "react-icons/io";
import { Link } from "react-router-dom";
import { IoHome } from "react-icons/io5";
import { IoIosTime } from "react-icons/io";
import { GiPositionMarker } from "react-icons/gi";
import { PiSeatbeltBold } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import { IoChatboxEllipses } from "react-icons/io5";
import { MdDeleteForever } from "react-icons/md";
import type { PopconfirmProps } from "antd";
import { Button, message, Popconfirm } from "antd";
import { concatinatePictureUrl } from "../utils/helperFunctions";
import DefaultUserImage from "../assets/user.png";

const ManageYourCarpooling = () => {
  const [carpoolings, setCarpoolings] = useState([]);
  const user_id = localStorage.getItem("id");
  const navigate = useNavigate();

  const confirm = async (id: number) => {
    console.log(id);
    await deleteCarpooling(id)
      .then((response: any) => {
        message.success("Carpooling deleted successfully");
        fetchCarpooling(user_id);
      })
      .catch((error: any) => {
        message.error("Error while deleting carpooling");
      });
  };

  const fetchCarpooling = async (id: any) => {
    await getCarpoolingByPublisherId(id)
      .then((response) => {
        setCarpoolings(response);
      })
      .catch((error) => {
        message.error("Error while fetching carpoolings");
      });
  };

  const acceptRequest = async (data: any) => {
    await acceptCarpoolingRequest(data)
      .then((response: any) => {
        fetchCarpooling(user_id);
        setOpen(false);
        message.success("Request accepted");
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchCarpooling(user_id);
    socket.on("bookingConfirmed", () => {
      fetchCarpooling(user_id);
    });
    socket.on("newBookingRequest", () => {
      fetchCarpooling(user_id);
    });
  }, []);

  const [open, setOpen] = useState(false);
  const showModal = () => {
    setOpen(true);
  };

  const iconStyle = "text-2xl text-cyan-600 ";

  return (
    <div className="p-2">
      <h1 className="text-2xl text-center p-5 font-semibold text-gray-800">
        Manage your carpooling
      </h1>
      {carpoolings && carpoolings.length > 0 ? (
        <div>
          {carpoolings.map((carpooling: any, index: number) => {
            return (
              <div
                key={index}
                className="container flex w-full justify-between items-center p-5 border rounded-md shadow-md my-2"
              >
                <div className="w-full">
                  <header className="flex flex-col sm:flex-row justify-between items-center w-full  mb-3  text-xl gap-2">
                    <h2 className=" flex gap-2 ">
                      <IoHome className={iconStyle} />
                      {carpooling.departure}{" "}
                      <GiPositionMarker className={iconStyle} />
                      {carpooling.destination}
                    </h2>
                    <h2 className="flex gap-2">
                      <IoIosTime className={iconStyle} />
                      {format(
                        carpooling.departure_day,
                        "EEEE, dd-MM-yyyy"
                      )} -{" "}
                      {carpooling.departure_time
                        .split(":")
                        .slice(0, 2)
                        .join(":")}
                    </h2>
                    <div>
                      <h2 className="flex gap-2">
                        <PiSeatbeltBold className={iconStyle} />
                        Available seats : {carpooling.available_seats}
                      </h2>
                    </div>
                    <Popconfirm
                      title="Delete this carpooling?"
                      description="Are you sure to delete this carpooling?"
                      onConfirm={() => confirm(carpooling.id)}
                      onCancel={() => {}}
                      okText="Yes"
                      cancelText="No"
                    >
                      <MdDeleteForever className="text-cyan-700 text-3xl cursor-pointer hover:text-red-400" />
                    </Popconfirm>
                  </header>
                  <div className="request-avaialable-seats sm:flex  items-center gap-2">
                    <h1 className="text-xl text-cyan-900">
                      Confirmed Passengers :{" "}
                    </h1>
                    <div className="flex gap-2 wrap ">
                      {carpooling.confirmed_requests.map(
                        (request: any, index: number) => {
                          return (
                            <div
                              className="flex items-center gap-4 border min-w-[150px] max-w-[250px] p-1 rounded-md"
                              key={index}
                            >
                              <div className="w-12 h-12 bg-gray-300 rounded-full">
                                <img
                                  src={`${url}${request.profile_picture}`}
                                  onError={(e: any) => {
                                    e.target.onerror = null;
                                    e.target.src = DefaultUserImage;
                                  }}
                                  alt=""
                                  className="w-12 h-12 rounded-full object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <p>{request.username}</p>
                                <div className="flex gap-3  w-full ">
                                  <div className="flex items-center">
                                    <PiSeatbeltFill className="text-cyan-500" />
                                    <p>{request.requested_seats}</p>
                                  </div>
                                  <div className="rating flex ">
                                    <IoMdStar
                                      className="text-yellow-500"
                                      size={20}
                                    />
                                    <p>{request.rating}</p>
                                  </div>
                                  <IoChatboxEllipses
                                    className="text-cyan-600"
                                    onClick={() =>
                                      navigate(
                                        "/chat/" +
                                          user_id +
                                          "/" +
                                          request.requester_id
                                      )
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>
                  <div className="info flex flex-col sm:flex-row gap-2 mt-2 ">
                    {carpooling.requests_infos.length > 0 && (
                      <div className="">
                        <h1 className="text-xl   ">Requests : </h1>
                        <div className="flex items-center gap-5 ">
                          {carpooling.requests_infos.map((request: any) => {
                            return (
                              <MyModal
                                open={open}
                                showModal={showModal}
                                onOk={() => acceptRequest(request)}
                                onCancel={() => setOpen(false)}
                                key={request.id}
                                data={request}
                              >
                                <div className="flex gap-2 sm:flex-row flex-col hover:scale-105 transition-all ease-in-out duration-300 cursor-pointer">
                                  <div
                                    key={request.id}
                                    className="flex items-center gap-1 border max-w-[150px] p-1 rounded-md"
                                  >
                                    <div className="w-12 h-12 bg-gray-300 rounded-full">
                                      <img
                                        src={`${url}${request.profile_picture}`}
                                        onError={(e: any) => {
                                          e.target.onerror = null;
                                          e.target.src = DefaultUserImage;
                                        }}
                                        alt=""
                                        className="w-12 h-12 rounded-full object-cover"
                                      />
                                    </div>
                                    <div className="flex-1">
                                      <p>{request.username}</p>
                                      <div className="flex gap-3  w-full ">
                                        <div className="flex items-center">
                                          <PiSeatbeltFill className="text-cyan-500" />
                                          <p>{request.requested_seats}</p>
                                        </div>
                                        <div className="rating flex ">
                                          <IoMdStar
                                            className="text-yellow-500"
                                            size={20}
                                          />
                                          <p>{request.rating}</p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </MyModal>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center p-5">
          <h1 className="text-2xl">You have no carpooling</h1>
          <h2 className="text-lg">
            Share your ride with other people and make money
          </h2>
          <h3>Start by posting your carpooling</h3>
          <h4>Click the button below</h4>
        </div>
      )}
      <div className="flex justify-center items-center w-full p-5">
        <Link
          to="/post-carpooling"
          className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded mx-auto mt-4"
          type="button"
        >
          Post a Carpooling
        </Link>
      </div>
    </div>
  );
};

export default ManageYourCarpooling;
