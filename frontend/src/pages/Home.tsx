import { getUsers } from "../api/methods";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { Link } from "react-router-dom";
import homeBanner from "../assets/home-banner.jpg";
import SearchCarpooling from "../components/SearchCarpooling";

function Home() {
  const user_id = localStorage.getItem("id");
  return (
    <div className="h-full w-full">
      <div
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
      </div>
    </div>
  );
}

export default Home;
