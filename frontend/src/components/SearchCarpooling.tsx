import { InputNumber, Select } from "antd";
import { getCities, searchCarpooling } from "../api/methods";
import { useState } from "react";
import { MdOutlineDepartureBoard } from "react-icons/md";
import type { DatePickerProps } from "antd";
import { DatePicker, Space } from "antd";
import dayjs from "dayjs";
import { GiPositionMarker } from "react-icons/gi";
import { PiSeatbeltFill } from "react-icons/pi";
import type { FormProps } from "antd";
import { Button, Checkbox, Form, Input } from "antd";

type FieldType = {
  departure: string;
  destination: string;
  departure_day: string;
  number_of_seats: number | null;
  user_id: string;
};

const SearchCarpooling = () => {
  const [cities, setCities] = useState([]);
  const onSearchChange = (value: any) => {
    console.log(`selected ${value}`);
  };
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

  const onChange: DatePickerProps["onChange"] = (date, dateString) => {
    console.log(date, dateString);
  };

  const [data, setData] = useState<FieldType>({
    departure: "",
    destination: "",
    departure_day: dayjs().endOf("day").format("YYYY-MM-DD"),
    number_of_seats: 1,
    user_id: "",
  });

  const user_id = localStorage.getItem("id");
  const searchForCarpooling = async () => {
    data.user_id = user_id;
    await searchCarpooling(data)
      .then((response: any) => {
        console.log(response);
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
      />
      <DatePicker
        size="large"
        onChange={(date) => {
          setData({
            ...data,
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
      <Button type="primary" size="large" onClick={() => searchForCarpooling()}>
        Search
      </Button>
    </div>
  );
};

export default SearchCarpooling;
