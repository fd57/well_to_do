import { initializeApp } from '@firebase/app';
// import { getAnalytics } from "firebase/analytics";
import Constants from 'expo-constants';

import { getFirestore } from '@firebase/firestore';

const firebaseConfig = {
    apiKey: Constants.expoConfig.extra?.apiKey,
    authDomain: Constants.expoConfig.extra?.authDomain,
    // databaseURL: Constants.expoConfig.extra?.databaseURL,
    projectId: Constants.expoConfig.extra?.projectId,
    storageBucket: Constants.expoConfig.extra?.storageBucket,
    messagingSenderId: Constants.expoConfig.extra?.messagingSenderId,
    appId: Constants.expoConfig.extra?.appId,
    // measurementId: Constants.expoConfig.extra?.measurementId
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);