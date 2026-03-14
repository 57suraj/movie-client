import { useContext, useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";
import Nestedversion from "../nestedversion";
import Newcomment from "./newcomment";
import Reply from "./reply";
import { useCommentsContext } from "../hooks/useCommentsContext";
import { formatDistanceToNow } from "date-fns";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";
import { HiddenRepliesContext } from "../context/HiddenRepliesContext";




const Commentsection = ({ movie, loading }) => {
  const { cc, comments, dispatch, isReplying } = useCommentsContext();
  const { HiddenReplies, setHiddenReplies } = useContext(HiddenRepliesContext)

  // const [cc, setcc] = useState(null);
  const [view, setView] = useState(true);
  const [reply, setReply] = useState(true);
  const { user } = useContext(AuthContext);
  const [collapsed, setCollapsed] = useState(false);

  // const handleReply = (id) => {
  //   if (cc === id) {
  //     dispatch({ type: isReplying ? "reply_off" : "reply_on" });
  //   } else {
  //     setcc(id);
  //     dispatch({ type: "reply_on" });
  //   }
  // };


  const handleDelete = async (id, childrenlength) => {
    if (childrenlength === 0) {
      dispatch({ type: "delete_comment", payload: id });
    } else {
      dispatch({ type: "update", payload: id });
    }

    const response = await fetch(
      import.meta.env.VITE_API_URL + "commentu/" + id,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ` + user.token,
        },
      }
    );

    const json = await response.json();
  };

  const renderComments = (comments) => {
    if (comments.length === 0) {
      return (<p>  </p>)
    }

    return comments.map((comment) => (
      <motion.div


        className={` ${comment.parentid === null ? "md:ml-[10px]" : "ml-[20px] md:ml-[40px]"} mt-[3px]  md:mt-[5px] ${comment.parentid === null ? "mt-[15px] md:mt-[30px]" : null} `}
        key={comment._id}

      >

        <motion.div className=" flex   w-full items-center " style={{
          marginBottom: "10px",
        }}
          initial={{ y: "40px", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ y: { duration: 0.4 }, opacity: { duration: 0.4 } }}
        >
          <strong className={`${comment.userid ? null : "text-gray-400"}  transition-all  duration-1000 shadow-[0_2px_10px_rgba(0,0,0,0.8),0_-0.5px_10px_rgba(0,0,0,0.8)] rounded-3xl pl-3 pr-3 pb-0.5`}>
            @{comment.userid ? comment.userid?.username : "[deleted]"}
          </strong>{" "}
          <i className=" pl-1 pr-1" style={{ fontSize: "12px" }}>
            {" "}
            {formatDistanceToNow(new Date(comment.createdAt), {
              addSuffix: true,
            })}
          </i>{" "}

          {user ? comment.userid && user.userid === comment.userid._id && (
            <button className=" shadow-[0_2px_5px_rgba(0,0,0,0.8),0_-0.5px_5px_rgba(0,0,0,0.8)] transition-transform duration-300 hover:translate-y-[-3px] hover:shadow-[0_2px_20px_rgba(0,0,0,0.8)] cursor-pointer rounded-3xl pl-3 pr-3 pb-0.5"
              onClick={() => {
                handleDelete(comment._id, comment.children.length);
              }}
            >
              Delete
            </button>
          ) : null}

        </motion.div>

        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2 }}
          className={` z-300 relative ${comment.userid ? null : "text-gray-400"
            } text-left shadow-[0_5px_20px_rgba(0,0,0,0.8),0_-0.5px_20px_rgba(0,0,0,0.8)] rounded-md pl-4 pt-2 pb-2 w-[98%] `}
          style={{
            background: comment.parentid === null
              ? "linear-gradient(155deg, #111c35 45%,#050913  75%,#111c35  100%)"
              : "#111c35"
          }}
          onDoubleClick={() => {
            HiddenReplies.includes(comment._id) ? setHiddenReplies(prev => prev.filter(id => id !== comment._id)) : setHiddenReplies(prev => [...prev, comment._id])
          }}
        >
          {comment.text}
          {comment.children && comment.children.length > 0 && <div className="flex flex-col justify-center  absolute  top-0 bottom-0 -left-7 "  ><button className="cursor-pointer z-1  rounded-full border-white py-4 px-3 flex flex-col text-center items-center justify-center  "
            onClick={() => {
              HiddenReplies.includes(comment._id) ? setHiddenReplies(prev => prev.filter(id => id !== comment._id)) : setHiddenReplies(prev => [...prev, comment._id])

            }}
          > <motion.span
              animate={{ rotate: HiddenReplies.includes(comment._id) ? 0 : 90 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              style={{ display: "inline-flex", originX: "50%", originY: "50%" }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
            </motion.span></button></div>}
        </motion.div>

        {/* reply component */}

        <motion.div className=" "
          initial={{ y: "-40px", opacity: 0 }}
          animate={{
            y: 0,
            opacity: 1,
            marginBottom: cc === comment._id ? "70px" : "0",
            height: cc === comment._id ? "50px" : "30px"
          }}
          transition={{
            marginBottom: { duration: 0.5 },
            height: { duration: 0.5 },
            y: { duration: 0.4 },
            opacity: { duration: 0.7 }
          }}
        // style={{ height: cc === comment._id ? "50px" : "30px", marginBottom: cc === comment._id ? "70px" : "0", }}
        >
          <Reply movie={movie} comment={comment} />
        </motion.div>

        {/* children loop*/}
        {/* {console.log(comment.parentid)} */}
        {comment.children && comment.children.length > 0 && (
          <motion.div className={` overflow-hidden `}
            initial={{ scaleX: HiddenReplies.includes(comment._id) ? 0.9 : 1, y: HiddenReplies.includes(comment._id) ? "10px" : 0, height: HiddenReplies.includes(comment._id) ? "0" : "auto", opacity: HiddenReplies.includes(comment._id) ? 0 : 1, pointerEvents: HiddenReplies.includes(comment._id) ? "none" : "auto" }}
            animate={{ scaleX: HiddenReplies.includes(comment._id) ? 0.9 : 1, y: HiddenReplies.includes(comment._id) ? "10px" : 0, height: HiddenReplies.includes(comment._id) ? "0" : "auto", opacity: HiddenReplies.includes(comment._id) ? 0 : 1, pointerEvents: HiddenReplies.includes(comment._id) ? "none" : "auto" }}
            transition={{ duration: 0.4, height: { duration: 0.4 }, opacity: { duration: 0.4 } }}>

            {renderComments(comment.children)}
          </motion.div>
        )}
      </motion.div >
    ));
  };

  return (
    <div className="text-[10px] sm:w-[90%] md:w-[60%]  md:text-[16px] "
      style={{

        margin: "auto",
        textAlign: "center",

        padding: "5px",

      }}
    >

      <br></br>

      <Newcomment movie={movie} />

      <div className={`px-5 md:px-0`} >
        <h1 className=" transition-all duration-1000 font-extrabold text-orange-600">{loading ? "Loading comments..." : comments.length === 0 ? "No comments yet" : "Comments:"}</h1>
        {comments && renderComments(Nestedversion(comments))}
      </div>
    </div>
  );
};

export default Commentsection;
