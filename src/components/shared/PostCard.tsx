import { useUserContext } from "@/context/AuthContext";
import { multiFormatDateString } from "@/lib/utils";
import { Models } from "appwrite"
import { Link } from "react-router-dom";
import PostStats from "./PostStats";

type PostCardProps = {
    post: Models.Document;
}

const PostCard = ({ post }: PostCardProps) => {

    // 
    const { user } = useUserContext();

    if (!post.creator) return;

  return (
    <div className="post-card">
        <div className="flex-between">
            <div className="flex items-center gap-3">
                {/* Creator DP */}
                <Link to={`/profile/${post.creator.$id}`}>
                    <img
                      src={post.creator?.imageUrl || '/assets/icons/profile-placeholder.svg'} 
                      alt="creator"
                      className="rounded-full w-12 lg:h-12"
                    />
                </Link>
                {/* Creator name */}
                <div className="flex flex-col">
                    <p className="base-medium lg:body-bold text-light-1">
                        {post.creator.name}
                    </p>
                    <div className="flex-center gap-2 text-light-3">
                        {/* Date and Time */}
                        <p className="subtle-semibold lg:small-regular">
                            {multiFormatDateString(post.$createdAt)}
                        </p>
                        •
                        {/* Location */}
                        <p className="subtle-semibold lg:small-regular">
                            {post.location}
                        </p>
                    </div>
                </div>
            </div>
            {/* Edit button */}
            <Link to={`/update-post/${post.$id}`}
              className={`${user.id !== post.creator.$id && "hidden"}`} 
            >
                <img src="/assets/icons/edit.svg" alt="edit" width={20} height={20} />
            </Link>
        </div>
        {/* Post Details */}
        <Link to={`posts/${post.$id}`}>
            <div className="small-medium lg:base-medium py-5">
                {/* Caption */}
                <p>{post.caption}</p>
                <ul className="flex gap-1 mt-1">
                    {/* Tags */}
                    {post.tags.map((tag: string) => (
                        // Tags
                        <li key={tag} className="text-light-3">
                            #{tag}
                        </li>
                    ))}
                </ul>
            </div>
            {/* Render Image */}
            <img
              src={post.imageUrl || '/assets/icons/profile-placeholder.svg'}
              className="post-card_img"
              alt={`A post by ${post.creator.name}(${post.creator.username})`}
            />
        </Link>
        {/* Likes comments etc */}
        <PostStats post={post} userId={user.id} />
    </div>
  )
}

export default PostCard
