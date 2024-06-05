import { getUsers } from "../api/methods";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { Link } from "react-router-dom";
import homeBanner from "../assets/home-banner.jpg";
import SearchCarpooling from "../components/SearchCarpooling";
import TravelingSvg from "../assets/traveling.svg";

function Home() {
  const user_id = localStorage.getItem("id");
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
              >Post a Carpooling</button>
            </Link>
          </div>
        </div>

      </main>
    </div>
  );
}

export default Home;
