import firebase from "firebase/app";
import "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyD12rp1aJ_I59NZphs-nr4cbarLOlnBdW8",
    authDomain: "confusers-68c94.firebaseapp.com",
    projectId: "confusers-68c94",
    storageBucket: "confusers-68c94.appspot.com",
    messagingSenderId: "261511961647",
    appId: "1:261511961647:web:c8a81333a78eece6023ada",
    measurementId: "G-R7RCY9J3M9"
};


let init = false;
export const getStore = () => {
    if(!init){
        firebase.initializeApp(firebaseConfig);
        init = true;
    }
    return firebase.firestore()
}