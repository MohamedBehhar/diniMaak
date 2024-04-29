import { useEffect, useState } from "react";
import { getCities, creatCarpooling } from "../api/methods";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useForm, SubmitHandler, set } from "react-hook-form";
import Snackbar from "@mui/material/Snackbar";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { useNavigate } from "react-router-dom";

const inputClass: string =
  " p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6";

const schema = z.object({
  departure: z.string(),
  destination: z.string(),
  departure_time: z.string(),
  number_of_seats: z.string(),
  departure_day: z.string(),
  price: z.number(),
});

type Inputs = z.infer<typeof schema>;

function PostCarpooling() {
  const [departure, setDeparture] = useState("");
  const [destination, setDestination] = useState("");
  const [departureCities, setDepartureCities] = useState([]);
  const [destinationCities, setDestinationCities] = useState([]);
  const [departure_time, setDeparture_time] = useState("");
  const [departure_day, setDeparture_day] = useState("");
  const [number_of_seats, setNumber_of_seats] = useState(1);
  const [steps, setSteps] = useState(0);
  const [price, setPrice] = useState(1);
  const [open, setOpen] = useState(false);
  const [carPoolingCreationMsg, setCarPoolingCreationMsg] = useState({
    message: "",
    severity: "",
  });
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
  });

  const createCarPooling = async (e) => {
    e.preventDefault();
    const user_id = localStorage.getItem("id");
    const data = {
      user_id,
      departure,
      destination,
      departure_time,
      number_of_seats,
      departure_day,
      price,
    };
    await creatCarpooling(data)
      .then((response: any) => {
        console.log(response);
        setCarPoolingCreationMsg({
          message: "Carpooling created successfully",
          severity: "success",
        });
        setOpen(true);
        navigate("/");
      })
      .catch((error) => {
        setCarPoolingCreationMsg({
          message: error.response.data.error.message,
          severity: "error",
        });
        setOpen(true);
        console.log(error);
      });
  };

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

  const decrementSteps = () => {
    if (steps === 0) {
      return;
    }
    setSteps(steps - 1);
  };

  const incrementSteps = () => {
    if (steps === 6) {
      return;
    }
    setSteps(steps + 1);
  };

  const ContinueButtonStyle =
    "bg-blue-500 text-white p-2 rounded-md w-1/2 mx-auto mt-5";

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
        className="flex flex-col gap-5 justify-center items-center "
        onSubmit={createCarPooling}
      >
        <h1 className="text-2xl font-semibold">Post a carpooling</h1>
        {steps === 0 && (
          <div className="container">
            <h1 className="text-2xl font-semibold text-center">Departure</h1>
            <button
              className="border   px-2  py-1 rounded-md  mx-auto mt-5"
              onClick={decrementSteps}
            ></button>
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
              <Autocomplete
                className="mt-2 capitalize"
                id="free-solo-demo"
                onInputChange={(e: object, value: any) => {
                  setDeparture(value);
                }}
                onChange={(e: object, value: any) => {
                  incrementSteps();
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
          </div>
        )}

        {steps === 1 && (
          <div className="container">
            <h1 className="text-2xl font-semibold text-center">Destination</h1>
            <button
              className="border border-gray-400  px-2  py-1 rounded-md  mx-auto mt-5"
              onClick={decrementSteps}
            >
              back
            </button>
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
              <Autocomplete
                className="mt-2 capitalize"
                id="free-solo-demo"
                onInputChange={(e: object, value: any) => {
                  setDestination(value);
                }}
                onChange={(e: object, value: any) => {
                  incrementSteps();
                }}
                options={destinationCities.map((option: City) => option.name)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Enter your destination"
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
          </div>
        )}

        {steps === 2 && (
          <div className="container">
            <h1 className="text-2xl font-semibold text-center">
              Departure day
            </h1>
            <button
              className="border border-gray-400  px-2  py-1 rounded-md  mx-auto mt-5"
              onClick={decrementSteps}
            >
              back
            </button>
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
              <TextField
                id="departure_day"
                type="date"
                required
                className={inputClass}
                onChange={(e) => {
                  console.log(e.target.value);
                  setDeparture_day(
                    new Date(e.target.value).toISOString().split("T")[0]
                  );
                }}
              />
              {
                errors.departure_day && (
                  <p className="text-red-500 text-sm font-semibold">
                    {errors.departure_day.message}
                  </p>
                ) // error message
              }
            </div>
            <button
              onClick={() => {
                incrementSteps();
              }}
              className={ContinueButtonStyle}
              disabled={departure_day === ""}
            >
              Continue
            </button>
          </div>
        )}

        {steps === 3 && (
          <div className="container">
            <h1 className="text-2xl font-semibold text-center">time</h1>
            <button
              className="border border-gray-400  px-2  py-1 rounded-md  mx-auto mt-5"
              onClick={decrementSteps}
            >
              back
            </button>
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
              <TextField
                id="departure_time"
                type="time"
                required
                className={inputClass}
                onChange={(e) => {
                  console.log(e.target.value);
                  setDeparture_time(e.target.value);
                }}
              />
              {
                errors.departure_time && (
                  <p className="text-red-500 text-sm font-semibold">
                    {errors.departure_time.message}
                  </p>
                ) // error message
              }
            </div>
            <button
              onClick={() => {
                incrementSteps();
              }}
              disabled={departure_time === ""}
              className={ContinueButtonStyle}
            >
              Continue
            </button>
          </div>
        )}

        {steps === 4 && (
          <div className="container">
            <h1 className="text-2xl font-semibold text-center">
              Nombre de place
            </h1>
            <div className="sm:mx-auto sm:w-full sm:max-w-sm flex  border justify-center mt-5">
              <button
                disabled={number_of_seats === 1}
                onClick={() => {
                  setNumber_of_seats(number_of_seats - 1);
                }}
                type="button"
              >
                -
              </button>
              <input
                className="w-1/2 text-center"
                id="number_of_seats"
                type="number"
                required
                readOnly
                value={number_of_seats}
              />
              <button
                disabled={number_of_seats === 4}
                onClick={() => {
                  setNumber_of_seats(number_of_seats + 1);
                }}
                type="button"
              >
                +
              </button>
              {
                errors.number_of_seats && (
                  <p className="text-red-500 text-sm font-semibold">
                    {errors.number_of_seats.message}
                  </p>
                ) // error message
              }
            </div>
            <button
              onClick={() => {
                incrementSteps();
              }}
              className={ContinueButtonStyle}
            >
              Continue
            </button>
          </div>
        )}

        {steps === 5 && (
          <div className="container">
            <h1 className="text-2xl font-semibold text-center">Prix</h1>
            <button onClick={decrementSteps}>back</button>
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
              <h1 className="text-center">
                {price} <span>dh</span>
              </h1>
              <Box sx={{ width: 300 }}>
                <Slider
                  aria-label="Temperature"
                  value={price}
                  valueLabelDisplay="auto"
                  onChange={(e, value) => {
                    setPrice(value);
                  }}
                  min={0}
                  max={200}
                  color="success"
                />
              </Box>
              {
                errors.number_of_seats && (
                  <p className="text-red-500 text-sm font-semibold">
                    {errors.number_of_seats.message}
                  </p>
                ) // error message
              }
              <button
                onClick={() => {
                  setSteps(6);
                }}
                className={ContinueButtonStyle}
                disabled={price === 0}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {steps === 6 && (
          <div className="container  flex flex-col gap-5 items-center">
            <h1 className="text-2xl font-semibold text-center">Recapulatif</h1>
            <div className="rounded border text-xl text-black w-[500px]">
              <div className="mb-2">
                <p className="m-0">Departure: </p>
                <h1 className="text-2xl font-semibold ">{departure}</h1>
              </div>
              <div className="mb-2">
                <p className="m-0">Destination: </p>
                <h1 className="text-2xl font-semibold ">{destination}</h1>
              </div>
              <div className="mb-2">
                <p className="m-0">Departure day: </p>
                <h1 className="text-2xl font-semibold ">{departure_day}</h1>
              </div>
              <div className="mb-2">
                <p className="m-0">Departure time: </p>
                <h1 className="text-2xl font-semibold ">{departure_time}</h1>
              </div>
              <div className="mb-2">
                <p className="m-0">Number of seats: </p>
                <h1 className="text-2xl font-semibold ">{number_of_seats}</h1>
              </div>
              <div className="mb-2">
                <p className="m-0">Price: </p>
                <h1 className="text-2xl font-semibold ">{price}</h1>
              </div>
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded-md w-1/2 mx-auto mt-5"
              onClick={(e) => {
                createCarPooling(e);
              }}
            >
              Post carpooling
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

export default PostCarpooling;
