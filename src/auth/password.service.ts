import { Injectable } from '@nestjs/common';
import { pbkdf2, randomBytes, timingSafeEqual } from 'crypto';
import { promisify } from 'util';

const pbkdf2Async = promisify(pbkdf2);

@Injectable()
export class PasswordService {
  private readonly iterations = 210_000;
  private readonly keyLength = 64;
  private readonly digest = 'sha512';

  async hash(password: string): Promise<string> {
    const salt = randomBytes(16).toString('base64url');
    const derivedKey = await pbkdf2Async(
      password,
      salt,
      this.iterations,
      this.keyLength,
      this.digest,
    );

    return `${this.iterations}.${salt}.${derivedKey.toString('base64url')}`;
  }

  async verify(password: string, storedHash: string): Promise<boolean> {
    const [iterationsValue, salt, hash] = storedHash.split('.');
    const iterations = Number(iterationsValue);

    if (!iterations || !salt || !hash) {
      return false;
    }

    const derivedKey = await pbkdf2Async(
      password,
      salt,
      iterations,
      this.keyLength,
      this.digest,
    );
    const storedKey = Buffer.from(hash, 'base64url');

    return (
      storedKey.length === derivedKey.length &&
      timingSafeEqual(storedKey, derivedKey)
    );
  }
}
