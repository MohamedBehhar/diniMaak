import { Button, TextField } from "@mui/material";
import React from "react";
import { format } from "date-fns";
import { bookCarpooling as bookCarpoolingMethod } from "../api/methods";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

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
  const bookCarpooling = async () => {
    const booker_id = localStorage.getItem("id");
    console.log(booker_id);
    console.log(carpooling_id);
    console.log(numberOfSeats);
    await bookCarpoolingMethod({
      booker_id,
      carpooling_id,
      numberOfSeats,
    }).then((response: any) => {
      console.log(response);
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

  return (
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
      <Link to={`/carpooling-details/${carpooling_id}`}>Book</Link>
    </div>
  );
};

export default CarpoolingCard;
