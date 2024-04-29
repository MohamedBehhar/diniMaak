import { format } from "date-fns";
import { bookCarpooling as bookCarpoolingMethod } from "../api/methods";
import MyDialog from "./MyDialog";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

interface CarpoolingCardProps {
  destination: string;
  departureTime: string;
  departureDay: string;
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
  availableSeats,
  driverName,
  carpooling_id,
}: CarpoolingCardProps) => {
  const [searchParams] = useSearchParams();
  const bookCarpooling = async () => {
    const numberOfSeats = searchParams.get("number_of_seats");
    const booker_id = localStorage.getItem("id");

    await bookCarpoolingMethod({
      booker_id,
      carpooling_id,
      numberOfSeats,
    }).then((response: any) => {
      alert(response.data.message);
    });
  };

  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    borderRadius: "10px",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
  };

  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
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
          <p className="">Driver: {driverName}</p>
        </div>
        <button
          onClick={bookCarpooling}
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
        <p className="t">Available seats: {availableSeats}</p>
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
