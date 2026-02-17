import axios from "axios"
import { useContext, useEffect, useState } from "react";
import Loading from "../Loading/Loading";
import PostCard from "../../Components/PostCard/PostCard";
import CreatePost from "../../Components/CreatePost/CreatePost";
import Skeleton from 'react-loading-skeleton'
import { useQuery } from "@tanstack/react-query";
import AppButton from "../../Shared/AppButton/AppButton";
import  { AuthUserContext } from "../../Context/AuthContextProvider/AuthContextProvider";


// use Suspense 
// TANStack query 

export default function Posts() {
  // const [allPosts, setAllPosts] = useState(null)
  
  const {userData} = useContext(AuthUserContext)

  function getAllPosts() {
    return axios.get(`${import.meta.env.VITE_BASE_URL}posts`, {
      headers: {

        token: localStorage.getItem('token')
      }
    });
    // setAllPosts(posts);
  }

  // useEffect(function() {
  //   getAllPosts();
  // }, [])

 const {data, isLoading, isFetching, isError, error} = useQuery({
  queryKey: ["allPostss"],
  queryFn:getAllPosts,
  // refetchInterval: 200,
  // refetchOnMount: false,
  // gcTime: 300,
  // enabled: false,
select: function(data) {
  return data.data.data.posts
},
// staleTime: 1000 * 60 * 60 * 24 * 5
// retry:  2,
// retryDelay: 2000
 })
 
 if(isLoading) {
   return <div className="max-w-3xl mx-auto space-y-5 mt-4">
      {Array.from({length: 50}).map( e => <div key={e}><Skeleton  className="h-100" baseColor="gray"/></div>)}
      </div>
  }
  // console.log(data.data.data)
  

  if(isError) {
    return <h1 className="text-7xl">Error Error</h1>
  }



  return (
    <>
    <title>Post Page </title>
    <meta name="description" content="" />
{data ?  <div className="max-w-3xl mx-auto space-y-5 mt-4">
     <>
     <CreatePost/>
      {data.map(function(e){
        return <PostCard key={e._id} userPost = {e}/>
      })}
     </>
    </div> : "" 
    
    //  <AppButton color="success" variant='bordered' onClick={function(){refetch()}}>Get Data</AppButton>
    }

   

    </>
  )
}
