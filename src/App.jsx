import { SpeedInsights } from "@vercel/speed-insights/react"
import React, { useContext } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Navbar from "./components/navbar";

import Movies from "./movies";
import Moviepage from "./moviePage";
import Selectedcomment from "./selectedcomment";
import Signup from "./auth/signup";
import Users from "./auth/allusers";
import Login from "./auth/login";
import { AuthContext } from "./context/AuthContext";
import { MyComments } from "./mycomments";
import { Loading } from "./loading";
import { LoadingContext } from "./context/loadingContext";
import useFetch from "./hooks/useFetch";
import MovieCard from "./tmdbmovie";
import { Mix } from "./auth/mix";
import { Spacer } from "./spacer";
import ContinuousTabs from "./extra";
import { motion } from "framer-motion";
import { Navcontextprovider } from "./context/navContext";
import Search from "./components/search";

function App() {
  const { user, loading } = useContext(AuthContext);
  const { isloading } = useContext(LoadingContext);

  const { loading: serverloading, error } = useFetch(
    import.meta.env.VITE_API_URL + "movies/"
  );

  if (error) {

    return (
      <h1 className=" text-red-600 text-2xl lg:text-7xl">{error}, try refreshing</h1>
    )
  }

  if (serverloading) {
    return (
      <>
        <SpeedInsights />
        <motion.div
          initial={{ y: "100vh" }}


          animate={{ y: 0 }}
          transition={{ type: "spring", bounce: 0.1, duration: 1.1, delay: 1.5, }}
          className="please  top-[35%]  fixed ">SERVER COLD-START</motion.div>


        <motion.div
          initial={{ y: "100vh" }}


          animate={{ y: 0 }}
          transition={{ type: "spring", bounce: 0.1, duration: 1, delay: 3.5 }}
          className="please   top-[50%]  fixed ">PLEASE WAIT FOR 20 SECONDS</motion.div>
        {error && <h1>{error}</h1>}
      </>
    );
  }

  return (
    <div className="mt-10">
      <Router>
        <Navbar />

        <Navcontextprovider>

        </Navcontextprovider>

        {/* <Spacer height="50px" /> */}
        {/* <Mix /> */}

        <Routes>
          <Route path="/" element={<Movies />}></Route>
          <Route path="/search" element={<Search />}></Route>

          <Route path="/movies" element={<Movies />}></Route>
          <Route path="/movies/:id" element={<Moviepage />}></Route>
          <Route path="/comments/:id" element={<Selectedcomment />}></Route>
          <Route path="/tmdb" element={<MovieCard />}></Route>
          <Route path="/mix" element={<Mix />}></Route>

          <Route
            path="/signup"
            element={!user ? <Signup /> : <Navigate to="/" />}
          ></Route>
          <Route
            path="/login"
            element={!user ? <Login /> : <Navigate to="/" />}
          ></Route>
          <Route path="/users" element={<Users />}></Route>
          <Route path="/mycomments" element={<MyComments />}></Route>
          <Route path="/extra" element={<ContinuousTabs></ContinuousTabs>}></Route>
        </Routes>

      </Router>
    </div>
  );
}

export default App;
