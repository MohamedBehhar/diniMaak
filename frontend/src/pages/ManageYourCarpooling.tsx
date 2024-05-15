import { getCarpoolingByPublisherId } from "../api/methods";
import { useEffect, useState } from "react";
import { PiSeatbeltFill } from "react-icons/pi";
import MyModal from "../components/MyModal";
import { acceptCarpoolingRequest } from "../api/methods";
import { message } from "antd";
import { socket } from "../socket/socket";
import { format } from "date-fns";
import { IoMdStar } from "react-icons/io";
import { Link } from "react-router-dom";

const ManageYourCarpooling = () => {
  const [carpoolings, setCarpoolings] = useState([]);
  const user_id = localStorage.getItem("id");

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

  return (
    <div className="p-2">
      <h1 className="text-2xl text-center p-5">Manage your carpooling</h1>
      {carpoolings && carpoolings.length > 0 ? (
        <div>
          {carpoolings.map((carpooling: any) => {
            return (
              <div
                key={carpooling.id}
                className="container flex w-full justify-between items-center p-5 border rounded-md shadow-md my-2"
              >
                <div className="w-full">
                  <header className="flex flex-col sm:flex-row justify-between items-center w-full  mb-3 text-2xl">
                    <h2 className="  ">
                      {carpooling.departure} - {carpooling.destination}
                    </h2>
                    <h2>
                      {format(carpooling.departure_day, "EEEE, dd-MM-yyyy")} -{" "}
                      {carpooling.departure_time
                        .split(":")
                        .slice(0, 2)
                        .join(":")}
                    </h2>
                  </header>
                  <div className="request-avaialable-seats">
                    <h1 className="text-xl">Confirmed Passengers : </h1>
                    <div className="flex gap-2 wrap ">
                      {carpooling.confirmed_requests.map((request: any) => {
                        return (
                          <Link
                            to={`/user/${request.requester_id}`}
                            key={request.id}
                          >
                            <div
                              className="flex items-center gap-1 border min-w-[150px] max-w-[250px] p-1 rounded-md"
                            >
                              <div className="w-12 h-12 bg-gray-300 rounded-full">
                                <img src={request.profile_picture} alt="" />
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
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                  <div className="info flex flex-col sm:flex-row gap-2 mt-2">
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
                                        src={request.profile_picture}
                                        alt=""
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
          You don't have any active carpooling
        </div>
      )}
    </div>
  );
};

export default ManageYourCarpooling;
