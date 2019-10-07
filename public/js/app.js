//   $.ajax({"method":'POST',"Headers":{ "Accept":'application/json',
// "Authorization":'Be',
// "Content-Type":'multipart/form-data'})
$(document).ready(function(){
    var url = window.location.href;
    let urlArray = url.split('/');

    $("#submit").click(function(){
      let baseUrl = urlArray[0]+'//'+urlArray[2];
      console.log(baseUrl);
        $.ajax({
          type: "POST",
          url: baseUrl+"/login",

          accept:'application/json',
          data:{ username:$('#username').val(), password: $('#password').val() },
          body:{ username:$('#username').val(), password: $('#password').val() },
          error:function(error){
            console.log("Error : ",error);
            // alert("")
            alert("Wrong username or password");
          },
          success:function(data){
            console.log("Login done ",data);
            localStorage.setItem("Token",data.token);
            window.location.href = baseUrl+"/counter";

          }
        });
    });
});
