import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import router from './router'; // Korrigierter Pfad

createApp(App)
    .use(router) // Verwende den Router in der App
    .mount('#app');
