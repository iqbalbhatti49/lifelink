import { useDeleteSavedPost, useGetCurrentUser, useLikePost, useSavePost } from "@/lib/react-query/queriesAndMutations";
import { checkIsLiked } from "@/lib/utils";
import { Models } from "appwrite"
import React, { useEffect, useState } from "react";
import Loader from "./Loader";

type PostStatsProps = {
    post?: Models.Document;
    userId: string;
};

const PostStats = ({ post, userId }: PostStatsProps) => {

    // Likes
    const likesList = post?.likes.map((user: Models.Document) => user.$id);

    const [likes, setLikes] = useState(likesList);
    const [isSaved, setIsSaved] = useState(false);

    // Hook
    const { mutate: likePost } = useLikePost();
    const { mutate: savePost, isPending: isSavingPost } = useSavePost();
    const { mutate: deleteSavedPost, isPending: isDeletingSaved } = useDeleteSavedPost();

    const { data: currentUser } = useGetCurrentUser(); 
    
    const savedPostRecord = currentUser?.save.find((record: Models.Document) => record.post.$id === post?.$id);

    // work for saved or unsaved
    useEffect(() => {
        // double ! mark mean true or false
        // example: a ? true : false
        setIsSaved(!!savedPostRecord)
    }, [currentUser]);

    // Handler for likes, saved
    const handleLikePost = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
        e.stopPropagation();

        let likesArray = [...likes];

        if (likesArray.includes(userId)) {
        likesArray = likesArray.filter((Id) => Id !== userId);
        } else {
        likesArray.push(userId);
        }

        setLikes(likesArray);
        likePost({ postId: post?.$id || '', likesArray });
    };

    const hanldeSavePost = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
        e.stopPropagation();

        if (savedPostRecord) {
            setIsSaved(false);
            return deleteSavedPost(savedPostRecord.$id);
        } else {
            savePost({ postId: post?.$id || '', userId });
            setIsSaved(true);
        }

    }

  return (
    <div className="flex justify-between items-center z-20">
      {/* Likes */}
      <div className="flex gap-2 mr-5"> 
        <img
          src={checkIsLiked(likes, userId) ? "/assets/icons/liked.svg" : "/assets/icons/like.svg"}            alt="like"
          width={20}
          height={20}
          onClick={(e) => handleLikePost(e)}
          className="cursor-pointer"
        /> 
        <p className="small-medium lg:base-medium">{likes.length}</p>
      </div>

      {/* Save */}
      <div className="flex gap-2">
        {isSavingPost || isDeletingSaved ? <Loader /> : 
          <img
            src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
            alt="save"
            width={20}
            height={20}
            onClick={(e) => hanldeSavePost(e)}
            className="cursor-pointer"
          />
        }
      </div>
    </div>
  )
}

export default PostStats
