import { Button } from "@mui/material";
import React from "react";

interface CarpoolingCardProps {
  destination: string;
  departureTime: string;
  availableSeats: number;
  driverName: string;
  departure: string;
}

const CarpoolingCard = ({
  departure,
  destination,
  departureTime,
  availableSeats,
  driverName,
}: CarpoolingCardProps) => {
  return (
    <div className=" shadow-sm m-2 border p-4 rounded-md flex justify-between flex-row">
      <h5 className="">
        {departure} - {destination}
      </h5>
      <h6 className="mb-2 text-muted">{departureTime}</h6>
      <p className="t">Available seats: {availableSeats}</p>
      <p className="">Driver: {driverName}</p>
      <Button variant="contained" color="primary">
        Book
      </Button>
    </div>
  );
};

export default CarpoolingCard;
