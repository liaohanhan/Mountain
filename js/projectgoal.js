function storedata() {
  alert("已儲存");
  var nameElement = document.getElementById("projectName");
  var name = nameElement.value;
  var arefElement = document.getElementById("arefVideo");
  var aref = arefElement.value;
  var classElement = document.getElementById("class");
  var cls = classElement.value;
  var commentElement = document.getElementById("comment");
  var comment = commentElement.value;
  var gitElement = document.getElementById("gitaref");
  var git = gitElement.value;
  firebase
    .database()
    .ref("users/" + firebase.auth().currentUser.uid + "/projectgoal")
    .set({
      projectName: name,
      arefVideo: aref,
      class: cls,
      comment: comment,
      git: git
    });
}

function deletedata() {
  alert("已清除");
  var nameElement = document.getElementById("projectName");
  nameElement.value = "";
  var arefElement = document.getElementById("arefVideo");
  arefElement.value = "";
  var classElement = document.getElementById("class");
  classElement.value = "";
  var commentElement = document.getElementById("comment");
  commentElement.value = "";
  var gitElement = document.getElementById("gitaref");
  gitElement.value = "";
  firebase
    .database()
    .ref("users/" + firebase.auth().currentUser.uid + "/projectgoal")
    .remove();
}
