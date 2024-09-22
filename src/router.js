import { createRouter, createWebHistory } from 'vue-router';
import Home from './pages/Home.vue';
import Login from './pages/Login.vue';
import SignUp from './pages/SignUp.vue';
import WeekView from './pages/WeekView.vue';
import DishDetail from './components/DishDetail.vue';  // Stelle sicher, dass dies importiert ist
import StudentCredit from './pages/StudentCredit.vue';

const routes = [
    { path: '/', name: 'Home', component: Home },
    { path: '/login', name: 'Login', component: Login },
    { path: '/signup', name: 'SignUp', component: SignUp },
    { path: '/weekview', name: 'WeekView', component: WeekView },
    { path: '/dish/:id', name: 'DishDetail', component: DishDetail },
    { path: '/studentcredit', name: 'StudentCredit', component: StudentCredit },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
