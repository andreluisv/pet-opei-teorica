import UserSchema from '../models/user';

export class UserRepository {
    async findOneUser(ra: any) {
        return (
            await UserSchema.findOne({ra:ra})
        );
    }
}