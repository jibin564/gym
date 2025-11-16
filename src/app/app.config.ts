import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const Environment = {
  firebase: {
    apiKey: "AIzaSyCY_0FkBXY7W2f36ApT4LHb0NyaTtNGA6E",
    authDomain: "gymwebsite-eb91c.firebaseapp.com",
    projectId: "gymwebsite-eb91c",
    storageBucket: "gymwebsite-eb91c.appspot.com",   // ✅ fixed suffix
    messagingSenderId: "89772950873",
    appId: "1:89772950873:web:54210f7b2f766f8c007848",
    measurementId: "G-T363YK2TKE"
  },
  adminEmails: ['jibingeorge564@gmail.com']
};
export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
     provideRouter(routes), 
     provideFirebaseApp(() => initializeApp(Environment.firebase)),
           provideAuth(() => getAuth()), provideFirestore(() => getFirestore())]
};
