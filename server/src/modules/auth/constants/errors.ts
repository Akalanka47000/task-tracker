import { UnauthorizedException } from '@nestjs/common';

export const ERRORS = {
    MISSING_TOKEN: new UnauthorizedException('Bearer token is missing'),
    INVALID_TOKEN: new UnauthorizedException('Token is invalid'),
    CANCELLED_TOKEN: new UnauthorizedException('Token has been revoked'),
    INVALID_CREDENTIALS: new UnauthorizedException('Invalid credentials'),
    TOKEN_EXPIRED: new UnauthorizedException('Token has expired'),
};
