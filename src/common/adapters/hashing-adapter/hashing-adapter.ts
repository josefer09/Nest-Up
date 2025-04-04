import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { HashingAdapterInterface } from 'src/common/interfaces';

@Injectable()
export class HashingAdapter implements HashingAdapterInterface {
    async hash(password: string): Promise<string> {
        return bcrypt.hashSync(password, 10);
    }
    async compare(password: string, hash: string): Promise<boolean> {
        const isMatch: boolean = bcrypt.compareSync(password, hash); 
        return isMatch;
    }
}
