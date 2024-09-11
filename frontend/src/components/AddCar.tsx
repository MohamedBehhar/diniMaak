import { Select, Input, message } from "antd";
import { getCarBrand } from "../api/methods";
import { useEffect, useState } from "react";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { PlusOutlined } from "@ant-design/icons";
import { Image } from "antd";
import { addCar, getCarByUserId, editCar } from "../api/methods";

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
    console.log("data === ", data);
    const formdata = new FormData();
    formdata.append("image", image);
    formdata.append("brand", data.brand);
    formdata.append("year", data.year);
    formdata.append("user_id", data.user_id);
    formdata.append("plate", data.plate);
    console.log("formdata === ", formdata);

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
    console.log("data === ", data);
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
        <div className="">
          <div className="flex sm:flex-row flex-col h-[80%] gap-5 ">
            <div className="sm:w-[50%]  h-full  flex flex-col justify-evenly gap-5">
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
            <div className="  sm:w-[50%] flex flex-col ">
              <div className="h-[72%] flex items-center justify-center ">
                <div className="w-[100px] h-[100px] bg-gray-200 rounded-full object-cover">
                  <Image
                    width={"100%"}
                    height={"100%"}
                    className="rounded-full object-cover"
                    src={image ? URL.createObjectURL(image) : ""}
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
          </div>
          <div
            className="gap-5  absolute bottom-0 w-full  flex justify-end items-center"
            style={{ marginTop: "2rem" }}
          >
            <button
              className="bg-cyan-600 text-white p-2 rounded-md max-w-64 "
              onClick={() => {
                car_id ? handleEditCar() : handleAddCar();
              }}
            >
              confirm
            </button>
          </div>
        </div>
      ) : (
        ""
      )}
      {alreadyHasCar === true ? (
        <div className="">
          <div className="flex gap-2  text-center  justify-center items-center">
            <h1
              className="text-2xl font-bold text-center "
              style={{ color: "#333" }}
            >
              You already have a car registered
            </h1>
            <div>
              did you change your car?
              <button
                className="bg-cyan-600 text-white p-1 rounded-md max-w-64 mx-auto"
                onClick={() => setAlreadyHasCar(false)}
              >
                Add new car
              </button>
            </div>
          </div>

          <div className="text-center flex items-center gap-5 justify-center">
            <div className="image w-[200px] aspect-square">
              <Image
                width={"100%"}
                height={"100%"}
                className="rounded-full object-cover"
                src={`http://localhost:3000${car.image}`}
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
