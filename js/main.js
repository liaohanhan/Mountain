firebase.initializeApp({
  apiKey: "AIzaSyAPtrxO1ce1sWtp0hoOQA6_h15jrALCnTk",
  authDomain: "Test",
  databaseURL: "https://test-b7807.firebaseio.com/"
});
const database = firebase.database();
$(document).ready(function() {
  var email;
  var password;
  var loginUser;
 
  function isLogin() {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        console.log("User is logined", user.uid);
        window.location.href = "../html/progress.html"; //登入時改跳轉頁面
      } else {
        console.log("User is not logined yet.");
      }
    });
  }

  //登入
  $("#login").click(function() {
    email = document.getElementById("mail").value;
    password = document.getElementById("password").value;
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .catch(function(error) {
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
  $("#logout").click(function() {
    firebase
      .auth()
      .signOut()
      .then(
        function() {
          console.log("User sign out!");
          window.location.href = "../html/index.html";
        },
        function(error) {
          console.log("User sign out error!");
        }
      );
    isLogin();
  });

  //---------------註冊帳號---------------------------
  $("#register").click(function() {
    email = document.getElementById("rmail").value;
    password = document.getElementById("rpassword").value;
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(function() {
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
            window.location.href = "../html/progress.html";
          });
      
           firebase
          .database()
          .ref("users/" + loginUser.uid + "/projectgoal")
          .set({
            arefVideo: "",
            class: "",
            git: "",
            projectName: "",
            comment: ""
          });
      })
      .catch(function(error) {
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
  $("#singup").click(function() {
    $(".front").css("display", "none");
    $(".back").css("display", "");
    $(".card").css("transform", "rotateY(180deg)");
    $(".card").css("height", "37rem");
  });
  $("#plogin").click(function() {
    $(".front").css("display", "");
    $(".back").css("display", "none");
    $(".card").css("transform", "rotateY(0deg)");
    $(".card").css("height", "25rem");
  });

  $("#rpassword").on("keyup", function() {
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
  $("#phonenum").on("keyup", function() {
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

  //---------------------------------增加更新進度---------------------------------
 /* var uidd = 0;
  var zz;
  $("#submit").click(function() {
    const time = document.getElementById("time").value;
    var youtube = document.getElementById("youtube").value;
    const content = document.getElementById("content").value;
    youtube = youtube.replace("watch?v=", "embed/");
    //console.log("User is logined", user.uid)
    loginUser = firebase.auth().currentUser;
    var progressRef = firebase.database().ref("users/" + loginUser.uid);
    zz = loginUser.uid;
    progressRef
      .child("progress")
      .once("value")
      .then(function(snapshot) {
        var num = snapshot.numChildren();
        //console.log("There are " + num + " in progress");
        //console.log("progress資料", snapshot.val());
        progressRef
          .child("progress")
          .child((0 + Number(num)).toString())
          .set({ time: time, youtube: youtube, content: content })
          .then(function() {
            alert("成功!");
            document.body.scrollTop = document.body.scrollHeight;
            document.documentElement.scrollTop =
              document.documentElement.scrollHeight;
            console.log(firebase.auth().currentUser.uid);
            $("table").append(
              '<tr><td data-th="更新內容">' +
                content +
                '</td><td data-th="花費時間">' +
                time +
                '</td><td data-th="操作影片"><div class="video-container"><iframe width="200" height="130"src=' +
                youtube +
                ' frameborder="0"allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"allowfullscreen ></iframe></div></td></tr>'
            );

            var progress = firebase
              .database()
              .ref("users/" + zz + "/" + "progress/");
            progress.on("child_added", function(data) {
              console.log("目前所有使用者：", data.val());
            });
          })
          .catch(function(error) {
            alert("失敗" + error);
          });
      })
      .catch(function(error) {
        alert("失敗" + error);
      });
  });*/
  //-------------------------------------------------------------------

  //----------------如果網頁第一次要載入值 寫在這裡----------------------
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
     // if (location.pathname == "/webfinal/html/progress.html") refreshProgress();
      console.log("in refresh");
      //all_team();
      console.log("after allteeam");
      getId();
     // getPhoto();
     // chat();
      settingrender()
     // getprojectgoal();
     // getcontent();
      checkID();
    }
  });

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

  //取得學號
  function getId() {
    var loginUser = firebase.auth().currentUser;
    var progressRef = firebase.database().ref("users/" + loginUser.uid);
    progressRef
      .child("name")
      .once("value")
      .then(function(snapshot) {
        $("#id").html("歡迎！" + snapshot.val());
      });
  }
  //取得頭貼
 /* function getPhoto() {
    var loginUser = firebase.auth().currentUser;
    var storageRef = firebase.storage().ref("users/" + loginUser.uid);
    var pathReference = storageRef.child("image");
    pathReference
      .getDownloadURL()
      .then(function(url) {
        document.getElementById("photo").style.cssText =
          "background-image:url( " + url + ");";
        if (location.pathname == "/webfinal/html/setting.html")
          document.getElementById("upload_img").style.cssText =
            "background-image:url( " + url + ");";
      })
      .catch(function(error) {
        document.getElementById("photo").style.cssText =
          "background-image:url(https://www.pinclipart.com/picdir/middle/355-3553881_stockvader-predicted-adig-user-profile-icon-png-clipart.png);";

        document.getElementById("upload_img").style.cssText =
          "background-image:url(https://www.pinclipart.com/picdir/middle/355-3553881_stockvader-predicted-adig-user-profile-icon-png-clipart.png);";
      });
  }*/
  //----------------------------------------------------------------------

  //-----------------------更新密碼頁面--------------------------------------
  function settingrender(){
  loginUser = firebase.auth().currentUser;
  var userdata = firebase.database().ref("users/" + loginUser.uid);

  userdata
      .child("name")
      .once("value")
      .then(function(snapshot){
        $("#newname").val(snapshot.val())
       
      }) 
  userdata
      .child("phonenum")
      .once("value")
      .then(function(snapshot){
        $("#newphonenum").val(snapshot.val())
       
      }) 
     
    
    $("#editsetting").on("click",function(){
      resetprofile()
    $("#editsetting").addClass("hide")
    $("#pass").removeClass("hide")
    
    })}
  function resetprofile(){
  var nameref="users/" + firebase.auth().currentUser.uid +"name"
  var phonenumref=""
  var isSame = false;
  $("#newname,#newphonenum").removeAttr("disabled")
  $("#newpassword, #newpassword2,label").removeClass("hide")
database.ref(nameref).update("萱萱")


  $("#newpassword, #newpassword2").on("keyup", function() {
    if ($("#newpassword").val().length < 6) {
      $(".message")
        .html("密碼長度要超過6個字元!")
        .css("color", "red");
      document.getElementById("pass").setAttribute("disabled", "true");
      isSame = false;
    } else if ($("#newpassword").val() != $("#newpassword2").val()) {
      $(".message")
        .html("密碼不一樣!")
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
  if (($("#newpassword").val()).trim()!="" ){
    restpassword()
  }
  
}
function restpassword(){
  $("#pass").click(function() {
    
    if (isSame) {
      var user = firebase.auth().currentUser;
      var newpassword = document.getElementById("newpassword").value;

      user
        .updatePassword(newpassword)
        .then(function() {
          console.log("Update successful.");
          alert("更新成功！")
          document.getElementById("newpassword").value="";
          document.getElementById("newpassword2").value="";
        })
        .catch(function(error) {
          console.log(error);
          // An error happened.
        });
    }
  });
}
   $("#modifyproject").click(function() {
   
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
    alert("已儲存");
  });
$("#clearproject").click(function() {
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
   alert("已清除");
  });
    $("#a").click(function() {
      
    var commentElement = document.getElementById("teacher_comment");
    var comment = commentElement.value;
    firebase
      .database()
      .ref("COMMENT/")
      .set({
        comment: comment
      });
        alert("成功");
  });
 $("#b").click(function() {
    var commentElement = document.getElementById("teacher_comment");
    commentElement.value = "";
    firebase
      .database()
      .ref("/COMMENT")
      .remove();
     alert("已刪除公告");
  });
  //---------------------------------------------------------------------------

  //--------------------------改頭貼------------------------------------------------
  //預覽頭貼
  function readURL(input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();

      reader.onload = function(e) {
        document.getElementById("upload_img").style.cssText =
          "background-image:url( " + e.target.result + ");";
      };

      reader.readAsDataURL(input.files[0]);
    }
  }
  //上傳相片
  var file;
  var uploadFileInput = document.getElementById("upload");
  uploadFileInput.addEventListener("change", function() {
    readURL(this);
    file = this.files[0];
  });
  $("#confirm").click(function() {
    var loginUser = firebase.auth().currentUser;
    var storageRef = firebase.storage().ref("users/" + loginUser.uid);
    var uploadTask = storageRef.child("image").put(file);
    uploadTask.on(
      "state_changed",
      function(snapshot) {
        // 觀察狀態變化，例如：progress, pause, and resume

        // 取得檔案上傳狀態，並用數字顯示

        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log("Upload is paused");
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log("Upload is running");
            break;
        }
      },
      function(error) {
        // Handle unsuccessful uploads
      },
      function() {
        uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
          console.log("File available at", downloadURL);
          document.getElementById("photo").style.cssText =
            "background-image:url( " + downloadURL + ");";
        });
      }
    );
  });

  //------------張育瑞-------------//
  //取得專案目標
  function getprojectgoal() {
    firebase
      .database()
      .ref(
        "users/" + firebase.auth().currentUser.uid + "/projectgoal/projectName"
      )
      .once("value", function(snapshot) {
        var nameElement = document.getElementById("projectName");
        var data = snapshot.val();
        nameElement.value = data;
      });
    firebase
      .database()
      .ref(
        "users/" + firebase.auth().currentUser.uid + "/projectgoal/arefVideo"
      )
      .once("value", function(snapshot) {
        var arefElement = document.getElementById("arefVideo");
        var data = snapshot.val();
        arefElement.value = data;
      });
    firebase
      .database()
      .ref("users/" + firebase.auth().currentUser.uid + "/projectgoal/class")
      .once("value", function(snapshot) {
        var classElement = document.getElementById("class");
        var data = snapshot.val();
        classElement.value = data;
      });
    firebase
      .database()
      .ref("users/" + firebase.auth().currentUser.uid + "/projectgoal/comment")
      .once("value", function(snapshot) {
        var commentElement = document.getElementById("comment");
        var data = snapshot.val();
        commentElement.value = data;
      });
    firebase
      .database()
      .ref("users/" + firebase.auth().currentUser.uid + "/projectgoal/git")
      .once("value", function(snapshot) {
        var gitElement = document.getElementById("gitaref");
        var data = snapshot.val();
        gitElement.value = data;
      });
  }
 /* function getcontent() {
    firebase
      .database()
      .ref("COMMENT/comment")
      .once("value", function(snapshot) {
        var teacher_
        = document.getElementById("teacher_comment");
        var data = snapshot.val();
         $("#comm")
            .html(snapshot.val())
            .css("color","black");
        if (adminUID == firebase.auth().currentUser.uid) {
          
        $("#comm").css("display", "none");
        }
      
         
          
        teacher_commentElement.value = data;
      });
  }*/

  function checkID() {
    const adminUID = "IfPBdDg800QTIQHDdyP1yOsgMrv2";
    firebase.auth().onAuthStateChanged(function(user) {
      if (adminUID != firebase.auth().currentUser.uid) {
        $("#a").addClass("comment_btdisplay");
        $("#b").addClass("comment_btdisplay");
        $("#teacher_comment").css("display", "none");
      }
      if (adminUID == firebase.auth().currentUser.uid) {
        $("#comm").css("display", "none");
      }
    });
  }

  //------------張育瑞-------------//

  //**********************聊天室******************* */
  function chat() {
    console.log("test");
    var database = firebase.database();
    var dbref = firebase.database().ref("messageBoard");
    var $messageField = $("#messageInput");

    var name;
    $("#messageInput").keypress(function(e) {
      console.log("press");
      if (e.keyCode == 13 && $messageField.val().replace(/(^s*)|(s*$)/g, "").length != 0) {
        loginUser = firebase.auth().currentUser;
        firebase
          .database()
          .ref("users/" + loginUser.uid)
          .child("name")
          .once("value")
          .then(function(snapshot) {
            name = snapshot.val();
            var message = $messageField.val();
            dbref.push({ uid: loginUser.uid, name: name, text: message });
            $messageField.val("");
          });

        
      }
    });

    dbref.on("child_added", function(snapshot) {
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
      else{
        $(".messesge").append(
          '<div class="me justify-content-end row p-2"><span class="bg-primary p-2 rounded text-light">' +
            message +
            "</span></div>"
        );
  
      }
      $(".card-body").scrollTop($(".card-body")[0].scrollHeight);
    });
  }
  //*************************************************** */
  //--------------------------------all team
  function all_team() {
    var database = firebase.database();
    var dbref = firebase.database().ref();
    var teamRef = firebase.database().ref("teams");
    var teamNum = 0;
    var teamIndex = 0;
    dbref
      .child("users")
      .once("value")
      .then(function(snapshot) {
        snapshot
          .forEach(function(childSnapshot) {
            var number = childSnapshot.val().studentId;
            var name = childSnapshot.val().name;
            var arefVideo = childSnapshot.val().projectgoal.arefVideo;
            var class2 = childSnapshot.val().projectgoal.class;
            var comment = childSnapshot.val().projectgoal.comment;
            var git = childSnapshot.val().projectgoal.git;
            var projectName = childSnapshot.val().projectgoal.projectName;
            
            if (
              class2 != "" &&
              arefVideo != "" &&
              comment != "" &&
              projectName != "" &&
              git != ""
            ) {
              
              var $row = $("#class-row");
              var $newBoad = $("<div></div>");
              $newBoad.addClass("shadow-lg");

              var $groupNum = $("<div></div>");
              $groupNum.addClass("group-num");
              var $groupNumData = $("<font></font>");
              $groupNumData.attr("face", "Noto Sans TC");
              $groupNumData.text("小組內容");
              $groupNum.append($groupNumData);
              $newBoad.append($groupNum);

              var $pic = $("<div></div>");
              $pic.addClass("pic");
              var $pic_data = $("<img>");
              $pic_data.addClass("rounded-circle");
              $pic_data.attr("src", "../img/int.jpg");
              // $pic_data.src = "../img/int.jpg ";
              $pic.append($pic_data);
              $newBoad.append($pic);

              var $imformation = $("<div></div>");
              $imformation.addClass("imformation");
              var $member_child = $("<div></div>");
              $member_child.addClass("member-child");
              var $student_num = $("<p></p>");
              $student_num.css("margin-bottom", "0px");
              $student_num.css("height", "20px");
              $student_num.text(number);
              var $student_name = $("<p></p>");
              $student_name.css("margin-bottom", "0px");
              $student_name.css("height", "28px");
              $student_name.text(name);

              $member_child.append($student_num);
              $member_child.append($student_name);
              var $project_name = $("<p></p>");
              $project_name.text("專案 : " + projectName);
              var $demo1 = $("<p></p>");
              var $demo2 = $("<p></p>");
              $demo1.css("flex", "1");
              $demo1.text("Demo1:A+");
              $demo2.css("flex", "1");
              $demo2.text("Demo2:B+");
              var $rateMe = $("<span></span>");
              var $star_1 = $("<i></i>");
              $star_1.attr("id", "a");
              $star_1.attr("data-index", "0");
              $star_1.attr("data-toggle", "popover");
              $star_1.attr("data-html", "true");
              $star_1.attr("data-placement", "top");
              $star_1.attr("title", "vary bad");
              $star_1.addClass(`fas fa-star py-2 px-1 rate-popover ${number}`);
              var $star_2 = $("<i></i>");
              $star_2.attr("data-index", "1");
              $star_2.attr("data-toggle", "popover");
              $star_2.attr("data-placement", "top");
              $star_2.attr("title", "vary bad");
              $star_2.addClass(`fas fa-star py-2 px-1 rate-popover ${number}`);
              var $star_3 = $("<i></i>");
              $star_3.attr("data-index", "2");
              $star_3.attr("data-toggle", "popover");
              $star_3.attr("data-placement", "top");
              $star_3.attr("title", "vary bad");
              $star_3.addClass(`fas fa-star py-2 px-1 rate-popover ${number}`);
              var $star_4 = $("<i></i>");
              $star_4.attr("data-index", "3");
              $star_4.attr("data-toggle", "popover");
              $star_4.attr("data-placement", "top");
              $star_4.attr("title", "vary bad");
              $star_4.addClass(`fas fa-star py-2 px-1 rate-popover ${number}`);
              var $star_5 = $("<i></i>");
              $star_5.attr("data-index", "4");
              $star_5.attr("data-toggle", "popover");
              $star_5.attr("data-placement", "top");
              $star_5.attr("title", "vary bad");
              $star_5.addClass(`fas fa-star py-2 px-1 rate-popover ${number}`);
              $rateMe.append($star_1);
              $rateMe.append($star_2);
              $rateMe.append($star_3);
              $rateMe.append($star_4);
              $rateMe.append($star_5);
              $imformation.append($member_child);
              $imformation.append($project_name);
              $imformation.append($demo1);
              $imformation.append($demo2);
              $imformation.append($rateMe);
              $newBoad.append($imformation);
              var $team = $("<div></div>");
              $team.addClass("col-sm-12  col-lg-4 team");

              $team.id = "team" + ++teamIndex;

              $team.append($newBoad);
              $row.append($team);
              var myDefaultWhiteList =
                $.fn.tooltip.Constructor.Default.whiteList;
              myDefaultWhiteList.textarea = [];
              myDefaultWhiteList.button = [];
              var $stars = $(`.${number}`);
              // console.log($stars);
              $stars.on("mouseover", function() {
                var index = $(this).attr("data-index");
                markStarsAsActive(index);
              });

              function markStarsAsActive(index) {
                unmarkActive();
                for (var i = 0; i <= index; i++) {
                  $($stars.get(i)).addClass("amber-text");
                }
              }

              function unmarkActive() {
                $stars.removeClass("amber-text");
              }
              $stars.on("click", function() {
                $stars.popover("hide");
              });
              // Submit, you can add some extra custom code here
              // ex. to send the information to the server
              $("#rateMe").on("click", "#voteSubmitButton", function() {
                $stars.popover("hide");
              });
              // Cancel, just close the popover
              $("#rateMe").on("click", "#closePopoverButton", function() {
                $stars.popover("hide");
              });
            }

            // })
            // .catch(function(error) {});
          })
          .catch(function(error) {
            alert(error)
            console.log(error)
          });
      });
  }
});
