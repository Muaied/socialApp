import { Avatar, Card, CardBody, CardFooter, CardHeader } from '@heroui/react'
import React, { useState } from 'react'

export default function CommentCard({comment}) {
    const {createdAt, post, commentCreator:{name, photo}, content} = comment;
    const [image,setImage] = useState(null)
  return (
    <Card className="bg-black/85 m-6 text-white">
      <CardHeader className="justify-between">
        <div className="flex gap-5">
          <Avatar
            isBordered
            radius="full"
            size="md"
            onError={function(e){if(e.target.src.includes("undefined")) setImage("https://heroui.com/avatars/avatar-1.png")}}
            src={image}
          />
          <div className="flex flex-col gap-1 items-start justify-center">
            <h4 className="text-small  leading-none font-semibold capitalize ">{name}</h4>
            <h5 className="text-small tracking-tight ">{new Date(createdAt).toLocaleDateString('en-CA')}</h5>
          </div>
        </div>
        
      </CardHeader>
      <CardBody className="px-3 py-0 text-small ">
        {content}
      </CardBody>
      <CardFooter className="gap-3">
        
      </CardFooter>
    </Card>
  )
}
