import { NextFunction, Request, Response, Router } from "express";
import { userController } from "./user.controller";
import { jwtUtils } from "../../utils/jwt";
import config from "../../config";
import { Role } from "../../../generated/prisma/enums";
import httpStatus from "http-status"



const router = Router();

declare global {
    namespace Express {
        interface Request {
            user?: {
                email: string;
                name: string;
                id: string;
                role: Role;
            }
        }
    }
}

router.post("/register", userController.registerUser);
router.get("/me",(req:Request, res:Response, next: NextFunction) =>{
    console.log(req.cookies)

     const {accessToken} = req.cookies;
    console.log(accessToken);

    const verifiedToken = jwtUtils.verifyToken(accessToken, config.jwt_access_secret);

    // console.log(verifiedToken)

    if(typeof verifiedToken === "string"){
        throw new Error(verifiedToken);
    }
    
     const { email, name, id, role} = verifiedToken;

     // const requiredRoles = ["ADMIN", "USER", "AUTHOR"]
    const requiredRoles = [Role.ADMIN, Role.USER, Role.AUTHOR]
    if (!requiredRoles.includes(role)){
        return res.status(403).json({
        success: false,
        statusCode: httpStatus.FORBIDDEN,
        message: "Forbidden. You don't have permission to access this resources",
    })
    }



    // res.status(200).json({
    //     success: true,
    //     statusCode: 200,
    //     message: "User profile fetched successfully",
    // })
     req.user = {
        email,
        name,
        id,
        role
    }
    next();
}, userController.getMyProfile);

export const userRoutes = router;