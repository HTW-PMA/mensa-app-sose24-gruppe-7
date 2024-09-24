import axios from 'axios';
import { Mensa, Menue, Meal, Badges } from './apiServiceTypes.ts';

const apiClient = axios.create({
    baseURL: 'https://mensa.gregorflachs.de/api/v1',
    headers: {
        'X-API-KEY': 'QrnBvMpc76VD3UIHR3z9V3RFOKBiggVfDaQ71BoO491uI0iweT138FIDxL5F/mN32AeL90HxoVzaKm50hlriD4ww9CA44/8Vz529egLTz99WRVGV82JWeTFW1vmAzHJ9CKPK9f4IWRjTSJaCRISbCt55DUDz7NOBqKQT4EzYh8Obt1khspA2m9KMq9CQBoluKnUyLDNNaYdBGvNw/YRS+ziXebR2Lf+Y7mFW3NECkOJzPqApv/F2G7oK6+SFzwwHeREgAKuG48I0zlb0pJoHaPYHEDPJIR2NUkiIWdbFNjjrkkrI2p2GA/ACzecDvWjQGkdA7YFwAOKQ6TxhPTOWmA==',  // Füge hier deinen API-Schlüssel ein
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
});


export default {

    // Beispiel: Alle Mensen abrufen
    async getMensen(): Promise<Mensa[]> {
        const cachedMensen = localStorage.getItem('mensen');
        if (cachedMensen) {
            return JSON.parse(cachedMensen);
        }

        const response = await apiClient.get('/canteen?loadingtype=lazy');
        localStorage.setItem('mensen', JSON.stringify(response.data));
        return response.data;
    },

    async getMenue(canteenId: string, startDate: string, endDate: string): Promise<Menue[]> {
        const cacheKey = `menue_${canteenId}_${startDate}_${endDate}`;
        const cachedMenue = localStorage.getItem(cacheKey);
        if (cachedMenue) {
            return JSON.parse(cachedMenue);
        }

        const response = await apiClient.get(`/menue?loadingtype=lazy&canteenId=${canteenId}&startdate=${startDate}&enddate=${endDate}`);
        localStorage.setItem(cacheKey, JSON.stringify(response.data));
        return response.data;
    },

    async getMeal(mealId: string): Promise<Meal> {
        const cacheKey = `meal`;
        const cachedMeal = localStorage.getItem(cacheKey);
        if (cachedMeal) {
            return JSON.parse(cachedMeal);
        }

        const response = await apiClient.get(`/meal?loadingtype=lazy&ID=${mealId}`);
        const meal = response.data[0];
        localStorage.setItem(cacheKey, JSON.stringify(meal));
        return meal;
    },

    async getBadges(): Promise<Badges> {
        const storedBadges = localStorage.getItem(`badges`);
        if (storedBadges) {
            return JSON.parse(storedBadges);
        }

        const response = await apiClient.get(`/badge?loadingtype=lazy`);
        const badges = response.data;

        localStorage.setItem(`badges`, JSON.stringify(badges));

        return badges;
    },


    async getAllMealsFromCanteenFromDay(canteenId: string, date: string): Promise<Meal[]> {
        const storedMeals = localStorage.getItem(`meals_${date}`);
        if (storedMeals) {
            return JSON.parse(storedMeals);
        }

        const menues = await this.getMenue(canteenId, date, date);
        var mealIds: string[] = [];

        for (let menue of menues) {
            for (let meal of menue.meals) {
                mealIds.push(meal);
            }
        }

        const meals: Meal[] = [];
        for (let mealId of mealIds) {
            const meal = await this.getMeal(mealId);
            meals.push(meal);
        }

        localStorage.setItem(`meals_${date}`, JSON.stringify(meals));

        return meals;
    },

};

