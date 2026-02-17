import axios from 'axios'
import React, { useState } from 'react'
import { axiosInterceptos } from '../../Shared/axiosInterceptors/axiosInterceptors'
import { useQuery } from '@tanstack/react-query'

export default function usePostDetails(id) {
    // useState() // state, func
    // useForm() // {hande}
  function getSinglePostDetails() {
        return axios({
            url: `${import.meta.env.VITE_BASE_URL}posts/${id}`,
            method: "GET",
            headers: {
                token: localStorage.getItem('token')
            }
        })
        // setPost(post)
    }

    // axios interceptor

    // useEffect(function() {
    //     getSinglePostDetails()
    // }, [])


    function getPostComment() {
        return axiosInterceptos.get(`posts/${id}/comments?page=1&limit=10`)
    }

    const {data:commentData, isLoading:commentLoading} = useQuery({
        queryKey: ["comments", id],
        queryFn: getPostComment,
        select: (commentData) => commentData.data.data.comments
    })

    const {data, isLoading} = useQuery({
        queryKey: ["PostDetails", id],
        queryFn: getSinglePostDetails,
    })

    return {commentData, commentLoading, data, isLoading}
}
