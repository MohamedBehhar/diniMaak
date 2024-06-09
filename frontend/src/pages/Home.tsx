import { getUsers } from "../api/methods";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { Link, useNavigate } from "react-router-dom";
import homeBanner from "../assets/home-banner.jpg";
import SearchCarpooling from "../components/SearchCarpooling";
import TravelingSvg from "../assets/traveling.svg";

const popularRides = [
  {
    from: "Casablanca",
    to: "Rabat",
    search: `?departure=Casablanca&destination=Rabat&departure_day=${
      new Date().toISOString().split("T")[0]
    }&number_of_seats=1&user_id=${localStorage.getItem("id") || ""}`,
  },
  {
    from: "Casablanca",
    to: "Marrakech",
    search: `?departure=Casablanca&destination=Marrakech&departure_day=${
      new Date().toISOString().split("T")[0]
    }&number_of_seats=1&user_id=${localStorage.getItem("id") || ""}`,
  },
  {
    from: "Casablanca",
    to: "Tanger",
    search: `?departure=Casablanca&destination=Tanger&departure_day=${
      new Date().toISOString().split("T")[0]
    }&number_of_seats=1&user_id=${localStorage.getItem("id") || ""}`,
  },
  {
    from: "Casablanca",
    to: "Fes",
    search: `?departure=Casablanca&destination=Fes&departure_day=${
      new Date().toISOString().split("T")[0]
    }&number_of_seats=1&user_id=${localStorage.getItem("id") || ""}`,
  },
];

function Home() {
  const user_id = localStorage.getItem("id");
  const navigate = useNavigate();
  return (
    <div className="h-full w-full">
      <header
        className="relative flex justify-center items-center h-[300px] w-full"
        style={{
          backgroundImage: `url(${homeBanner})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h1 className="absolute   text-white  rounded-md p-1 sm:text-5xl text-xl text-nowrap  border text-center w-fit">
          Let's Go Somewhere
        </h1>
        <div className="search w-full h-[100px]  absolute bottom-[-50px] flex items-center px-2">
          <SearchCarpooling redirect={true} />
        </div>
      </header>
      <main className=" mt-64 sm:mt-20 container">
        <div className="">
          <h1 className="text-3xl font-bold text-center text-cyan-700">
            Popular rides
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-5">
            {popularRides.map((ride, index) => {
              return (
                <div
                className="cursor-pointer hover:shadow-lg transition-all duration-300 ease-in-out"
                  onClick={() => {
                    navigate({
                      pathname: "/carpooling/search",
                      search: ride.search,
                    })
                  }}
                >
                  <div className="p-5 bg-gray-100 rounded-md shadow-md mt-5">
                    <h2 className="text-lg font-bold text-center">
                      {ride.from} - {ride.to}
                    </h2>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="post-carpooling flex sm:flex-row flex-col justify-center items-center">
          <img src={TravelingSvg} alt="" width={400} />
          <div>
            <h1 className="text-3xl font-bold">Going Somewhere?</h1>
            <p className="text-lg">
              Share your ride with other people and make money
            </p>
            <Link to="/post-carpooling" className="btn mt-2">
              <button
                className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded"
                type="button"
              >
                Post a Carpooling
              </button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;
