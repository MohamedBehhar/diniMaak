
import  { useEffect, useState } from "react";
import {getCities} from "../api/methods";
const inputClass: string =
  " p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6";
function PostCarpooling() {
	const [departure, setDeparture] = useState("");
	useEffect(() => {
		console.log(departure);
		if (departure.length < 2) {
			return;
		}
		getCities(departure).then((response:any) => {
			console.log(response);
		});
	}
	, [departure]);



  return (
    <div>
      <form className="flex flex-col gap-5 justify-center items-center">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <label htmlFor="departure">Departurer</label>
          <input id="departure" required className={inputClass} 
		  onChange={
			(e) => {
				setDeparture(e.target.value);
			}
		  }
		  />
        </div>
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <label htmlFor="destination">Destination</label>
          <input id="destination"  required className={inputClass} />
		  <select id="destination" required className={inputClass}
		  
		  />
        </div>
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <label htmlFor="departure_time">Departure time</label>
          <input id="departure_time" type="datetime-local" required className={inputClass} />
        </div>
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <label htmlFor="number_of_seats">Number of seats</label>
          <input id="number_of_seats" type="number" required className={inputClass} />
        </div>
        <button type="submit">Post carpooling</button>
      </form>
    </div>
  );
}

export default PostCarpooling;
