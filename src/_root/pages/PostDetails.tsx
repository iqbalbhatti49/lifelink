import Loader from "@/components/shared/Loader";
import PostStats from "@/components/shared/PostStats";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/AuthContext";
import { useGetPostById } from "@/lib/react-query/queriesAndMutations"
import { multiFormatDateString } from "@/lib/utils";
import { Link, useParams } from "react-router-dom"


const PostDetails = () => {

  const { id } = useParams();
  const { data: post, isPending} = useGetPostById(id || '');
  const { user } = useUserContext();

  const handleDeletePost = () => {

  }

  return (
    <div className="post_details-container">
      {isPending ? <Loader /> : (
        <div className="post_details-card">
          <img
            src={post?.imageUrl}
            alt={`Post by ${post?.creator.name}`}
            className="post_details-img"
          />
          <div className="post_details-info">
            <div className="flex-between w-full">
                {/* Creator DP */}
                <Link to={`/profile/${post?.creator.$id}`} className="flex items-center gap-3">
                    <img
                      src={post?.creator?.imageUrl || '/assets/icons/profile-placeholder.svg'} 
                      alt="creator"
                      className="rounded-full w-9 h-9 lg:w-12 lg:h-12"
                    />
               
                {/* Creator name */}
                <div className="flex flex-col">
                    <p className="base-medium lg:body-bold text-light-1">
                        {post?.creator.name}
                    </p>
                    <div className="flex-center gap-2 text-light-3">
                        {/* Date and Time */}
                        <p className="subtle-semibold lg:small-regular">
                            {multiFormatDateString(post?.$createdAt)}
                        </p>
                        •
                        {/* Location */}
                        <p className="subtle-semibold lg:small-regular">
                            {post?.location}
                        </p>
                    </div>
                  </div>
                </Link>
                {/* other actions */}
                <div className="flex-center gap-">
                  {/* Edit button */}
                  <Link to={`/update-post/${post?.$id}`} className={`${user.id !== post?.creator.$id && 'hidden'}`}>
                    <img 
                      src="/assets/icons/edit.svg" 
                      width={24}
                      height={24}
                      alt="edit"
                    />
                  </Link>
                  {/* Delete Button */}
                  <Button 
                    onClick={handleDeletePost}
                    variant="ghost"  
                    className={`ghost_details-delete_btn ${user.id !== post?.creator.$id && 'hidden'}`}
                  >
                    <img
                      src="/assets/icons/delete.svg"
                      alt="delete"
                      width={24}
                      height={24}
                    />
                  </Button>
                </div>
              </div>
              {/* Line */}
              <hr className="border w-full border-dark-4/80" />

              {/* Post details */}
              <div className="flex flex-col flex-1 w-full small-medium lg:base-regular">
                {/* Caption */}
                <p>{post?.caption}</p>
                <ul className="flex gap-1 mt-1">
                    {/* Tags */}
                    {post?.tags.map((tag: string) => (
                        // Tags
                        <li key={tag} className="text-light-3">
                            #{tag}
                        </li>
                    ))}
                </ul>
               </div>

               {/* Stats */}
               <div className="w-full">
                <PostStats post={post} userId={user.id} />
               </div>
            </div>
        </div>
      )}
    </div>
  )
}

export default PostDetails
