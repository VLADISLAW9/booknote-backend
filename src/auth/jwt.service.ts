import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { createHmac, timingSafeEqual } from 'crypto';

export interface JwtPayload {
  sub: string;
  email: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtService {
  private readonly secret = process.env.JWT_SECRET ?? 'dev-only-change-me';
  private readonly expiresInSeconds = Number(
    process.env.JWT_EXPIRES_IN ?? 3600,
  );

  sign(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
    if (!this.secret || this.secret.length < 16) {
      throw new InternalServerErrorException('JWT_SECRET must be configured');
    }

    const issuedAt = Math.floor(Date.now() / 1000);
    const fullPayload: JwtPayload = {
      ...payload,
      iat: issuedAt,
      exp: issuedAt + this.expiresInSeconds,
    };
    const encodedHeader = this.base64UrlEncode(
      JSON.stringify({ alg: 'HS256', typ: 'JWT' }),
    );
    const encodedPayload = this.base64UrlEncode(JSON.stringify(fullPayload));
    const unsignedToken = `${encodedHeader}.${encodedPayload}`;
    const signature = this.signData(unsignedToken);

    return `${unsignedToken}.${signature}`;
  }

  verify(token: string): JwtPayload {
    const [encodedHeader, encodedPayload, signature] = token.split('.');

    if (!encodedHeader || !encodedPayload || !signature) {
      throw new UnauthorizedException('Invalid token');
    }

    const unsignedToken = `${encodedHeader}.${encodedPayload}`;
    const expectedSignature = this.signData(unsignedToken);

    if (!this.isEqual(signature, expectedSignature)) {
      throw new UnauthorizedException('Invalid token signature');
    }

    const payload = this.parsePayload(encodedPayload);

    if (!payload.sub || !payload.email) {
      throw new UnauthorizedException('Invalid token payload');
    }

    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      throw new UnauthorizedException('Token has expired');
    }

    return payload;
  }

  private signData(data: string): string {
    return createHmac('sha256', this.secret).update(data).digest('base64url');
  }

  private base64UrlEncode(value: string): string {
    return Buffer.from(value).toString('base64url');
  }

  private parsePayload(encodedPayload: string): JwtPayload {
    try {
      return JSON.parse(
        Buffer.from(encodedPayload, 'base64url').toString('utf8'),
      ) as JwtPayload;
    } catch {
      throw new UnauthorizedException('Invalid token payload');
    }
  }

  private isEqual(actual: string, expected: string): boolean {
    const actualBuffer = Buffer.from(actual);
    const expectedBuffer = Buffer.from(expected);

    return (
      actualBuffer.length === expectedBuffer.length &&
      timingSafeEqual(actualBuffer, expectedBuffer)
    );
  }
}
