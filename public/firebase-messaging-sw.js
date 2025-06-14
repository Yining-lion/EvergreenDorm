importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyC5dtrxnI76MYw6843xaAL-w0Ww9ecDwg4",
  authDomain: "dorm-3f905.firebaseapp.com",
  projectId: "dorm-3f905",
  storageBucket: "dorm-3f905.firebasestorage.app",
  messagingSenderId: "111373219078",
  appId: "1:111373219078:web:be3b6aa9cf7d96e4e29a87"
});

const messaging = firebase.messaging();

// 選擇性：定義通知點擊行為
messaging.onBackgroundMessage(function (payload) {
  console.log("[firebase-messaging-sw.js] Received background message", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/images/小logo.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
