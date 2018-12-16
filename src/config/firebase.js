import firebase from 'firebase'


var config = {
  apiKey: "AIzaSyA00BkPaJoEO1R2hSEpABkkmEIyGODXD5c",
  authDomain: "online-exam-appliaction.firebaseapp.com",
  databaseURL: "https://online-exam-appliaction.firebaseio.com",
  projectId: "online-exam-appliaction",
  storageBucket: "online-exam-appliaction.appspot.com",
  messagingSenderId: "802780114764"
};
  const fire=firebase.initializeApp(config); 

   export default fire;