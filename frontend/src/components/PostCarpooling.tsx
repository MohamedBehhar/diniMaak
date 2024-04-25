import { useEffect, useState } from "react";
import { getCities, creatCarpooling } from "../api/methods";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useForm, SubmitHandler, set } from "react-hook-form";
import Snackbar from "@mui/material/Snackbar";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Alert from "@mui/material/Alert";

const inputClass: string =
  " p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6";

const schema = z.object({
  departure: z.string(),
  destination: z.string(),
  departure_time: z.string(),
  number_of_seats: z.string(),
  departure_day: z.string(),
});

type Inputs = z.infer<typeof schema>;

function PostCarpooling() {
  const [departure, setDeparture] = useState("");
  const [destination, setDestination] = useState("");
  const [departureCities, setDepartureCities] = useState([]);
  const [destinationCities, setDestinationCities] = useState([]);
  const [carPoolingCreationMsg, setCarPoolingCreationMsg] = useState({
    message: "",
    severity: "",
  });
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
  });
  const onsubmit: SubmitHandler<Inputs> = async (data) => {
    const user_id = localStorage.getItem("id");
    await creatCarpooling({ ...data, user_id })
      .then((response: any) => {
        console.log(response);
        setCarPoolingCreationMsg({
          message: response,
          severity: "success",
        });
      })
      .then(() => {
        window.location.href = "/";
      })
      .catch((error: any) => {
        console.log(error.response.data.error);
        const key = error.response.data.error.key;
        const message = error.response.data.error.message;
        setError(key, { message: message });
        setCarPoolingCreationMsg({
          message: message,
          severity: "error",
        });
      });
    setOpen(true);
  };

  const [open, setOpen] = useState(false);

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
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
      <Snackbar
        open={open}
        autoHideDuration={3000}
        // success

        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        onClose={handleClose}
        action={
          <button className="text-white" onClick={handleClose}>
            X
          </button>
        }
      >
        <Alert severity={carPoolingCreationMsg.severity}>
          {carPoolingCreationMsg.message}
        </Alert>
      </Snackbar>
      <form
        className="flex flex-col gap-5 justify-center items-center"
        onSubmit={handleSubmit(onsubmit)}
      >
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
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
                {...register("departure")}
              />
            )}
          />
          {
            errors.departure && (
              <p className="text-red-500 text-sm font-semibold">
                {errors.departure.message}
              </p>
            ) // error message
          }
        </div>
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
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
                {...register("destination")}
              />
            )}
          />{" "}
          {
            errors.destination && (
              <p className="text-red-500 text-sm font-semibold">
                {errors.destination.message}
              </p>
            ) // error message
          }
        </div>
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <TextField
            id="departure_day"
            type="date"
            required
            className={inputClass}
            {...register("departure_day")}
          />
          {
            errors.departure_day && (
              <p className="text-red-500 text-sm font-semibold">
                {errors.departure_day.message}
              </p>
            ) // error message
          }
        </div>
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <TextField
            id="departure_time"
            type="time"
            required
            className={inputClass}
            {...register("departure_time")}
          />
          {
            errors.departure_time && (
              <p className="text-red-500 text-sm font-semibold">
                {errors.departure_time.message}
              </p>
            ) // error message
          }
        </div>
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <TextField
            id="number_of_seats"
            type="string"
            fullWidth
            {...register("number_of_seats")}
          />
          {
            errors.number_of_seats && (
              <p className="text-red-500 text-sm font-semibold">
                {errors.number_of_seats.message}
              </p>
            ) // error message
          }
        </div>
        <button type="submit">Post carpooling</button>
      </form>
    </div>
  );
}

export default PostCarpooling;
