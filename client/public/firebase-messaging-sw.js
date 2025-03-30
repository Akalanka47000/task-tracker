// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');

firebase.initializeApp({
  apiKey: 'AIzaSyA_cJo_4aFo2q6dMFsKFd8nwaDUNO23HcE',
  authDomain: 'playground-6d807.firebaseapp.com',
  databaseURL: 'https://playground-6d807-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'playground-6d807',
  storageBucket: 'playground-6d807.appspot.com',
  messagingSenderId: '103568601075',
  appId: '1:103568601075:web:8036de314d2e606593ac86',
  measurementId: 'G-444D3VQ1T6'
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  const notificationTitle = payload.data?.title;
  const notificationOptions = {
    body: payload.data?.body
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});
