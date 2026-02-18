import { Card, CardBody, CardFooter, CardHeader, Divider, Image, useDisclosure, Button } from "@heroui/react";
import CommentCard from "../CommentCard/CommentCard";
import { MessageText, Edit, Trash } from "iconsax-reactjs";
import { Link } from "react-router";
import CreateComment from "../CreateComment/CreateComment";
import EditPostModal from "../EditPostModal/EditPostModal";
import DeleteConfirmationModal from "../DeleteConfirmationModal/DeleteConfirmationModal";
import { useContext } from "react";
import { AuthUserContext } from "../../Context/AuthContextProvider/AuthContextProvider";

export default function PostCard({userPost, comments}) {
    const {createdAt, image, body, user: {name, photo, _id: userId}, commentsCount, _id, topComment} = userPost
    const {userData} = useContext(AuthUserContext);
    const {isOpen: isEditOpen, onOpen: onEditOpen, onOpenChange: onEditOpenChange} = useDisclosure();
    const {isOpen: isDeleteOpen, onOpen: onDeleteOpen, onOpenChange: onDeleteOpenChange} = useDisclosure();
    
  const isOwnPost = userData?._id === userId;

  return (
     <Card >
      <CardHeader className="flex gap-3 justify-between items-start">
        <div className="flex gap-3">
          <Image
            alt="heroui logo"
            className="bg-gray-400 rounded-full"
            height={40}
            radius="sm"
            src={photo}
            width={40}
          />
          <div className="flex flex-col">
            <p className="text-md font-semibold capitalize">{name}</p>
            <p className="text-small text-default-500">{new Date(createdAt).toLocaleDateString("en-CA")}</p>
          </div>
        </div>
        {isOwnPost && (
          <div className="flex gap-2">
            <Button isIconOnly variant="light" onPress={onEditOpen}>
              <Edit size="20" className="text-blue-500" />
            </Button>
            <Button isIconOnly variant="light" onPress={onDeleteOpen}>
              <Trash size="20" className="text-red-500" />
            </Button>
          </div>
        )}
      </CardHeader>
      <Divider />
      <CardBody className="text-center">
        <p className="mb-3">{body}</p>
        <img src={image ? image : "https://heroui.com/images/hero-card-complete.jpeg"} alt={name} />
      </CardBody>
      <Divider />
      <CardFooter className=" flex justify-between">
        <div className="flex gap-4 items-center">
            <p >{commentsCount}</p>
        <MessageText size="32" className="text-gray-400"/>
        </div>

       {!comments &&  <Link to={`/postDetails/${_id}`} className="text-blue-400 hover:underline cursor-pointer">All Comment</Link>}
      </CardFooter>
      {!comments && commentsCount > 0 && <CommentCard comment = {topComment}/>}
      {comments && comments.map(e => <CommentCard comment = {e}/>)}

      <div className="m-7">
        <CreateComment id={_id}/>
      </div>

      <EditPostModal isOpen={isEditOpen} onOpenChange={onEditOpenChange} post={userPost} />
      <DeleteConfirmationModal isOpen={isDeleteOpen} onOpenChange={onDeleteOpenChange} postId={_id} />
    </Card>
  )
}