import { Link, useParams } from "react-router-dom";
import useFetch from "./hooks/useFetch";
import { useContext, useState } from "react";
import { AuthContext } from "./context/AuthContext";
import { Loading } from "./loading";
import { formatDistanceToNow } from "date-fns";

export const MyComments = () => {
  const { user } = useContext(AuthContext);

  const {
    Data = {},
    loading,
    error,
  } = useFetch(
    user ? import.meta.env.VITE_API_URL + "user/" + user.userid : null
  );

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <Loading />
        <h1 className="text-xl text-gray-400">Please log in to view your comments</h1>
      </div>
    );
  }

  const { comments = [] } = Data;

  return (
    <div className="md:w-[60%] mx-auto mt-10 px-5 md:px-0">
      <h1 className="text-xl font-extrabold text-orange-600 mb-6">
        My Comments:
      </h1>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-16 w-full bg-[#1a2436] rounded animate-pulse"></div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <p className="text-gray-400">No comments yet</p>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => (
            <Link
              key={comment._id}
              to={"/movies/" + comment.movieid}
              className="block"
            >
              <div className="bg-[#111c35] hover:bg-[#1a2436] border border-[#2a364d] rounded-md p-4 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 font-bold text-sm">
                    {comment.parentid ? "You replied:" : "You commented:"}
                  </span>
                  
                  {comment.createdAt && (
                    <span className="text-xs text-gray-500 italic">
                      {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                    </span>
                  )}
                </div>
                
                <p className="text-gray-200">
                  {comment.text}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
