import { Card, CardBody, CardFooter, CardHeader, Divider, Image } from "@heroui/react";
import CommentCard from "../CommentCard/CommentCard";
import { MessageText } from "iconsax-reactjs";
import { Link } from "react-router";
import CreateComment from "../CreateComment/CreateComment";

export default function PostCard({userPost, comments}) {
    const {createdAt, image, body, user: {name, photo}, commentsCount, _id, topComment} = userPost
    
  return (
     <Card >
      <CardHeader className="flex gap-3">
        <Image
          alt="heroui logo"
          className="bg-gray-400 rounded-full"
          height={40}
          radius="sm"
        //   src="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
        src = {photo}
          width={40}
        />
        <div className="flex flex-col">
          <p className="text-md font-semibold capitalize">{name}</p>
          <p className="text-small text-default-500">{new Date(createdAt).toLocaleDateString("en-CA")}</p>
        </div>
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
    </Card>
  )
}
