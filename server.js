const path = require("path");
const express = require("express");
const app = express();// Import the functions you need from the SDKs you need
const app_1 = require("firebase/app");
const analytics = require("firebase/analytics");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC-Vki1OLY0KZfQ-wMBzPNxW9uqJiHbI08",
  authDomain: "levos-5f2ec.firebaseapp.com",
  projectId: "levos-5f2ec",
  storageBucket: "levos-5f2ec.appspot.com",
  messagingSenderId: "701527711082",
  appId: "1:701527711082:web:8b196e36a84d9d0f0a5913",
  measurementId: "G-WFGZML7Z1C"
};

// Initialize Firebase
const firebaseApp = app_1.initializeApp(firebaseConfig);
analytics.isSupported().then((isSupported) => {
  if (isSupported) {
    app_1.analytics();
  }
});

// const analytics2 = analytics.getAnalytics(firebaseApp);
app.use(express.static(__dirname + "/docs"));
app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "docs", "index.html"));
});
// ES6
const port = process.env.PORT || 8000;

// Start the app by listening on the default Heroku port
app.listen(port, () => {
  console.log("App is running on port " + port);
});

