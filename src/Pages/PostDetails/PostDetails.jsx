import axios from "axios"
import { useEffect, useState } from "react"
import { useParams } from "react-router"
import PostCard from "../../Components/PostCard/PostCard"
import Loading from "../Loading/Loading"
import { useQuery } from "@tanstack/react-query"
import Skeleton from "react-loading-skeleton"
import { axiosInterceptos } from "../../Shared/axiosInterceptors/axiosInterceptors"
import usePostDetails from "../../Hooks/usePostDetails/usePostDetails"
import Parent from "../../Components/Parent/Parent"

export default function PostDetails() {

    // const [post, setPost] = useState(null)

    const {id} = useParams()

    const {isLoading, commentLoading, commentData, data} = usePostDetails(id)
    

    if(isLoading || commentLoading) {
        return <Skeleton className="h-100"/>
    }



  return (
    <div className="max-w-3xl mx-auto mt-5">
    <PostCard comments={commentData} userPost={data.data.data.post}/>
    <Parent/>
    </div>
  )
}
