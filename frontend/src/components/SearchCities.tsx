import { Select } from "antd";
import { MdOutlineDepartureBoard } from "react-icons/md";
import { getCities } from "../api/methods";
import { useState } from "react";

interface Props {
  setChoosedCity: (city: string) => void;
  placeholder: string;
  icon: React.ReactNode;
  defaultValue?: string;
}

const SearchCities = ({ setChoosedCity, placeholder, icon, defaultValue }: Props) => {
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

  return (
    <Select
      suffixIcon={icon}
      size="large"
      
      showSearch
      placeholder={placeholder}
      optionFilterProp="children"
      onChange={(value) => {
        setChoosedCity(value);
        setCities([]);
      }}
      onSearch={onSearch}
      options={cities}
      defaultValue={defaultValue}
      filterOption={filterOption}
      style={{ width: '100%', color: "black", border: "none" }}
      className="border-none"
    />
  );
};

export default SearchCities;
