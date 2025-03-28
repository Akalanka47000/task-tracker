import { Response } from 'express';

export class Cookies {
  private static setCookie(res: Response, name: string, value: string, expiry: number = 1) {
    res.cookie(name, value, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: expiry * 60 * 60 * 1000
    });
  };

  /**
   * @descriptions Adds an access token and a refresh token to the response cookies.
   */
  public static setTokens(response: Response, accessToken: string, refreshToken: string) {
    this.setCookie(response, 'access_token', accessToken, 1);
    this.setCookie(response, 'refresh_token', refreshToken, 24 * 30);
  };


  /**
   * @description Clears the access and refresh tokens from the response cookies.
   */
  public static clearTokens(response: Response) {
    response.clearCookie('access_token');
    response.clearCookie('refresh_token');
  };
}