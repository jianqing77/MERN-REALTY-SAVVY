import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        avatar: {
            type: String,
            default:
                'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
        },
        isAdmin: { type: Boolean, default: false },
        firstName: {
            type: String,
            required: false,
            unique: false,
        },
        lastName: {
            type: String,
            required: false,
            unique: false,
        },
        phoneNumber: {
            type: String,
            default: '000-000-0000',
            required: false,
            unique: true,
        },
        role: {
            type: String,
            default: 'user',
            enum: ['admin', 'user', 'guest'],
        },
    },
    { timestamps: true },
    { collection: 'users' }
);

const UserModel = mongoose.model('User', UserSchema);
export default UserModel;
