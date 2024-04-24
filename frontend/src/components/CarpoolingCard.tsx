import { Button } from "@mui/material";
import React from "react";
import { format } from "date-fns";
import { bookCarpooling as bookCarpoolingMethod } from "../api/methods";

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
    const user_id = localStorage.getItem("id");
    const numberOfSeats = 1;
    console.log(user_id);
    console.log(carpooling_id);
    console.log(numberOfSeats); 
    await bookCarpoolingMethod({user_id, carpooling_id, numberOfSeats}).then(
      (response: any) => {
        console.log(response);
      }
    );
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
      <Button variant="contained" color="primary" onClick={bookCarpooling}>
        Book
      </Button>
    </div>
  );
};

export default CarpoolingCard;
