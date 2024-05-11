import { getCarpoolingByPublisherId } from "../api/methods";
import { useEffect, useState } from "react";

const PublishedCarpooling = () => {
  const [carpoolings, setCarpoolings] = useState([]);
  useEffect(() => {
    getCarpoolingByPublisherId(localStorage.getItem("id"))
      .then((response) => {
        console.log("odododododoood ", response);
        setCarpoolings(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div>
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

export default PublishedCarpooling;
