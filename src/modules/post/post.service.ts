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

const getPostById = async(postId: string)=>{
    const post = await prisma.post.findUniqueOrThrow({
        where : {
            id: postId
        }
    })

    const updatePost = await prisma.post.update({
        where: {
            id: postId
        },
        data:{
            views:{
                increment:1
            }
        },
        include: {
            author: {
                omit:{
                    password:true
                }
            },
            comments: true
        }
    })

    return updatePost
}

const getPostsStates =()=>{}

const getMyPosts = async(authorId: string)=>{
    const result = await prisma.post.findMany({
        where : {
            authorId
        },
        orderBy: {
            createdAt: "desc"
        },

        include: {
            comments: true,
            author: {
                omit: {
                    password: true
                }
            },
            _count: {
                select:{
                    comments: true
                }
            }
        }
    })

    return result
}

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