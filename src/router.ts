import { createRouter, createWebHistory } from 'vue-router';
import Home from './pages/Home.vue';
import WeekView from './pages/WeekView.vue';
import DishDetail from './components/DishDetail.vue';  // Stelle sicher, dass dies importiert ist
import Setting from './pages/Settings.vue';
import Favorites from './pages/Favorites.vue';


const routes = [
    { path: '/', name: 'Home', component: Home },
    { path: '/weekview', name: 'WeekView', component: WeekView },
    { path: '/dish/:id', name: 'DishDetail', component: DishDetail },
    { path: '/settings', name: 'Setting', component: Setting },
    { path: '/favorites', name: 'Favorites', component: Favorites },


];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
