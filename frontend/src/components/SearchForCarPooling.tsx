import { useEffect, useState } from "react";
import { getCities, searchCarpooling } from "../api/methods";
import { useForm, SubmitHandler } from "react-hook-form";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TextField from "@mui/material/TextField";
import CarpoolingCard from "./CarpoolingCard";
import { useSearchParams } from "react-router-dom";
import MyDialog from "./MyDialog";

const inputClass: string =
  " p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6";

type Inputs = {
  departure: string;
  destination: string;
  departure_day: string;
  number_of_seats: number;
};
interface City {
  id: number;
  name: string;
}

const SearchForCarPooling = () => {
  const { register, handleSubmit } = useForm<Inputs>({
    defaultValues: {
      departure: "",
      destination: "",
      departure_day: new Date().toISOString().split("T")[0],
      number_of_seats: 1,
    },
  });
  const [departure, setDeparture] = useState("");
  const [destination, setDestination] = useState("");
  const [departureCities, setDepartureCities] = useState([]);
  const [destinationCities, setDestinationCities] = useState([]);
  const [availableCarpooling, setAvailableCarpooling] = useState([]);
  const [open, setOpen] = useState(false);
  const handelClose = () => {
    setOpen(false);
  };

  const [searchParams, setSearchParams] = useSearchParams();
  console.log("searchParams---- ", searchParams.values());

  const onsubmit: SubmitHandler<Inputs> = async (data) => {
    console.log("0-0-0-0-0-0-0-0-0-", data);
    const user_id = localStorage.getItem("id");
    setSearchParams(
      `?departure=${data.departure}&destination=${data.destination}&departure_day=${data.departure_day}&number_of_seats=${data.number_of_seats}`
    );

    await searchCarpooling({ ...data, user_id })
      .then((response: any) => {
        console.log(response);
        setAvailableCarpooling(response);
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  useEffect(() => {
    const { departure, destination } = searchParams;
    console.log("searchParams", searchParams);

    if (departure && destination) {
      setDeparture(departure);
      setDestination(destination);

      searchCarpooling({
        departure,
        destination,
        departure_day: new Date().toISOString().split("T")[0],
        number_of_seats: 1,
      })
        .then((response: any) => {
          setAvailableCarpooling(response);
        })
        .catch((error: any) => {
          console.log(error);
        });
    }
  }, [searchParams]);

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

  return (
    <div>
      <form
        className="gap-5  justify-center items-center"
        onSubmit={handleSubmit(onsubmit)}
      >
        <div className="flex flex-col md:flex-row gap-4 items-end flex-wrap">
          <div className="w-full flex-1 ">
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
          <div className="w-full flex-1">
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
          <div className="w-full flex-1 ">
            <TextField
              type="date"
              className={inputClass + " p-5 h-full"}
              {...register("departure_day")}
            />
          </div>
          <div className="w-full flex-1">
            <TextField
              id="number_of_seats"
              type="number"
              label="Number of seats"
              fullWidth
              {...register("number_of_seats")}
            />
          </div>
        </div>
        <div className="mt-2 flex justify-center">
          <Button variant="contained" className="m-auto" type="submit">
            Search
          </Button>{" "}
        </div>
      </form>
      {/* available car pooling  */}
      {availableCarpooling ? (
        availableCarpooling.map((carpooling: any) => {
          return (
            <CarpoolingCard
              key={carpooling.id}
              departure={carpooling.departure}
              destination={carpooling.destination}
              departureDay={carpooling.departure_day}
              departureTime={carpooling.departure_time}
              availableSeats={carpooling.number_of_seats}
              driverName={carpooling.driver_name}
              carpooling_id={carpooling.id}
            />
          );
        })
      ) : (
        <p>No carpooling available</p>
      )}
    </div>
  );
};

export default SearchForCarPooling;
