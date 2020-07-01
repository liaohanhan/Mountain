firebase.initializeApp({
  apiKey: "AIzaSyAPtrxO1ce1sWtp0hoOQA6_h15jrALCnTk",
  authDomain: "Test",
  databaseURL: "https://test-b7807.firebaseio.com/"
});
const database = firebase.database();
$(document).ready(function () {
  var email;
  var password;
  var loginUser;
resetweb()
  function isLogin() {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        console.log("User is logined", user.uid);
        window.location.href = "../html/actionall.html"; //登入時改跳轉頁面
      } else {
        console.log("User is not logined yet.");
      }
    });
  }

  //登入
  $("#login").click(function () {
    email = document.getElementById("mail").value;
    password = document.getElementById("password").value;
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .catch(function (error) {
        var errorMessage = error.message;
        console.log(errorMessage);
        if (
          errorMessage ==
          "There is no user record corresponding to this identifier. The user may have been deleted."
        )
          $(".lmessage")
          .html("此帳號不存在")
          .css("color", "red");
        else if (
          errorMessage ==
          "The password is invalid or the user does not have a password."
        )
          $(".lmessage")
          .html("密碼錯誤")
          .css("color", "red");
      });

    isLogin();
  });

  //登出
  $("#logout").click(function () {
    firebase
      .auth()
      .signOut()
      .then(
        function () {
          console.log("User sign out!");
          window.location.href = "../html/index.html";
        },
        function (error) {
          console.log("User sign out error!");
        }
      );
    isLogin();
  });

  //---------------註冊帳號---------------------------
  $("#register").click(function () {
    email = document.getElementById("rmail").value;
    password = document.getElementById("rpassword").value;
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(function () {
        //登入成功後，取得登入使用者資訊
        loginUser = firebase.auth().currentUser;
        console.log("登入使用者為", loginUser.email);
        uid = loginUser.uid;

        firebase
          .database()
          .ref("users/" + loginUser.uid)
          .set({
            email: loginUser.email,
            name: $("#name").val(),
            phonenum: $("#phonenum").val()
          })
          .then(function() {
            alert("註冊成功！");
            window.location.href = "../html/actionall.html";
          });

       
      })
      .catch(function (error) {
        console.error("寫入使用者資訊錯誤", error);
        if (
          error.message ==
          "The email address is already in use by another account."
        )
          $(".rmessage")
          .html("電子郵件已被註冊")
          .css("color", "red");
      });
  });

  $(".back").css("display", "none");
  $("#singup").click(function () {
    $(".front").css("display", "none");
    $(".back").css("display", "");
    $(".card").css("transform", "rotateY(180deg)");
    $(".card").css("height", "100%");
  });
  $("#plogin").click(function () {
    $(".front").css("display", "");
    $(".back").css("display", "none");
    $(".card").css("transform", "rotateY(0deg)");
    $(".card").css("height", "100%");
  });

  $("#rpassword").on("keyup", function () {
    if ($("#rpassword").val().length < 6) {
      $(".rmessage")
        .html("密碼長度要超過6個字元!")
        .css("color", "red");
      document.getElementById("register").setAttribute("disabled", "true");
    } else {
      document.getElementById("register").removeAttribute("disabled");
      $(".rmessage")
        .html("\n")
        .css("color", "red");
    }
  });
  $("#phonenum").on("keyup", function () {
    var r = /^[0-9]*[1-9][0-9]*$/;
    if (!r.test($("#phonenum").val()) || $("#phonenum").val().length < 9) {
      $(".rmessage")
        .html("請輸入正確的電話號碼!")
        .css("color", "red");
      document.getElementById("register").setAttribute("disabled", "true");
    } else {
      document.getElementById("register").removeAttribute("disabled");
      $(".rmessage")
        .html("\n")
        .css("color", "red");
    }
  });
  //-----------------------------------------------------------------------------------

 
  //----------------網頁Render 寫在這裡----------------------
  function resetweb(){
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      console.log("in refresh");
      console.log("after allteeam");
      getId();
      settingrender()
    }
  });
}
  //按下progress頁面更新資料
  /* function refreshProgress() {
     var loginUser = firebase.auth().currentUser;
     var progressRef = firebase.database().ref("users/" + loginUser.uid);
     progressRef
       .child("progress")
       .once("value")
       .then(function(snapshot) {
         snapshot.forEach(function(childSnapshot) {
           $("table").append(
             '<tr><td data-th="更新內容">' +
               childSnapshot.val().content +
               '</td><td data-th="花費時間">' +
               childSnapshot.val().time +
               '</td><td data-th="操作影片"><div class="video-container"><iframe width="200" height="130"src=' +
               childSnapshot.val().youtube +
               ' frameborder="0"allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"allowfullscreen></iframe></div></td></tr>'
           );
           console.log(childSnapshot.val());
         });
       });
   }*/

  //取得名字
  function getId() {
    var loginUser = firebase.auth().currentUser;
    var progressRef = firebase.database().ref("users/" + loginUser.uid);
    progressRef
      .child("name")
      .once("value")
      .then(function (snapshot) {
        $("#id").html("你好！" + snapshot.val() + "！");
      });
  }

  //-----------------------個人資料--------------------------------------
  var isSame = false;
/*進入畫面抓值*/
  function settingrender() {
    loginUser = firebase.auth().currentUser;
    var userdata = firebase.database().ref("users/" + loginUser.uid);

    userdata
      .child("name")
      .once("value")
      .then(function (snapshot) {
        $("#newname").val(snapshot.val())

      })
    userdata
      .child("phonenum")
      .once("value")
      .then(function (snapshot) {
        $("#newphonenum").val(snapshot.val())

      })


    $("#editsetting").on("click", function () {
      resetprofile()
      $("#editsetting").addClass("hide")
      $("#pass").removeClass("hide")

    })
  }
/*點擊修改後的FN，打開input text跟確認按鈕，還有檢查密碼*/
  function resetprofile() {
 
    $("#newname,#newphonenum").removeAttr("disabled")
    $("#newpassword, #newpassword2,label").removeClass("hide")


    $("#newpassword, #newpassword2").on("keyup", function () {
      if ($("#newpassword").val().length < 6) {
        $(".message")
          .html("密碼長度要超過6個字元!")
          .css("color", "red");
        document.getElementById("pass").setAttribute("disabled", "true");
        isSame = false;
      } else if ($("#newpassword").val() != $("#newpassword2").val()) {
        $(".message")
          .html("密碼不相同!")
          .css("color", "red");
        document.getElementById("pass").setAttribute("disabled", "true");
        isSame = false;
      } else {
        $(".message")
          .html("")
          .css("color", "red");
        document.getElementById("pass").removeAttribute("disabled");
        isSame = true;
      }
    });
   

  }
  /*點擊確認修改呼叫resetpassword */
  $("#pass").on("click",function(){
    resetpassword()
  })
  /*修改firebase對應的值，關閉input text跟確認按鈕 */
  function resetpassword() {
   
      if (($("#newpassword").val()).trim() != "") {
        if (isSame) {
          var user = firebase.auth().currentUser;
          var newpassword = document.getElementById("newpassword").value;
          var profile ={
            name:$("#newname").val(),
            phonenum:$("#newphonenum").val()
          }
          user
            .updatePassword(newpassword)
            .then(function () {
              console.log("Update successful.");
              database.ref("users/"+ firebase.auth().currentUser.uid ).update(profile)

              alert("更新成功！")
              resetweb()
              document.getElementById("newpassword").value = "";
              document.getElementById("newpassword2").value = "";
              $("#editsetting").removeClass("hide")
              $("#pass").addClass("hide")
              $("#newname,#newphonenum").attr("disabled",true)
              $("#newpassword, #newpassword2,#newpasswordlable1,#newpasswordlable2").addClass("hide")
            })
            .catch(function (error) {
              console.log(error);
              // An error happened.
            });
        }
      }
    
  }
  /*輸入電話號碼時檢查格式，要是9個數字 */
  $("#connectphonenum").on("keyup", function () {
    var r = /^[0-9]*[1-9][0-9]*$/;
    if (!r.test($("#connectphonenum").val()) || $("#connectphonenum").val().length < 9) {
      $(".rmessage")
        .html("請輸入正確的電話號碼!")
        .css("color", "red");
      document.getElementById("modifyproject").setAttribute("disabled", "true");
    } else {
      document.getElementById("modifyproject").removeAttribute("disabled");
      $(".rmessage")
        .html("\n")
        .css("color", "red");
    }
  });
  /*輸入人數時檢查格式，要是數字 */
  $("#class").on("keyup", function () {
    var r = /^[0-9]*[1-9][0-9]*$/;
    if (!r.test($("#class").val()) ) {
      $(".rmessage")
        .html("請輸入正確的人數!")
        .css("color", "red");
      document.getElementById("modifyproject").setAttribute("disabled", "true");
    } else {
      document.getElementById("modifyproject").removeAttribute("disabled");
      $(".rmessage")
        .html("\n")
        .css("color", "red");
    }
  });
/*檢查欄位是否為空 */
  function isempty(idname) {

    if ($(`#${idname}`).val().trim() == "") {
      return true
    } else {
      return false
    }
  }
/*檢查個人資料畫面內的欄位皆不為空*/
  function checkmodifycolumn() {
    if (isempty("projectName") || isempty("date") || isempty("connectphonenum") || isempty("class") || isempty("trip")) {
      $("#modifyproject").attr("disabled", true)
    } else {

      $("#modifyproject").attr("disabled", false)
    }
  }
  checkmodifycolumn()
  $("#projectName,#date,#connectphonenum,#class,#trip").on("keyup", function () {
  checkmodifycolumn()
  })
  //---------------------------------我要開團-----------------------------------------------
  $("#modifyproject").click(function () {

    var nameElement = document.getElementById("projectName");
    var name = nameElement.value;
    var classElement = document.getElementById("class");
    var cls = classElement.value;
    var tripElement = document.getElementById("trip");
    var trip = tripElement.value;
    var connectElement = document.getElementById("connectphonenum");
    var connectphonenum = connectElement.value;
    firebase
      .database()
      .ref("users/" + firebase.auth().currentUser.uid + "/projectgoal")
      .set({
        projectName: name,
        peoplenum: cls,
        trip: trip,
        connectphonenum: connectphonenum
      });
    alert("開團成功");
  });
  /*清除按鈕*/
  $("#clearproject").click(function () {
    var nameElement = document.getElementById("projectName");
    nameElement.value = "";
    var classElement = document.getElementById("class");
    classElement.value = "";
    var tripElement = document.getElementById("trip");
    tripElement.value = "";
    var connectphonenumElement = document.getElementById("connectphonenum");
    connectphonenumElement.value = "";
   /* firebase
      .database()
      .ref("users/" + firebase.auth().currentUser.uid + "/projectgoal")
      .remove();
    alert("已清除");*/
  });
   //取得專案目標
  function getprojectgoal() {
    firebase
      .database()
      .ref(
        "users/" + firebase.auth().currentUser.uid + "/projectgoal/projectName"
      )
      .once("value", function (snapshot) {
        var nameElement = document.getElementById("projectName");
        var data = snapshot.val();
        nameElement.value = data;
      });
    firebase
      .database()
      .ref(
        "users/" + firebase.auth().currentUser.uid + "/projectgoal/arefVideo"
      )
      .once("value", function (snapshot) {
        var arefElement = document.getElementById("arefVideo");
        var data = snapshot.val();
        arefElement.value = data;
      });
    firebase
      .database()
      .ref("users/" + firebase.auth().currentUser.uid + "/projectgoal/class")
      .once("value", function (snapshot) {
        var classElement = document.getElementById("class");
        var data = snapshot.val();
        classElement.value = data;
      });
    firebase
      .database()
      .ref("users/" + firebase.auth().currentUser.uid + "/projectgoal/comment")
      .once("value", function (snapshot) {
        var commentElement = document.getElementById("comment");
        var data = snapshot.val();
        commentElement.value = data;
      });
    firebase
      .database()
      .ref("users/" + firebase.auth().currentUser.uid + "/projectgoal/git")
      .once("value", function (snapshot) {
        var gitElement = document.getElementById("gitaref");
        var data = snapshot.val();
        gitElement.value = data;
      });
  }
  //----------------------------------開團總覽-----------------------------------
function getallprojeci(){
  
}

  //**********************聊天室******************* */
  function chat() {
    console.log("test");
    var database = firebase.database();
    var dbref = firebase.database().ref("messageBoard");
    var $messageField = $("#messageInput");

    var name;
    $("#messageInput").keypress(function (e) {
      console.log("press");
      if (e.keyCode == 13 && $messageField.val().replace(/(^s*)|(s*$)/g, "").length != 0) {
        loginUser = firebase.auth().currentUser;
        firebase
          .database()
          .ref("users/" + loginUser.uid)
          .child("name")
          .once("value")
          .then(function (snapshot) {
            name = snapshot.val();
            var message = $messageField.val();
            dbref.push({
              uid: loginUser.uid,
              name: name,
              text: message
            });
            $messageField.val("");
          });


      }
    });

    dbref.on("child_added", function (snapshot) {
      loginUser = firebase.auth().currentUser;
      var data = snapshot.val();
      var username = data.name;
      var message = data.text;
      var id = data.uid;
      console.log(username);

      if (id != loginUser.uid)
        $(".messesge").append(
          '<div class="row  p-2"><span class=" bg-light p-2 rounded text-dark"> <strong>' +
          username +
          "：</strong>" +
          message +
          "</span></div>"
        );
      else {
        $(".messesge").append(
          '<div class="me justify-content-end row p-2"><span class="bg-primary p-2 rounded text-light">' +
          message +
          "</span></div>"
        );

      }
      $(".card-body").scrollTop($(".card-body")[0].scrollHeight);
    });
  }
  
 
});