import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { commentsContext } from "../context/commentscontext";
import { NavContext } from "../context/navContext";

const Reply = ({ movie, comment }) => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [parentid, setParentid] = useState(comment._id);
  const [movieid, setMovieid] = useState(movie.imdbID);
  const [year, setYear] = useState("");
  const [loading, setLoading] = useState(false);
  const { setThh } = useContext(NavContext)
  // const [cc, setcc] = useState(null);

  const { user } = useContext(AuthContext);
  const { cc, dispatch, isReplying } = useContext(commentsContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user) {
      setLoading(true)
      const newComment = { text, parentid, movieid };

      const response = await fetch(import.meta.env.VITE_API_URL + "newcommentu", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ` + user.token,
        },
        body: JSON.stringify(newComment),
      });

      const json = await response.json();
      dispatch({ type: "create_comment", payload: json });
      dispatch({ type: "updatecc", payload: null })
      dispatch({ type: "reply_off" });
      setText("")


      setLoading(false)
    }
    else {
      navigate("/signup")
      setThh(2)
    }
  }



  const handleReply = (id) => {


    if (cc === id) {
      dispatch({ type: isReplying ? "reply_off" : "reply_on" });
      dispatch({ type: "updatecc", payload: null })
    } else {
      dispatch({ type: "reply_off" });
      dispatch({ type: "updatecc", payload: id })
      dispatch({ type: "reply_on" });
    }
  };

  const qq = isReplying ? "5s" : "5s"
  const [likes, setLikes] = useState(comment.likes)
  const [liked, setLiked] = useState(comment.liked)




  const handleLike = async () => {
    if (!user) {
      navigate("/signup")
      return
    }

    const temp = liked

    !liked ? setLikes(likes + 1) : setLikes(likes - 1);
    setLiked(prev => !prev)

    console.log(liked)

    if (!temp) {


      fetch(import.meta.env.VITE_API_URL + "like", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "authorization": `Bearer ` + user.token
        },
        body: JSON.stringify({ userid: user.userid, commentid: comment._id })
      })
    }
    else {
      fetch(import.meta.env.VITE_API_URL + "like/" + comment._id, {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
          "authorization": `Bearer ` + user.token
        }
      }).then(console.log(liked, "deleted"))

    }

  }



  return (
    <div className="h-0 z-10000000 mt-2">
      <div className="flex  z-1 ">
        <div className="ml-2 z-10 cursor-pointer"
          onClick={handleLike}>
          <svg
            width="20"
            height="20"
            viewBox="0 -5 24 24"
            fill={liked ? "#f54900" : "none"}
            stroke={liked ? "#f54900" : "#666"}
            strokeWidth="2"
          >
            <path d="M12 21V3M5 10l7-7 7 7" />
          </svg>
        </div>
        {/* <div className="ml-2 z-10" >{liked ? "liked" : "not liked"}</div> */}
        <div className="ml-2 z-10">{likes}</div>
        {comment.userid && comment.userid._id && (<button className="cursor-pointer ml-7 z-10"
          onClick={() => {
            handleReply(comment._id);
          }}
        >
          Reply
        </button>)}

      </div>
      {/* {cc === comment._id && isReplying ?) : null ( */}


      <form className={"reply flex flex-col space-y-2 pl-[35px]  "}
        style={{
          zIndex: "-10", transition: "transform 0.5s, opacity 0.4s",
          opacity: cc === comment._id && isReplying ? "1" : "0", transform: isReplying ? "translateY(0px)" : "translateY(-89px)",
          pointerEvents: cc === comment._id && isReplying ? "auto" : "none",
        }}
        onSubmit={handleSubmit}>
        <textarea
          className="flex flex-col align-middle overflow-hidden resize-none h-[40px] w-full focus:outline-none border-1 rounded-3xl py-2 px-4 leading-normal border-[#413e56] bg-[#1a2436] focus:bg-[#25324a] focus:border-white transition-colors duration-200"
          style={{ marginTop: "20px" }}
          placeholder={"Reply to @" + (comment.userid && comment.userid.username)}
          type="text"
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
        <div className="self-end space-x-1.5 flex ">
          <button className="cursor-pointer w-[100px] pl-3 pr-3 pb-0.5 transition duration-300 font-semibold rounded-2xl hover:bg-[#0e1115] shadow-[0_2px_20px_rgba(0,0,0,0.8)]" type="button" onClick={() => {
            handleReply(comment._id);
          }}>Cancel</button>
          <button className={`w-[100px] cursor-pointer px-4 pb-0.5 transition-all duration-300 text-black font-semibold hover:bg-orange-700 rounded-2xl bg-orange-600 shadow-[0_2px_20px_rgba(0,0,0,0.8)]`} type="submit">{loading ? "Replying.." : "Reply"}</button>

        </div>
      </form>





    </div >
  );
};

export default Reply;
