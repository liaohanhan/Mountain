firebase.initializeApp({
    databaseURL: "https://test-b7807.firebaseio.com/"
  });
  
  const database = firebase.database();

 database.ref('/').set('');
