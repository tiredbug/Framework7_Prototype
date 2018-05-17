$$(document).on('page:init', '.page[data-name="signin"]', function(e) {

  $$('.page[data-name="signin"] .signin-btn').on('click', function () {
    var username = $$('#signup-form .username').val();
    var password = $$('#signup-form .password').val();

    if(username == "") {
      app.dialog.alert('Please enter your username.');
    }
    else if(password == "") {
      app.dialog.alert('Please enter your password.');
    }
    else {
      // Show Preloader
      app.dialog.preloader("Connecting...");

      app.request.post(apiUrl + 'login.php', {
        username: username,
        password: password 
      }, function (data) {
        app.dialog.close();
        data = JSON.parse(data);

        if(data.state == "invalid") {
          app.dialog.alert('Incorrect username or password.');
        }
        else if(data.state == "valid") {
          localStorage.setItem("userid", data.userid);
          userid = data.userid;

          mainView.router.navigate('/home/', {
            clearPreviousHistory: true
          });
        }
        else {
          app.dialog.alert('Login error:', data);
        }
      });
    }
  });
});

$$(document).on('page:init', '.page[data-name="signup"]', function(e) {

  $$('.page[data-name="signup"] .signup-btn').on('click', function () {
    var username = $$('#signup-form .username').val();
    var password = $$('#signup-form .password').val();
    var repeatPassword = $$('#signup-form .repeat-password').val();
    var email = $$('#signup-form .email').val();
    var repeatEmail = $$('#signup-form .repeat-email').val();

    if(username == "") {
      app.dialog.alert('Please enter your username.');
    }
    else if(password == "") {
      app.dialog.alert('Please enter your password.');
    }
    else if(repeatPassword == "") {
      app.dialog.alert('Please repeat your password.');
    }
    else if(email == "") {
      app.dialog.alert('Please enter your email.');
    }
    else if(repeatEmail == "") {
      app.dialog.alert('Please repeat your email.');
    }
    else if(password != repeatPassword) {
      app.dialog.alert('Two passwords don\'t match. Please retry.');
      $$('#signup-form .repeat-password').val("");
    }
    else if(email != repeatEmail) {
      app.dialog.alert('Two email addresses don\'t match. Please retry.');
      $$('#signup-form .repeat-email').val("");
    }
    else if(!(checkEmail(email))){
      app.dialog.alert('Your email does not appear to be correct.');
      $$('#signup-form .email').val("");
    }
    else {
      // Show Preloader
      app.dialog.preloader("Connecting...");

      app.request.post(apiUrl + 'register.php', {
        username: username,
        email: email,
        password: password 
      }, function (data) {
        app.dialog.close();
        data = JSON.parse(data);

        if(data.state == "duplication") {
          app.dialog.alert('Username is already taken.');
        }
        else if(data.state == "success") {
          localStorage.setItem("userid", data.userid);
          userid = data.userid;

          mainView.router.navigate('/home/', {
            clearPreviousHistory: true
          });
        }
        else {
          app.dialog.alert('Register error: ', data);
        }        
      });
    }
    
  });
});