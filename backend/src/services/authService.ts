// import { PrismaClient } from "@prisma/client";
// import argon2 from "argon2";

// const prisma = new PrismaClient();

// export const registerUser = async (email: string, password: string) => {
//   const hash = await argon2.hash(password);
//   const user = await prisma.user.create({
//     data: {
//       email,
//       password: hash,
//     },
//   });

//   return user;
// };

// export const authenticateUser = async (email: string, password: string) => {
//   const user = await prisma.user.findUnique({
//     where: {
//       email,
//     },
//   });
//   if (user) {
//     const passwordVerified = await argon2.verify(
//       user?.password as string,
//       password
//     );
//     if (passwordVerified) return user;
//   }
//   return null;
// };
