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
        price: { type: String, required: true },
        reducedAmount: { type: Number },
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
        location: {
            address: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String, required: true },
            zipCode: { type: String, required: true },
        },
        coordinates: {
            lat: { type: Number, required: false },
            lng: { type: Number, required: false },
        },
        features: {
            bedrooms: { type: String, required: true },
            bathrooms: { type: String, required: true },
            sqft: { type: String },
        },
        contactInfo: {
            agentCompany: { type: String, required: true },
            agentName: { type: String, required: true },
            email: { type: String, required: false },
        },
        media: {
            imageUrls: [{ type: String }],
            refUrl: { type: String, required: false },
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
