import { useEffect, useState } from "react";
import { getCities } from "../api/methods";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useForm, SubmitHandler } from "react-hook-form";

const inputClass: string =
  " p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6";

type Inputs = {
  departure: string;
  destination: string;
  departure_time: string;
  number_of_seats: number;
};

function PostCarpooling() {
  const [departure, setDeparture] = useState("");
  const [destination, setDestination] = useState("");
  const [cities, setCities] = useState([]);

  const { register, handleSubmit } = useForm<Inputs>();
  const onsubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data);
  }


  useEffect(() => {
    console.log(departure);
    if (departure.length == 0 || departure == "") {
      setCities([]);
      return;
    }
    if (departure.length < 2) {
      return;
    }
    getCities(departure).then((response: any) => {
      console.log(response);
      setCities(response);
    });
  }, [departure]);

  interface City {
    id: number;
    name: string;
  }

  const PostCarpooling = async () => {
    PostCarpooling();
  };

  return (
    <div>
      <form
        className="flex flex-col gap-5 justify-center items-center"
        onSubmit={handleSubmit(onsubmit)}
      >
        {departure}
        {destination}
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <label htmlFor="departure">Departurer</label>

          <Autocomplete
            className="mt-2 capitalize"
            id="free-solo-demo"
            onInputChange={(e: object, value: any) => {
              setDeparture(value);
            }}
            {...register("departure", { required: true })}
            options={cities.map((option: City) => option.name)}
            renderInput={(params) => (
              <TextField {...params} label="Enter your departure" />
            )}
          />
        </div>
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <label htmlFor="destination">Destination</label>
          <Autocomplete
            className="mt-2 capitalize"
            id="free-solo-demo"
            onInputChange={(e: object, value: any) => {
              setDestination(value);
            }}
            {...register("destination", { required: true })}
            options={cities.map((option: City) => option.name)}
            renderInput={(params) => (
              <TextField {...params} label="Enter your departure" />
            )}
          />{" "}
        </div>
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <label htmlFor="departure_time">Departure time</label>
          <input
            id="departure_time"
            type="datetime-local"
            required
            className={inputClass}
            {...register("departure_time", { required: true })}
          />
        </div>
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <TextField id="number_of_seats" type="number" required fullWidth />
        </div>
        <button type="submit">Post carpooling</button>
      </form>
    </div>
  );
}

export default PostCarpooling;
