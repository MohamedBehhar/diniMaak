import { format } from "date-fns";
import { bookCarpooling as bookCarpoolingMethod } from "../api/methods";
import MyDialog from "./MyDialog";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

interface CarpoolingCardProps {
  destination: string;
  departureTime: string;
  departureDay: string;
  numberOfSeats: number;
  availableSeats: number;
  driverName: string;
  departure: string;
  carpooling_id: string;
}

const CarpoolingCard = ({
  departure,
  destination,
  departureDay,
  departureTime,
  numberOfSeats,
  availableSeats,
  driverName,
  carpooling_id,
}: CarpoolingCardProps) => {
  const [searchParams] = useSearchParams();
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const requested_seats = searchParams.get("number_of_seats");
  const bookCarpooling = async () => {
    const requester_id = localStorage.getItem("id");

    await bookCarpoolingMethod({
      requester_id,
      carpooling_id,
      requested_seats,
    }).then((response: any) => {
      console.log(response);
      alert(response.data);
    });
  };


  return (
    <>
      <MyDialog open={open} handleClose={handleClose} title="Book Carpooling">
        <div className="  flex flex-col text-xl gap-4 justify-between bold items-center ">
          <h5 className="">
            {departure} - {destination}
          </h5>
          <h6 className="mb-2 text-muted">
            {format(departureDay, "MMMM/dd/yyyy")}
          </h6>
          <h6 className="mb-2 text-muted">{departureTime}</h6>
          <p className="t">Available seats: {availableSeats}</p>
          <p>Requested seats: {requested_seats}</p>
          <p className="">Driver: {driverName}</p>
        </div>
        <button
          onClick={() => {
            bookCarpooling();
            setOpen(false);
          }}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Confirm
        </button>
      </MyDialog>
      <div className=" shadow-sm m-2 border p-4 rounded-md flex justify-between flex-row">
        <h5 className="">
          {departure} - {destination}
        </h5>
        <h6 className="mb-2 text-muted">
          {format(departureDay, "MMMM/dd/yyyy")}
        </h6>
        <h6 className="mb-2 text-muted">{departureTime}</h6>
        <p className="t">
          Available seats: {numberOfSeats} / {availableSeats}{" "}
        </p>
        <p className="">Driver: {driverName}</p>
        <button
          onClick={() => {
            setOpen(true);
          }}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Book
        </button>
      </div>
    </>
  );
};

export default CarpoolingCard;
