import { Select, Input } from "antd";
import { getCarBrand } from "../api/methods";
import { useState } from "react";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { format, set } from "date-fns";
import { PlusOutlined } from "@ant-design/icons";
import { Image, Upload } from "antd";
import { addCar } from "../api/methods";

const AddCar = () => {
  const [brands, setBrands] = useState([]);
  const onSearch = async (val: any) => {
    await getCarBrand(val)
      .then((response: any) => {
        setBrands(
          response.map((brand: any) => {
            return { value: brand.label, label: brand.label };
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

  const [data, setData] = useState({
    brand: "",
    year: "",
    image: "",
    user_id: localStorage.getItem("user_id") || "",
    plate: "",
  });

  const handleAddCar = async () => {
    await addCar(data)
      .then((response: any) => {
        console.log(response);
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  return (
    <div className=" h-full">
      <div className="flex sm:flex-row flex-col h-[80%] gap-5">
        <div className="flex-1  h-full  flex flex-col justify-evenly">
          <Select
            size="large"
            showSearch
            placeholder="Search Car Brand"
            optionFilterProp="children"
            onSearch={onSearch}
            options={brands}
            filterOption={filterOption}
            style={{ width: "100%", color: "black", border: "none" }}
            className="border-none"
          />
          <DatePicker
            size="large"
            placeholder="Year of Manufacture"
            format="YYYY"
            picker="year"
            disabledDate={(current) =>
              current && current > dayjs().endOf("day")
            }
            width={"100%"}
          />
          <Input
            size="large"
            placeholder="Car Plate"
            onChange={(e) => {
              setData({ ...data, plate: e.target.value });
            }}
			// set a patern for the plate
			pattern="[A-Z]{2}-[0-9]{2}-[A-Z]{2}-[0-9]{4}"
          />
        </div>
        <div className="flex-1 border-gray-400  bg-slate-400 flex items-center">
          <input
            type="file"
            id="avatar"
            name="avatar"
            accept="image/png, image/jpeg"
            onChange={(e) => {
              setData({ ...data, image: e.target.value });
            }}
          />
        </div>
      </div>
      <button className="bg-cyan-600 text-white p-2 rounded-md max-w-64 mx-auto">
        confirm
      </button>
    </div>
  );
};

export default AddCar;
