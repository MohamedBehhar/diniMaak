import { Select, Input, message } from "antd";
import { getCarBrand } from "../api/methods";
import { useEffect, useState } from "react";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { PlusOutlined } from "@ant-design/icons";
import { Image } from "antd";
import { addCar, getCarByUserId, editCar } from "../api/methods";
import DefaultCar from "../assets/car.png";
import { IMask, IMaskInput } from "react-imask";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

interface AddCarProps {
  increment: () => void;
  setCar_id: (car_id: string) => void;
  car_id: string;
}

interface Car {
  brand: string;
  year: string;
  image: string;
  user_id: string;
  plate: string;
}

const AddCar = ({ increment, setCar_id, car_id }: AddCarProps) => {
  const [brands, setBrands] = useState([]);
  const [image, setImage] = useState("");
  const user_id = localStorage.getItem("id") || "";
  const [car, setCar] = useState({} as Car);

  const [alreadyHasCar, setAlreadyHasCar] = useState(false);
  const fetchCar = async () => {
    await getCarByUserId(user_id)
      .then((response: any) => {
        console.log("response === ", response.data);
        if (response.data) {
          setAlreadyHasCar(true);
          setCar_id(response.data.car_id);
          setCar(response.data);
        }
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchCar();
  }, []);
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
    user_id: localStorage.getItem("id") || "",
    plate: "",
  });

  const handleAddCar = async () => {
    const formdata = new FormData();
    formdata.append("image", image);
    formdata.append("brand", data.brand);
    formdata.append("year", data.year);
    formdata.append("user_id", data.user_id);
    formdata.append("plate", data.plate);

    await addCar(formdata)
      .then((response: any) => {
        message.success("Car added successfully");
        setCar_id(response.car_id);
        increment();
      })
      .catch((error: any) => {
        message.error("Error adding car");
        console.log(error);
      });
  };

  const handleEditCar = async () => {
    const formdata = new FormData();
    formdata.append("image", image);
    formdata.append("brand", data.brand);
    formdata.append("year", data.year);
    formdata.append("user_id", data.user_id);
    formdata.append("plate", data.plate);
    formdata.append("car_id", car_id);
    console.log("formdata === ", formdata);

    await editCar(formdata)
      .then((response: any) => {
        message.success("Car updated successfully");
        increment();
      })
      .catch((error: any) => {
        message.error("Error adding car");
        console.log(error);
      });
  };

  return (
    <div className=" relative h-full">
      {alreadyHasCar === false ? (
          <div className="grid grid-cols-2 gap-4">
            <div className="  h-full  flex flex-col justify-evenly gap-5">
              <Select
                size="large"
                showSearch
                placeholder="Search Car Brand"
                optionFilterProp="children"
                onSearch={onSearch}
                options={brands}
                onChange={(value) => {
                  setData({ ...data, brand: value });
                }}
                filterOption={filterOption}
                style={{ width: "100%", color: "black", border: "none" }}
                className="border-none"
                required
              />
              <DatePicker
                size="large"
                placeholder="Year of Manufacture"
                format="YYYY"
                picker="year"
                disabledDate={(current) =>
                  current && current > dayjs().endOf("day")
                }
                onChange={(date, dateString) => {
                  setData({ ...data, year: dateString });
                }}
                width={"100%"}
              />
              <IMaskInput
                mask="00000/A/00" // Mask format: 5 digits, 1 letter, 2 digits
                definitions={{
                  "0": /[0-9]/, // Only allow digits for numbers
                  A: /[A-Za-z]/, // Allow English letters for the letter part
                }}
                value={data.plate}
                overwrite={true} // Ensures proper input
                className="border p-2 rounded-md"
                placeholder="Car Plate 000000/b/00"
                render={(ref, props) => (
                  <Input
                    {...props}
                    ref={ref}
                    size="large"
                    placeholder="Car Plate"
                    onChange={(e) => {
                      setData({ ...data, plate: e.target.value });
                    }}
                  />
                )}
              />
            </div>
            <div className="   flex flex-col ">
              <div className="h-[72%] flex items-center justify-center ">
                <div className="w-[100px] h-[100px] bg-gray-200 rounded-full object-cover">
                  <Image
                    width={"100%"}
                    height={"100%"}
                    className="rounded-full object-cover"
                    src={image ? URL.createObjectURL(image) : DefaultCar}
                    alt=""
                  />
                </div>
              </div>
              <div className="flex items-center mt-4 ">
                <label
                  htmlFor="avatar"
                  className="cursor-pointer w-full flex justify-center items-center bg-gray-200  mx-4 rounded-md gap-5"
                >
                  <PlusOutlined className="text-4xl text-gray-500" />
                  <p>Upload a car image</p>
                </label>
                <input
                  type="file"
                  id="avatar"
                  name="avatar"
                  accept="image/png, image/jpeg"
                  onChange={(e) => {
                    setImage(e.target.files![0]);
                  }}
                  className="hidden"
                />
              </div>
            </div>
            <div
            className="gap-5    flex justify-center items-center  col-span-2"
          >
            <button
              className="bg-cyan-600 text-white p-2 rounded-md max-w-64 "
              onClick={(e) => {
                e.preventDefault();
                car_id ? handleEditCar() : handleAddCar();
              }}
            >
              Confirm adding new car
            </button>
          </div>
          </div>

      ) : (
        ""
      )}
      {alreadyHasCar === true ? (
        <div className="">
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-xl font-bold text-center ">
              You already have a car registered
            </h1>
            <div className="flex gap-2 items-center">
              did you change your car?
              <button
                className=" ant-btn "
                onClick={() => setAlreadyHasCar(false)}
              >
                Add new car
              </button>
            </div>
          </div>

          <div className="text-center flex items-center gap-5 justify-center">
            <div className="image w-[200px] aspect-square bg-slate-100 rounded-full">
              <Image
                width={"100%"}
                height={"100%"}
                className="rounded-full object-cover"
                src={`http://localhost:3000${car.image}`}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = DefaultCar;
                }}
                alt="d"
              />
            </div>
            <div className="info flex flex-col gap-5">
              <p>Brand: {car.brand}</p>
              <p>Year: {car.year}</p>
              <p>Plate: {car.plate}</p>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default AddCar;
