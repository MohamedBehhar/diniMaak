import { InputNumber, Select, Button } from "antd";
import { getCities, searchCarpooling } from "../api/methods";
import { useEffect, useState } from "react";
import { MdOutlineDepartureBoard } from "react-icons/md";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { GiPositionMarker } from "react-icons/gi";
import { PiSeatbeltFill } from "react-icons/pi";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import SearchCities from "./SearchCities";
import { GoArrowSwitch } from "react-icons/go";

type FieldType = {
  departure: string | null;
  destination: string | null;
  departure_day: string;
  number_of_seats: number | null;
  user_id: string | null;
};

interface SearchCarpoolingProps {
  redirect: boolean;
  setCarpoolings?: any;
}

const SearchCarpooling = ({
  redirect ,
  setCarpoolings,
}: SearchCarpoolingProps) => {
  const [params, setSearchParams] = useSearchParams();

  const [data, setData] = useState<FieldType>({
    departure: params.get("departure") || "",
    destination: params.get("destination") || "",
    departure_day: dayjs().endOf("day").format("YYYY-MM-DD"),
    number_of_seats: 1,
    user_id: "",
  });
  const navigate = useNavigate();

  const user_id = localStorage.getItem("id");
  const searchForCarpooling = async () => {

    if (data.departure && data.destination ) {
      navigate({
        pathname: "/carpooling/search",
        search: `?departure=${data.departure}&destination=${data.destination}&departure_day=${data.departure_day}&number_of_seats=${data.number_of_seats}&user_id=${data.user_id}`,
      });
    } 
  };

  return (
    <div className="m-auto shadow-md p-2 flex flex-col sm:flex-row gap-5 justify-between items-center  container bg-white border-[2px] rounded-md">
      <div className="flex-1 w-full">
        <SearchCities
          setChoosedCity={(city: string) =>
            setData({ ...data, departure: city })
          }
          placeholder="Choose departure city"
          icon={<MdOutlineDepartureBoard className="text-cyan-500" size={20} />}
          defaultValue={data.departure}
        />
      </div>
      <div
        className="flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-md cursor-pointer"
        onClick={() => {
          const temp = data.departure;
          setData({
            ...data,
            destination: temp,
            departure: data.destination,
          });
          setSearchParams({
            departure: data.destination,
            destination: temp,
            number_of_seats: data.number_of_seats,
            departure_day: data.departure_day,
          });
        }}
      >
        <GoArrowSwitch />
      </div>
      <div className="flex-1 w-full">
        <SearchCities
          setChoosedCity={(city: string) =>
            setData({ ...data, destination: city })
          }
          placeholder="Choose destination city"
          icon={<GiPositionMarker className="text-cyan-500" size={20} />}
          defaultValue={data.destination}
        />
      </div>
      <div className="flex-1  w-full">
        <DatePicker
          width={"100%"}
          size="large"
          className="w-full"
          onChange={(date) => {
            setData({
              ...data,
              departure_day: date.endOf("day").format("YYYY-MM-DD"),
            });
            setSearchParams({
              ...params,
              departure_day: date.endOf("day").format("YYYY-MM-DD"),
            });
          }}
          defaultValue={dayjs().endOf("day")}
          disabledDate={(current) => {
            return current && current <= dayjs().endOf("day");
          }}
        />
      </div>
      <div className="flex-1 w-full">
        <InputNumber
          className="w-full"
          width={"100%"}
          size="large"
          min={1}
          max={4}
          defaultValue={1}
          suffix={<PiSeatbeltFill className="text-cyan-500 ml-8" size={20} />}
          onChange={(value) => {
            setData({ ...data, number_of_seats: value });
          }}
        />
      </div>
      <Button
        type="primary"
        size="large"
        onClick={() => searchForCarpooling()}
        disabled={!data.departure || !data.destination}
      >
        Search
      </Button>
    </div>
  );
};

export default SearchCarpooling;
