// Types for the API
/* Canteen */
type GeoLocation = {
    longitude: number;
    latitude: number;
};

type Address = {
    street: string;
    city: string;
    zipcode: string;
    district: string;
    geoLocation: GeoLocation;
};

type ContactInfo = {
    email: string;
    phone: string;
};

type BusinessHour = {
    openAt: string;
    closeAt: string;
    businessHourType: string;
};

type BusinessDay = {
    day: string;
    businessHours: BusinessHour[];
};

export type Mensa = {
    name: string;
    address: Address;
    contactInfo: ContactInfo;
    url: string;
    clickAndCollect: boolean;
    businessDays: BusinessDay[];
    canteenReviewData: any[]; // Assuming the review data structure is not provided
    universities: string[];
    lastUpdated: string;
    id: string;
};

/* Menue */
export interface Menue {
    date: string;
    canteenId: string;
    meals: string[];
}


/* Meal */

export type Meal = {
    prices: {
        priceType: string;
        price: number;
    }[];
    additives: string[];
    badges: string[];
    category: string;
    name: string;
    waterBilanz: number;
    co2Bilanz: number;
    id: string;
};

/* Badge */

export type Badge = {
    name: string;
    description: string;
    id: string;
};

export type Badges = Badge[];