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
      <head
        className="relative flex justify-center items-center h-[300px] w-full"
        style={{
          backgroundImage: `url(${homeBanner})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h1 className="absolute  max-w-[1400px] text-white size-11 text-5xl text-nowrap  border text-center w-fit">
          Let's Go Somewhere
        </h1>
        <div className="search w-full h-[100px]  absolute bottom-[-50px] flex items-center px-2">
          <SearchCarpooling />
        </div>
      </head>
      <main className=" w-full h-fit mt-20 container">
        <div className="post-carpooling flex justify-center items-center">
          <img src={TravelingSvg} alt="" width={400} />
          <div>
            <h1 className="text-3xl font-bold">Going Somewhere?</h1>
            <p className="text-lg">
              Share your ride with other people and make money
            </p>
            <Link to="/post-carpooling" className="btn mt-2">
              Post a Carpooling
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;
