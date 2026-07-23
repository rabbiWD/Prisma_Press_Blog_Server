import { prisma } from "../../lib/prisma"
import { ICreatePostPayload } from "./post.interface"
import { auth } from './../../middlewares/auth';

const createPost = async (payload: ICreatePostPayload, userId : string)=>{
    const result = await prisma.post.create({
        data: {
            ...payload,
            authorId: userId
        }
    })

    return result
}

const getAllPosts = async()=>{
    const posts = await prisma.post.findMany({
        include:{
            author : {
                omit: {
                    password: true
                }
            },
            comments: true
        }
    })
    return posts
}

const getPostById =()=>{}

const getPostsStates =()=>{}

const getMyPosts =()=>{}

const updatePost =()=>{}

const deletePost =()=>{}

export const postService = {
    createPost,
    getAllPosts,
    getPostById,
    getPostsStates,
    getMyPosts,
    updatePost,
    deletePost
}