import { InputNumber, Select, Button } from "antd";
import { getCities, searchCarpooling } from "../api/methods";
import { useEffect, useState } from "react";
import { MdOutlineDepartureBoard } from "react-icons/md";
import type { DatePickerProps } from "antd";
import { DatePicker, Space } from "antd";
import dayjs from "dayjs";
import { GiPositionMarker } from "react-icons/gi";
import { PiSeatbeltFill } from "react-icons/pi";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { set } from "date-fns";

type FieldType = {
  departure: string | null;
  destination: string | null;
  departure_day: string;
  number_of_seats: number | null;
  user_id: string | null;
};

interface SearchCarpoolingProps {
  setCarpoolings: () => void;
}

const SearchCarpooling = ({ setCarpoolings }: SearchCarpoolingProps) => {
  const [cities, setCities] = useState([]);
  const onSearch = async (val: any) => {
    await getCities(val)
      .then((response: any) => {
        setCities(
          response.map((city: any) => {
            return { value: city.label, label: city.label };
          })
        );
      })
      .catch((error: any) => {
        console.log(error);
      });
  };
  const filterOption = (
    input: string,
    option?: { label: string; value: string }
  ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  const [params, setSearchParams] = useSearchParams();

  const [data, setData] = useState<FieldType>({
    departure: "",
    destination: "",
    departure_day: dayjs().endOf("day").format("YYYY-MM-DD"),
    number_of_seats: 1,
    user_id: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (params.get("departure") && params.get("destination")) {
      setData({
        ...data,
        departure: params.get("departure"),
        destination: params.get("destination"),
      });
    }
  }, []);

  const user_id = localStorage.getItem("id");
  const searchForCarpooling = async () => {
    data.user_id = user_id;
    navigate({
      pathname: "/carpooling/search",
      search: `?departure=${data.departure}&destination=${data.destination}&departure_day=${data.departure_day}&number_of_seats=${data.number_of_seats}&user_id=${data.user_id}`,
    });
    await searchCarpooling(data)
      .then((response: any) => {
        setCarpoolings(response);
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  return (
    <div className="m-auto shadow-md p-2 flex flex-wrap justify-between items-center  container bg-white border-[2px] rounded-md">
      <Select
        suffixIcon={
          <MdOutlineDepartureBoard className="text-cyan-500" size={20} />
        }
        size="large"
        showSearch
        placeholder="Choose departure city"
        optionFilterProp="children"
        onChange={(value) => {
          setData({ ...data, departure: value });
        }}
        onSearch={onSearch}
        options={cities}
        filterOption={filterOption}
        style={{ width: 200, color: "black", border: "none" }}
        className="border-none"
        value={data.departure}
      />
      <Select
        suffixIcon={<GiPositionMarker className="text-cyan-500" size={20} />}
        size="large"
        showSearch
        placeholder="Choose departure city"
        optionFilterProp="children"
        onChange={(value) => {
          setData({ ...data, destination: value });
        }}
        onSearch={onSearch}
        options={cities}
        filterOption={filterOption}
        style={{ width: 200, color: "black" }}
        value={data.destination}
      />
      <DatePicker
        size="large"
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
      <InputNumber
        size="large"
        min={1}
        max={4}
        defaultValue={1}
        suffix={<PiSeatbeltFill className="text-cyan-500 ml-8" size={20} />}
        onChange={(value) => {
          setData({ ...data, number_of_seats: value });
        }}
      />
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
