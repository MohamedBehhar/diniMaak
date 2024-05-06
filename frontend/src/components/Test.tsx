import Steper from "./Steper";
import { useEffect, useState } from "react";
import { MdDepartureBoard, MdOutlinePlace } from "react-icons/md";
import { BsCalendarDate } from "react-icons/bs";
import { PiSeatbeltBold } from "react-icons/pi";
import { MdAttachMoney } from "react-icons/md";
import { GiConfirmed } from "react-icons/gi";
import { getCities, creatCarpooling } from "../api/methods";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import dayjs, { Dayjs } from "dayjs";

interface Data {
  departure: string;
  destination: string;
  date: dayjs.Dayjs | null;
  time: string;
  place: number;
  price: string;
}
const inputClass: string =
  " p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 max-w-xs mx-auto";

const Test = () => {
  const [stepNumber, setStepNumber] = useState(1);
  const steps = [
    {
      title: "Departure",
      icon: <MdDepartureBoard />,
    },
    {
      title: "Destination",
      icon: <MdOutlinePlace />,
    },
    {
      title: "Date & Time",
      icon: <BsCalendarDate />,
    },
    {
      title: "Place",
      icon: <PiSeatbeltBold />,
    },
    {
      title: "Price",
      icon: <MdAttachMoney />,
    },
    {
      title: "Confirm",
      icon: <GiConfirmed />,
    },
  ];
  const [cities, setCities] = useState([]);
  const [data, setData] = useState<Data>({
    departure: "",
    destination: "",
    date: null,
    time: "",
    place: 4,
    price: "",
  });

  const getCity = async () => {
    const response = await getCities();
    setCities(response);
  };
  useEffect(() => {
    getCity();
  }, []);

  const increament = () => {
    if (stepNumber < steps.length) setStepNumber(stepNumber + 1);
  };
  const decreament = () => {
    if (stepNumber > 1) setStepNumber(stepNumber - 1);
  };
  return (
    <div className="">
      <Steper
        stepNumber={stepNumber}
        increament={increament}
        decreament={decreament}
        steps={steps}
      >
        <div>
          llll
          {Object.keys(data).map((key) => {
            return (
              <div
                key={key}
                className="flex justify-center gap-5 mt-10 mx-auto "
              >
                {key} : {data[key]}
              </div>
            );
          })}
        </div>
        {stepNumber == 1 && (
          <div className="flex justify-center gap-5 mt-10 mx-auto ">
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={cities.map((option) => option.name)}
              sx={{ width: 300 }}
              renderInput={(params) => <TextField {...params} />}
              value={data.departure}
              onChange={(e, value) => {
                setData({ ...data, departure: value });
                increament();
              }}
            />
          </div>
        )}
        {stepNumber == 2 && (
          <div className="flex justify-center gap-5 mt-10 mx-auto ">
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={cities.map((option) => option.name)}
              sx={{ width: 300 }}
              renderInput={(params) => <TextField {...params} />}
              value={data.destination}
              onChange={(e, value) => {
                setData({ ...data, destination: value });
                increament();
              }}
            />
          </div>
        )}
        {stepNumber == 3 && (
          <div className="flex justify-center gap-5 mt-10 mx-auto ">
            {/* <TextField
              id="datetime-local"
              label="Next appointment"
              type="datetime-local"
              defaultValue={new Date().toISOString().slice(0, 16)}
              value={data.date}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(e) => {
                setData({ ...data, date: e.target.value });
                increament();
              }}
            /> */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["StaticDatePicker"]}>
                <DemoItem>
                  <DateCalendar
                    value={data.date}
                    onChange={(newValue) => {
                      setData({ ...data, date: dayjs(newValue)});
                      increament();
                    }}
                  />
                </DemoItem>
              </DemoContainer>
            </LocalizationProvider>
          </div>
        )}
        {stepNumber == 4 && (
          <div className="flex justify-center gap-5 mt-10 mx-auto ">
            <div className="flex gap-5">
              <button
                onClick={() => {
                  data.place = data.place + 1;
                  increament();
                }}
                className="bg-green-500 text-white p-2 rounded-md"
              >
                +
              </button>
              <input
                className={inputClass}
                id="standard-basic"
                type="number"
                readOnly
                value={data.place}
              />
              <button
                onClick={() => {
                  data.place = data.place - 1;
                  increament();
                }}
                className="bg-red-500 text-white p-2 rounded-md"
              >
                -
              </button>
            </div>
          </div>
        )}
        {stepNumber == 5 && (
          <div className="flex justify-center gap-5 mt-10 mx-auto ">
            <TextField
              id="standard-basic"
              label="Price"
              onChange={(e) => {
                data.price = e.target.value;
                increament();
              }}
            />
          </div>
        )}
        {stepNumber == 6 && (
          <div className="flex justify-center gap-5 mt-10 mx-auto ">
            <button
              onClick={async () => {
                await creatCarpooling(data);
                console.log(data);
              }}
              className="bg-green-500 text-white p-2 rounded-md"
            >
              Confirm
            </button>
          </div>
        )}
      </Steper>
    </div>
  );
};

export default Test;
