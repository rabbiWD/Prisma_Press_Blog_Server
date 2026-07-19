import { Router } from "express";
import { userController } from "./user.controller";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";

const router = Router();



router.post("/register", userController.registerUser);


router.get(
  "/me",

//   (req: Request, res: Response, next: NextFunction) => {
//     console.log(req.cookies);

//     const { accessToken } = req.cookies;
//     console.log(accessToken);

//     const verifiedToken = jwtUtils.verifyToken(
//       accessToken,
//       config.jwt_access_secret,
//     );

//     if (!verifiedToken.success) {
//       throw new Error(verifiedToken.error);
//     }

//     const { email, name, id, role } = verifiedToken.data as JwtPayload;

//     // const requiredRoles = ["ADMIN", "USER", "AUTHOR"]
//     const requiredRoles = [Role.ADMIN, Role.USER, Role.AUTHOR];
//     if (!requiredRoles.includes(role)) {
//       return res.status(403).json({
//         success: false,
//         statusCode: httpStatus.FORBIDDEN,
//         message:
//           "Forbidden. You don't have permission to access this resources",
//       });
//     }

//     // res.status(200).json({
//     //     success: true,
//     //     statusCode: 200,
//     //     message: "User profile fetched successfully",
//     // })
//     req.user = {
//       email,
//       name,
//       id,
//       role,
//     };
//     next();
//   },

auth(Role.ADMIN, Role.USER, Role.AUTHOR),
  userController.getMyProfile,
);

router.put("/my-profile", auth(Role.ADMIN, Role.USER, Role.AUTHOR),
userController.updateMyProfile);

export const userRoutes = router;
