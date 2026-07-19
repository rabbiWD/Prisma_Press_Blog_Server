import { NextFunction, Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import httpStatus from "http-status";
import { userService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import jwt from "jsonwebtoken";
import config from "../../config";
import { jwtUtils } from "../../utils/jwt";



// const registerUser = async (req: Request, res: Response) => {
//   try {
//     const payload = req.body;

//     const user = await userService.registerUserIntoDB(payload);

//     res.status(httpStatus.CREATED).json({
//       success: true,
//       statusCode: httpStatus.CREATED,
//       message: "User registration successfully",
//       data: {
//         user,
//       },
//     });
//   } catch (error) {}
// };




const registerUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const payload = req.body;
  const user = await userService.registerUserIntoDB(payload);

//   res.status(httpStatus.CREATED).json({
//     success: true,
//     statusCode: httpStatus.CREATED,
//     message: "User registration successfully",
//     data: {
//       user,
//     },
//   });

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User registration successfully",
        data: {
            user
        }
    })

});

const getMyProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    // const {accessToken} = req.cookies;
    // console.log(req.user, "user request");

    // const verifiedToken = jwtUtils.verifyToken(accessToken, config.jwt_access_secret)
   
    // if(typeof verifiedToken === "string"){
    //     throw new Error(verifiedToken)
    // }

    const profile = await userService.getMyProfileFromDB(req.user?.id as string);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,  
        message: "User profile fetched successfully",
        data: {
            profile
        }
    })
    
   
    res.send("Get my profile");
});

const updateMyProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;

    const payload = req.body;

    const updatedProfile = await userService.updateMyProfileInDB(userId, payload);

    sendResponse(res, {
        success:true,
        statusCode: httpStatus.OK,
        message: "User profile updated successfully",
        data: {updatedProfile}
    })
})

export const userController = {
  registerUser,
  getMyProfile,
  updateMyProfile
};
