var app_fireBase = {};

(function () {

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyD14Q6UxuzW9FoH-SbRX-LJr16yu37dLN4",
        authDomain: "fishingtest-8c959.firebaseapp.com",
        databaseURL: "https://fishingtest-8c959.firebaseio.com",
        projectId: "fishingtest-8c959",
        storageBucket: "fishingtest-8c959.appspot.com",
        messagingSenderId: "991861165129"
    };

    firebase.initializeApp(config);
    app_fireBase = firebase;
    //app_firebase.prototype.setData = function () {

})()