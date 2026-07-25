import { prisma } from "../../lib/prisma";
import { ICreatePostPayload, IPostQuery, IUpdatePostPayload } from "./post.interface";
import { auth } from "./../../middlewares/auth";
import { CommentStatus, PostStatus } from "../../../generated/prisma/enums";
import { title } from 'node:process';
import { PostWhereInput } from "../../../generated/prisma/models";


const createPost = async (payload: ICreatePostPayload, userId: string) => {
  const result = await prisma.post.create({
    data: {
      ...payload,
      authorId: userId,
    },
  });

  return result;
};

const getAllPosts = async (query: IPostQuery) => {
    const limit = query.limit ? Number(query.limit ): 10;
    const page = query.page ? Number(query.page):1;
    const skip = (page-1) * limit
    const sortBy = query.sortBy ? query.sortBy : "createdAt";
    const sortOrder = query.sortOrder ? query.sortOrder : "desc";
    const tags = query.tags ? JSON.parse(query.tags as string) : null
    const tagsArray = Array.isArray(tags) ? tags : []
    console.log("tagsArray", tagsArray)

    const andConditions: PostWhereInput[] = []

    if(query.searchTerm){
      andConditions.push({
        OR:[
           {
                        title: {
                            contains: query.searchTerm,
                            mode: "insensitive"
                        },
                    },
                    {
                         content: {
                            contains: query.searchTerm,
                            mode: "insensitive"
                        }
                    }
        ]
      })
    }

    if(query.title){
      andConditions.push({
        title: query.title
    })
    }

    if(query.content){
      andConditions.push({
        content: query.content
      })
    }

    if(query.authorId){
      andConditions.push({
        authorId: query.authorId
      })
    }

    if(query.isFeatured){
      andConditions.push({
        isFeatured: Boolean(query.isFeatured)
      })
    }

    if(query.tags){
      andConditions.push({
        tags:{   
             hasSome: tagsArray
                  
            }
      })
    }

    if(query.status){
      andConditions.push({
        status: query.status
      })
    }


  const posts = await prisma.post.findMany({
    //// filtering / exact match without AND operations
    // where:{
    //     title: "My Third Post",
    //     content: "Ronaldo"
    // },

    // // filtering / exact match with AND operations
    // where: {
    //   AND: [
    //     {
    //       title: "My Third Post",
    //     },
    //     {
    //       content: "Ronaldo",
    //     },
    //     {
    //       tags: {
    //         equals: ["typescript", "prisma", "express"],
    //       },
    //     },
    //   ],
    // },

    // searching / partial match
    // where:{
    //     title:{
    //         contains: "ronaldo",
    //         mode: "insensitive"
    //     },
        // not ideal for partial match
        // content: {
        //     contains: "Ronaldo"
        // }
    // },

    // searching/ partial search with OR oeration

    // where:{
    //     OR: [
    //         {
    //             title:{
    //                 contains: "Ronaldo",
    //                 mode: "insensitive"
    //             }
    //         },

    //         {
    //             content:{
    //                 contains: "Ronaldo",
    //                 mode: "insensitive"
    //             }
    //         }

    //     ]
    // },

    // combining  search (OR) and filtering(AND)
    // where:{
    //     // filtering & searchig combined
    //     AND:[
    //         {
    //             // searching
    //             OR:[
    //                 {
    //                     title: {
    //                         contains: "Ron",
    //                         mode: "insensitive"
    //                     }
    //                 },

    //                 {
    //                     content: {
    //                         contains: "Ron",
    //                         mode: "insensitive"
    //                     }
                        
    //                 }
    //             ]
    //         },

    //         // filtering

    //         {
    //             title: "Ronaldo Nazario"
    //         },

    //         {
    //             content: "Ronaldo"
    //         }
    //     ]
    // },

    // Pagination with limit or take and skip on page

    // take: 1,
    // skip: 1,
    // skip: 2,
    // skip: 3,
    // skip: 4,
    // page=4 limit /take =1 => skip:(page-1* limit =>
    // page = 3, limit / take = 10 => skip: (page-1)* limit = (3-1)*10=20


    // sort by
    // orderBy:{
    //     createdAt: "desc",
    //     title: "asc",
    //     content: "desc"
    //     // fieldName: asc/desc
    // },


    // dynamic searching, filetering
    // where:{
    //     AND:[

    //         query.searchTerm ? {
    //             OR: [
    //                 {
    //                     title: {
    //                         contains: query.searchTerm,
    //                         mode: "insensitive"
    //                     },
    //                 },
    //                 {
    //                      content: {
    //                         contains: query.searchTerm,
    //                         mode: "insensitive"
    //                     }
    //                 }
    //             ]
    //         } : {},

    //         // title filtring

    //             query.title ? {title: query.title} : {},

    //             // content filtering
    //             query.content ? {content: query.content} : {},

    //             // {
    //             //   tags: {
    //             //     hasSome: [""]
    //             //   }
    //             // }
            
    //     ]
    // },

    // dynamic pagination, filtering
   
    where: {
      AND: andConditions
    },


    take:limit,
    skip: skip,

    orderBy: {
        // sortBy : sortOrder
        [sortBy] : sortOrder
    },


    include: {
      author: {
        omit: {
          password: true,
        },
      },
      comments: true,
    },
  });
  return posts;
};

// const getPostById = async(postId: string)=>{
//     const post = await prisma.post.findUniqueOrThrow({
//         where : {
//             id: postId
//         }
//     })

//     const updatePost = await prisma.post.update({
//         where: {
//             id: postId
//         },
//         data:{
//             views:{
//                 increment:1
//             }
//         },
//         include: {
//             author: {
//                 omit:{
//                     password:true
//                 }
//             },
//             comments: true
//         }
//     })

//     return updatePost
// }

const getPostById = async (postId: string) => {
  //  await prisma.post.update({
  //     where: {
  //         id: postId
  //     },
  //     data:{
  //         views:{
  //             increment:1
  //         }
  //     },

  // })

  // throw new Error("fake error")

  // const post = await prisma.post.findUniqueOrThrow({
  //     where:{
  //         id: postId
  //     },
  //     include:{
  //         author:{
  //             omit: {
  //                 password: true
  //             }
  //         },
  //         comments:{
  //             where:{
  //                 status:CommentStatus.APPROVED
  //             },

  //             orderBy: {
  //                 createdAt: "desc"
  //             }
  //         },

  //         _count:{
  //             select:{
  //                 comments:true
  //             }
  //         }
  //     }
  // })

  // return post

  const transacctionResult = await prisma.$transaction(async (tx) => {
    await tx.post.update({
      where: {
        id: postId,
      },
      data: {
        views: {
          increment: 1,
        },
      },
    });

    // throw new Error("fake error")

    const post = await tx.post.findUniqueOrThrow({
      where: {
        id: postId,
      },
      include: {
        author: {
          omit: {
            password: true,
          },
        },
        comments: {
          where: {
            status: CommentStatus.APPROVED,
          },

          orderBy: {
            createdAt: "desc",
          },
        },

        _count: {
          select: {
            comments: true,
          },
        },
      },
    });
    return post;
  });
  return transacctionResult;
};

const getPostsStates = async () => {
  const transactionResult = await prisma.$transaction(async (tx) => {
    // const totalPosts = await tx.post.count();

    // const totalPublishedPosts = await tx.post.count({
    //     where:{
    //         status: PostStatus.PUBLISHED
    //     }
    // })

    // const totalDraftPosts = await tx.post.count({
    //     where:{
    //         status: PostStatus.DRAFT
    //     }
    // })

    // const totalArchivedPosts = await tx.post.count({
    //     where:{
    //         status: PostStatus.ARCHIVED
    //     }
    // })

    // const totalComments = await tx.comment.count();

    // const totalApprovedComments = await tx.comment.count({
    //     where:{
    //         status: CommentStatus.APPROVED
    //     }
    // })

    //  const totalRejectedComments = await tx.comment.count({
    //     where:{
    //         status: CommentStatus.REJECT
    //     }
    // });

    // // Not a good approach
    // const allPosts = await tx.post.findMany();

    // let totalPostViews = 0;

    // allPosts.forEach((post)=>{
    //     totalPostViews = totalPostViews + post.views
    // })

    // const totalPostViewsAggregate = await tx.post.aggregate({
    //     _sum:{
    //         views: true
    //     }
    // });

    // const totalPostViews = totalPostViewsAggregate._sum.views

    // return {
    //     totalPosts,
    //     totalPublishedPosts,
    //     totalDraftPosts,
    //     totalArchivedPosts,
    //     totalComments,
    //     totalApprovedComments,
    //     totalRejectedComments,
    //     totalPostViews
    // }

    const [
      totalPosts,
      totalPublishedPosts,
      totalDraftPosts,
      totalArchivedPosts,
      totalComments,
      totalApprovedComments,
      totalRejectedComments,
      totalPostViewsAggregate,
    ] = await Promise.all([
      await tx.post.count(),
      await tx.post.count({
        where: {
          status: PostStatus.PUBLISHED,
        },
      }),
      await tx.post.count({
        where: {
          status: PostStatus.DRAFT,
        },
      }),
      await tx.post.count({
        where: {
          status: PostStatus.ARCHIVED,
        },
      }),
      await tx.comment.count(),
      await tx.comment.count({
        where: {
          status: CommentStatus.APPROVED,
        },
      }),
      await tx.comment.count({
        where: {
          status: CommentStatus.REJECT,
        },
      }),

      await tx.post.aggregate({
        _sum: {
          views: true,
        },
      }),
    ]);

    return {
      totalPosts,
      totalPublishedPosts,
      totalDraftPosts,
      totalArchivedPosts,
      totalComments,
      totalApprovedComments,
      totalRejectedComments,
      totalPostViews: totalPostViewsAggregate._sum.views,
    };
  });
  return transactionResult;
};

const getMyPosts = async (authorId: string) => {
  const result = await prisma.post.findMany({
    where: {
      authorId,
    },
    orderBy: {
      createdAt: "desc",
    },

    include: {
      comments: true,
      author: {
        omit: {
          password: true,
        },
      },
      _count: {
        select: {
          comments: true,
        },
      },
    },
  });

  return result;
};

const updatePost = async (
  postId: string,
  payload: IUpdatePostPayload,
  authorId: string,
  isAdmin: boolean,
) => {
  const post = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
  });

  if (!isAdmin && post.authorId !== authorId) {
    throw new Error("You are not the owner of this post!");
  }

  const result = await prisma.post.update({
    where: {
      id: postId,
    },
    data: payload,
    include: {
      author: {
        omit: {
          password: true,
        },
      },
      comments: true,
    },
  });
  return result;
};

const deletePost = async (
  postId: string,
  authorId: string,
  isAdmin: boolean,
) => {
  const post = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
  });
  if (!isAdmin && post.authorId !== authorId) {
    throw new Error("You are not the owner of this post!");
  }

  await prisma.post.delete({
    where: {
      id: postId,
    },
  });
};

export const postService = {
  createPost,
  getAllPosts,
  getPostById,
  getPostsStates,
  getMyPosts,
  updatePost,
  deletePost,
};
