import { getCarpoolingByPublisherId } from "../api/methods";
import { useEffect, useState } from "react";
import { PiSeatbeltFill } from "react-icons/pi";
import MyModal from "../components/MyModal";
import { acceptCarpoolingRequest } from "../api/methods";
import { message } from "antd";
import { socket } from "../socket/socket";
import { format } from "date-fns";

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
                  <header className="flex flex-col sm:flex-row justify-between items-center w-full text-xl mb-3">
                    <h2 className="">
                      {carpooling.departure} - {carpooling.destination}
                    </h2>
                    <p>
                      {format(carpooling.departure_day, "EEEE, dd-MM-yyyy")} -{" "}
                      {carpooling.departure_time
                        .split(":")
                        .slice(0, 2)
                        .join(":")}
                    </p>
                    <p>
                      {carpooling.available_seats} available seats
                    </p>
                  </header>
                  <div className="info flex flex-col sm:flex-row gap-2">
                    <div className="left flex-1">
                      {carpooling.confirmed_requests.length > 0 && (
                        <div className="flex flex-col gap-2 h-[200px] border rounded p-1">
                          <h1 className="text-xl">confiremed requests</h1>
                          <div className="flex flex-col gap-2 overflow-y-scroll p-1">
                            {carpooling.confirmed_requests.map(
                              (request: any) => {
                                return (
                                  <div
                                    key={request.id}
                                    className="flex items-center gap-5 border rounded p-1 mr-1"
                                  >
                                    <div className="w-12 h-12 bg-gray-300 rounded-full">
                                      <img
                                        src={request.profile_picture}
                                        alt=""
                                      />
                                    </div>
                                    <div>
                                      <p>{request.username}</p>
                                      <div className="flex items-center gap-2">
                                        <p>{request.requested_seats}</p>
                                        <PiSeatbeltFill className="text-cyan-500" />
                                      </div>
                                    </div>
                                  </div>
                                );
                              }
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="right flex-1">
                      {carpooling.requests_infos.length > 0 ? (
                        <div className="">
                          <h1>Requests</h1>
                          <div className="flex items-center gap-5 ">
                            {carpooling.requests_infos.map((request: any) => {
                              return (
                                <MyModal
                                  open={open}
                                  showModal={showModal}
                                  onOk={() => acceptRequest(request)}
                                  onCancel={() => setOpen(false)}
                                  className="border p-1 rounded-md flex items-center max-w-xs gap-4 w-[150px] cursor-pointer hover:scale-105 transition-transform duration-200 ease-in-out"
                                  key={request.id}
                                  data={request}
                                >
                                  <div className="w-12 h-12 bg-gray-300 rounded-full">
                                    <img src={request.profile_picture} alt="" />
                                  </div>
                                  <div className="">
                                    <p className="text-l mb-0">
                                      {request.username}
                                    </p>
                                    <div className="flex items-center">
                                      <p>{request.requested_seats}</p>
                                      <PiSeatbeltFill className="text-cyan-500 " />
                                    </div>
                                  </div>
                                </MyModal>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <p>No requests</p>
                        </div>
                      )}
                    </div>
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
