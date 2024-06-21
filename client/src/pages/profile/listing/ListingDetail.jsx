// enable user to view their created listings and be able to edit/delete the listings
// maybe add an attribute called on-market to enable user to hide without deleting the listing

import { useParams } from 'react-router-dom';

export default function ListingDetailsPage() {
    const { listingId } = useParams();
    console.log('The listingId in the ListingDetail component: ' + listingId);

    return <div>This is the listing detail for listing ID: {listingId}</div>;
}
