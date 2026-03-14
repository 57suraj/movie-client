import { useContext, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useCommentsContext } from "../hooks/useCommentsContext";
import { AuthContext } from "../context/AuthContext";
import { NavContext } from "../context/navContext";

const Newcomment = ({ movie }) => {
  const { dispatch } = useCommentsContext();
  const { user } = useContext(AuthContext);
  const { setThh } = useContext(NavContext)


  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [parentid, setParentid] = useState("");
  const [movieid, setMovieid] = useState(movie.imdbID);
  const [year, setYear] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newComment = { text, parentid, movieid };

    if (user) {
      setLoading(true)
      const response = await fetch(
        import.meta.env.VITE_API_URL + "newcommentu",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ` + user.token,
          },
          body: JSON.stringify(newComment),
        }
      );
      setText("");

      const json = await response.json();

      dispatch({ type: "create_comment", payload: json });
      dispatch({ type: "reply_off" });
      dispatch({ type: "updatecc", payload: null })
      setLoading(false)
      console.log(json);
      //   window.location.reload();
    } else {
      navigate("/signup");
      setThh(2)

    }
  };

  const neww = (e) => {
    console.log("butoone");
  };

  return (
    <>
      <form className="flex flex-col space-y-2 " onSubmit={handleSubmit}>

        <textarea
          className="overflow-hidden resize-none h-[50px] w-full focus:outline-none border-1 rounded-3xl py-3 px-4 leading-normal border-[#413e56] bg-[#1a2436] focus:bg-[#25324a] focus:border-white transition-colors duration-200"
          type="text"
          placeholder="Add a comment..."
          id="text"
          name="text"
          required
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              if (text.trim()) handleSubmit(e);
            }
          }}
        ></textarea>

        <input type="hidden" name="parentid" value={parentid}></input>

        <input type="hidden" name="movieid" value={movieid}></input>

        <button className={` w-[145px] self-end cursor-pointer px-2 pb-0.5 transition-all duration-300 text-black font-semibold hover:bg-orange-700 rounded-2xl bg-orange-600 shadow-[0_2px_20px_rgba(0,0,0,0.8)]`}
          type="submit">{loading ? "Commenting..." : "Comment"}</button>

      </form>
    </>
  );
};

export default Newcomment;
