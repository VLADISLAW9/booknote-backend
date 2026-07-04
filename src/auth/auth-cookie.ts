import { UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';

export function extractCookieValue(
  request: Request,
  cookieName: string,
): string | null {
  const cookieHeader = request.headers.cookie;

  if (!cookieHeader) {
    return null;
  }

  const cookies = cookieHeader.split(';').map((cookie) => cookie.trim());
  const tokenCookie = cookies.find((cookie) =>
    cookie.startsWith(`${cookieName}=`),
  );

  if (!tokenCookie) {
    return null;
  }

  try {
    return decodeURIComponent(tokenCookie.slice(cookieName.length + 1));
  } catch {
    throw new UnauthorizedException('Invalid auth cookie');
  }
}
