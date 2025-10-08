// import { Injectable } from "@nestjs/common";
// import { JwtService } from "@nestjs/jwt";
// import { Response } from "express";
// import { User } from "src/Modules/Users/Domain/Entities/user.entity";

// @Injectable()
// export class Users_LoginUseCase {
//   constructor(
//     private readonly jwtService: JwtService, // inject JWT
//   ) {}

//   async execute(user: User, res: Response) {
//     const payload = {
//       sub: user.id,
//       nama: user.nama,
//       email: user.email,
//       role: user.usertype,
//       type: user.type,
//       marketing_code: user.marketing_code,
//       is_active: user.is_active,
//     };

//     const token = this.jwtService.sign(payload);

//     res.cookie("access_token", token, {
//       httpOnly: true,
//       secure: false, //! sesuaikan environment, false untuk localhost
//       sameSite: "lax",
//       maxAge: 60 * 60 * 1000,
//     });

//     return {
//       user,
//     };
//   }
// }
