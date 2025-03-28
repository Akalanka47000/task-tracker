// import { default as bcrypt } from 'bcryptjs';
// import { Blacklist, JWT} from '@/modules/auth/utils';
// import { Injectable } from '@nestjs/common';
// import { ERRORS } from '../../constants';

// @Injectable()
// export class AuthService {
//   async login({ username, password }: Pick<IUser, 'username' | 'password'>) {
//     const user = await getUserByUsername(username);
//     if (!user) throw ERRORS.INVALID_CREDENTIALS;
//     if (!user.password || !bcrypt.compareSync(password!, user.password)) {
//       throw ERRORS.INVALID_CREDENTIALS;
//     }
//     updateUserById(user.id, { last_login_time: new Date() });
//     return {
//       user,
//       ...JWT.generate(user)
//     };
//   }
// }

// export const login = async () => {

// };

// export const register = (user: IUser, existingUser?: IUser) => {
//   const next = (user: IUser) => {
//     return {
//       user,
//       ...generateTokens(user)
//     };
//   };
//   if (existingUser) {
//     return updateUserById(existingUser._id, user).then(next);
//   }
//   return createUser(user).then(next);
// };

// export const logout = (token: string) => {
//   return Blacklist.add(token);
// };
