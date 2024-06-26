import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormLabel, FormItem, FormMessage, } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "../ui/textarea"
import FileUploader from "../shared/FileUploader"
import { PostValidation } from "@/lib/validation"
import { Models } from "appwrite"
import { useCreatePost, useUpdatePost } from "@/lib/react-query/queriesAndMutations"
import { useUserContext } from "@/context/AuthContext"
import { useToast } from "../ui/use-toast"
import Loader from "../shared/Loader"
 
type PostFormProps = {
  post?: Models.Document;
  action: "Create" | "Update";
};

const PostForm = ({ post, action }: PostFormProps) => {

  // Query
    const { mutateAsync: createPost, isPending: isLoadingCreate } = useCreatePost();
    const { mutateAsync: updatePost, isPending: isLoadingUpdate } = useUpdatePost();

    const { user } = useUserContext();

    const { toast } = useToast();

    const navigate = useNavigate();

     // 1. Define your form.
    const form = useForm<z.infer<typeof PostValidation>>({
        resolver: zodResolver(PostValidation),
        defaultValues: {
          caption: post ? post?.caption : "",
          file: [],
          location: post ? post?.location : "",
          tags: post ? post.tags.join(",") : "",
        },
    });
    
    // Handler
    const handleSubmit = async (values: z.infer<typeof PostValidation>) => {

        // ACTION = UPDATE
        if (post && action === "Update") {
          const updatedPost = await updatePost({
            ...values,
            postId: post.$id,
            imageId: post.imageId,
            imageUrl: post.imageUrl,
          });

          if (!updatedPost) {
            toast({ title: `${action} post failed. Please try again.`, });
          }
          // return the post with full details
          return navigate(`/posts/${post.$id}`);
        }

        //  ACTION = CREATE
        const newPost = await createPost({
          ...values,
          userId: user.id,
        });

        if (!newPost) {
          toast({ title: `${action} post failed. Please try again.`, });
        } else {
          navigate('/');
        }

        // navigate('/');
    };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-9 w-full max-w-5xl">
        {/* select photos */}
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Photos</FormLabel>
              <FormControl>
                {/* file uploader components */}
                <FileUploader 
                  fieldChange = {field.onChange}
                  mediaUrl = {post?.imageUrl}
                />
              </FormControl>
              {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        {/* Caption etc */}
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              {/* <FormLabel className="shad-form_label">Caption</FormLabel> */}
              <FormControl>
                <Textarea placeholder="Caption, Emojies, Hashtags, Mentions" className="shad-input custom-scrollbar" {...field} />
              </FormControl>
              {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        
        {/* for add location */}
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              {/* <FormLabel className="shad-form_label">Add Location</FormLabel> */}
              <FormControl>
                <Input type="text" className="shad-input" placeholder="Add Location" {...field} />
              </FormControl>
              {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        {/*  */}
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Tags (Separated by comma " , ")</FormLabel>
              <FormControl>
                <Input 
                  type="text" 
                  className="shad-input" 
                  placeholder='Art, Sports, Learn, Photography etc' 
                  {...field}
                />
              </FormControl>
              {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        {/* Post Button */}
        <div className="flex gap-4 items-center justify-en">
            <Button 
              type="button" 
              className="shad-button_dark_ 4"
              onClick={() => navigate(-1)} >
              Cancel
            </Button>
            <Button
              type="submit"
              className="shad-button_primary whitespace-nowrap"
              disabled={isLoadingCreate || isLoadingUpdate}>
            {isLoadingCreate || isLoadingUpdate && <Loader />}
            {action} Post
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default PostForm
