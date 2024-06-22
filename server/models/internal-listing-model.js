import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const ListingSchema = new Schema(
    {
        title: { type: String, required: true },
        createdBy: {
            type: ObjectId,
            ref: 'User',
            required: true,
        },
        listingType: {
            type: String,
            enum: ['for-rent', 'for-sale'],
            required: true,
        },
        description: { type: String, required: false },
        availableDate: { type: Date, default: Date.now, required: true },
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
        location: {
            address: { type: String, required: true },
            aptOrSuite: { type: String, required: false },
            city: { type: String, required: true },
            state: { type: String, required: true },
            zipCode: { type: String, required: true },
        },
        coordinates: {
            lat: { type: Number, required: false },
            lng: { type: Number, required: false },
        },
        features: {
            bedrooms: { type: Number, required: true },
            bathrooms: { type: Number, required: true },
            sqft: { type: Number, required: true },
        },
        contactInfo: {
            agentCompany: { type: String, required: true },
            agentName: { type: String, required: true },
            agentPhone: { type: String, required: false },
            email: { type: String, required: true },
        },
        media: {
            imageUrls: [{ type: String }],
            refUrl: { type: String, required: false },
        },
        homeAge: { type: Number, required: false },
        petPolicy: {
            type: [String],
            enum: ['Dogs', 'Cats', 'No Pets Allowed'],
            required: false,
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
ListingSchema.set('collection', 'InternalListing');

const InternalListingModel = mongoose.model('InternalListing', ListingSchema);
export default InternalListingModel;
