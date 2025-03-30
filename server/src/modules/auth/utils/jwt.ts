import { moduleLogger } from '@sliit-foss/module-logger';
import { default as jwt } from 'jsonwebtoken';
import { default as config } from '@/config';
import { ERRORS } from '../constants';

export class JWT {
  private static logger = moduleLogger('Jwt');

  public static verify(token: string, ignoreExpiry: boolean = false) {
    try {
      const verificationMethod: Function = ignoreExpiry ? jwt.decode : jwt.verify;
      return verificationMethod(token, config.JWT_SECRET);
    } catch (error) {
      this.logger.error(`Jwt verification failed - ${error.message}`);
      if (error.message === 'jwt expired') {
        throw ERRORS.TOKEN_EXPIRED;
      }
      throw ERRORS.INVALID_TOKEN;
    }
  }
  public static generate(user: IUser) {
    delete user.password;
    delete user.last_login_time;
    const accessToken = jwt.sign(JSON.parse(JSON.stringify(user)), config.JWT_SECRET, {
      expiresIn: config.ACCESS_TOKEN_EXPIRY as any
    });
    const refreshToken = jwt.sign(
      {
        access_token: accessToken
      },
      config.JWT_SECRET,
      {
        expiresIn: config.REFRESH_TOKEN_EXPIRY as any
      }
    );
    return { access_token: accessToken, refresh_token: refreshToken };
  }
}
