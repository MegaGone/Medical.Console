import { Injectable } from '@nestjs/common';
import { genSalt, hash, compare } from "bcrypt";

@Injectable()
export class BcryptService {
    constructor() { }

    public static async hash(text: string): Promise<string> {
        const salt = await genSalt();
        return await hash(text, salt);
    }
    
    public static async compare(textToCompare: string, originalText: string): Promise<boolean> {
        return await compare(originalText,textToCompare);
      }
}
