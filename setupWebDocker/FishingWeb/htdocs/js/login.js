// FirebaseUI config.
// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());
var uiConfig = {
    signInSuccessUrl: 'index.html',
    signInOptions: [
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
    ],

    /*
       tosUrl and privacyPolicyUrl accept either url string or a callback
       function.
       Terms of service url/callback.
     */

    tosUrl: 'index.html',
    // Privacy policy url/callback.
    privacyPolicyUrl: function () {
        window.location.assign('index.html');
    }
};
// The start method will wait until the DOM is loaded.
ui.start('#firebaseui-auth-container', uiConfig);
