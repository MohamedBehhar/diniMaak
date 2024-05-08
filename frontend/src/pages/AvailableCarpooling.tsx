import React, { useEffect } from "react";
import SearchCarpooling from "../components/SearchCarpooling";
import { searchCarpooling } from "../api/methods";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

const AvailableCarpooling = () => {
  const [carpoolings, setCarpoolings] = useState([]);
  const [params] = useSearchParams();
  useEffect(() => {
    // alert("jjjj");
    // searchCarpooling(params.toString())
    //   .then((response) => {
    //     console.log("odododododoood ", response);
    //     setCarpoolings(response);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  }, []);

  return (
    <div>
      <div className="p-5 w-full bg-cover bg-center">
        <h1 className=" text-5xl text-center p-10">Available Carpooling</h1>
      </div>
      <SearchCarpooling setCarpoolings={setCarpoolings} />
      {carpoolings && carpoolings.length > 0 ? (
        <div>
          {carpoolings.map((carpooling: any) => {
            return (
              <div
                key={carpooling.id}
                className="container flex justify-between items-center p-5 border-b"
              >
                <div>
                  <h2 className="text-xl">
                    {carpooling.departure} - {carpooling.destination}
                  </h2>
                  <p>
                    {carpooling.departure_day} - {carpooling.departure_time}
                  </p>
                </div>
                <div>
                  <button className="bg-blue-500 text-white px-3 py-1 rounded-md">
                    Book
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center p-5">No carpooling available</div>
      )}
    </div>
  );
};

export default AvailableCarpooling;
