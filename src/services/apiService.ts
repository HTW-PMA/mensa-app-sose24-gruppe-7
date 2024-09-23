import axios from 'axios';

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
    getMensen() {
        return apiClient.get('/canteen');
    },

    // Weitere API-Endpunkte hier hinzufügen, z.B. für Mahlzeiten, Bewertungen etc.
};
