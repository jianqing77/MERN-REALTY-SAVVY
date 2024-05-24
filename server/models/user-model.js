import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        userName: {
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
            default: null,
        },
        lastName: {
            type: String,
            required: false,
            unique: false,
            default: null,
        },
        phoneNumber: {
            type: String,
            default: null,
            required: false,
            unique: false,
        },
        city: {
            type: String,
            required: false,
            unique: false,
            default: null,
        },
        region: {
            type: String,
            required: false,
            unique: false,
            default: null,
        },
        streetAddress: {
            type: String,
            required: false,
            unique: false,
            default: null,
        },
        postalCode: {
            type: Number,
            required: false,
            unique: false,
        },
        role: {
            type: String,
            default: 'user',
            enum: ['admin', 'user', 'guest'],
        },
        favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'InternalListing' }],
        externalFavorites: [
            {
                propertyID: String, // ID used in the public API
                title: String, // Optional, for quick reference
                lastAccessed: { type: Date, default: Date.now },
            },
        ],
    },
    { timestamps: true },
    { collection: 'users' }
);

const UserModel = mongoose.model('User', UserSchema);
export default UserModel;
