import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const ListingSchema = new Schema(
    {
        title: { type: String, required: true },
        listingType: {
            type: String,
            enum: ['Lease', 'Sell'],
            required: true,
        },
        description: { type: String, required: true },
        listingDate: { type: Date, default: Date.now },
        listingStatus: {
            type: String,
            enum: ['Active', 'Pending', 'Off Market'],
            default: 'Active',
        },
        price: { type: Number, required: true },
        propertyType: {
            type: String,
            enum: [
                'Single-family Home',
                'Multi-family Home',
                'Condo',
                'Townhouse',
                'Apartment',
                'Other',
            ],
            required: true,
        },
        yearBuilt: { type: Number },
        location: {
            address: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String, required: true },
            zipCode: { type: String, required: true },
        },
        features: {
            bedrooms: { type: Number, required: true },
            bathrooms: { type: Number, required: true },
            squareFootage: { type: Number },
            lotSize: { type: Number },
            parking: { type: String },
            heatingAndCooling: { type: String },
        },
        contactInfo: {
            fistName: { type: String, required: true },
            lastName: { type: String, required: true },
            agency: { type: String, required: true },
            phoneNumber: { type: String, required: true },
            email: { type: String, required: true },
        },
        media: {
            imageUrl: [{ type: String }],
        },
        metadata: {
            views: { type: Number, default: 0 },
            favorites: { type: Number, default: 0 },
            tags: [{ type: String }],
        },
    },
    { timestamps: true }
);

// The collection name 'listings' is specified here.
ListingSchema.set('collection', 'listings');

const ListingModel = mongoose.model('Listing', ListingSchema);
export default ListingModel;
