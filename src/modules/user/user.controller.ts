import { NextFunction, Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import httpStatus from "http-status";
import { userService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";



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

export const userController = {
  registerUser,
};
