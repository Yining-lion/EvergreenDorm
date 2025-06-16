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

  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.data.body || "你有一則新訊息" ,
    icon: "/images/小logo.svg",
    data: {
      roomId: payload.data.roomId,
      roomType: payload.data.roomType,
      isAdmin: payload.data.isAdmin
    }
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener("notificationclick", function (event) {
  const data = event.notification.data
  const roomType = data.roomType;
  const isAdmin = data.isAdmin === "true";
  event.notification.close();

  let targetUrl = "/member/chat";

  if (isAdmin) {
    if (roomType === "global" || roomType === "BF") {
      targetUrl = "/admin/chat-all";
    } else if (roomType === "private") {
      targetUrl = "/admin/chat-private";
    }
  }

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if (client.url.includes(targetUrl) && "focus" in client) {
          return client.focus();
        }
      }
      return clients.openWindow(targetUrl);
    })
  );
});
