import { useEffect, useState } from "react";
import { getCities, creatCarpooling } from "../api/methods";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useForm, SubmitHandler } from "react-hook-form";

const inputClass: string =
  " p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6";

type Inputs = {
  departure: string;
  destination: string;
  departure_time: string;
  departure_day: string;
  number_of_seats: number;
  user_id: number;
};

function PostCarpooling() {
  const [departure, setDeparture] = useState("");
  const [destination, setDestination] = useState("");
  const [departureCities, setDepartureCities] = useState([]);
  const [destinationCities, setDestinationCities] = useState([]);

  const { register, handleSubmit } = useForm<Inputs>();
  const onsubmit: SubmitHandler<Inputs> = async (data) => {
    data.departure_day = new Date(data.departure_day).toISOString();
    data.user_id = 1;
    console.log(data);
    await creatCarpooling(data)
      .then((response: any) => {
        console.log(response);
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (departure.length == 0 || departure == "") {
      setDepartureCities([]);
      return;
    }
    if (departure.length < 2) {
      return;
    }
    getCities(departure).then((response: any) => {
      setDepartureCities(response);
    });
  }, [departure]);

  useEffect(() => {
    if (destination.length == 0 || destination == "") {
      setDestinationCities([]);
      return;
    }
    if (destination.length < 2) {
      return;
    }
    getCities(destination).then((response: any) => {
      console.log(response);
      setDestinationCities(response);
    });
  }, [destination]);

  interface City {
    id: number;
    name: string;
  }

  return (
    <div>
      <form
        className="flex flex-col gap-5 justify-center items-center"
        onSubmit={handleSubmit(onsubmit)}
      >
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <label htmlFor="departure">Departurer</label>

          <Autocomplete
            className="mt-2 capitalize"
            id="free-solo-demo"
            onInputChange={(e: object, value: any) => {
              setDeparture(value);
            }}
            options={departureCities.map((option: City) => option.name)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Enter your departure"
                {...register("departure", { required: true })}
              />
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
            options={destinationCities.map((option: City) => option.name)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Enter your departure"
                {...register("destination", { required: true })}
              />
            )}
          />{" "}
        </div>
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <label htmlFor="departure_time">Departure day</label>
          <TextField
            id="departure_time"
            type="date"
            required
            className={inputClass}
            {...register("departure_day", { required: true })}
          />
        </div>
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <label htmlFor="departure_time">Departure time</label>
          <TextField
            id="departure_time"
            type="time"
            required
            className={inputClass}
            {...register("departure_time", { required: true })}
          />
        </div>
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <TextField
            id="number_of_seats"
            type="number"
            required
            fullWidth
            {...register("number_of_seats", { required: true })}
          />
        </div>
        <button type="submit">Post carpooling</button>
      </form>
    </div>
  );
}

export default PostCarpooling;
