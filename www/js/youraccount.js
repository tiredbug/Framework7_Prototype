$$(document).on('page:init', '.page[data-name="youraccount"]', function(e) {

  //Getting user information
  app.dialog.preloader('Loading...');
  app.request.post(apiUrl + 'user.php', {
    action: "get",
    userid: userid
  }, function (data) {
    data = JSON.parse(data);

    $$('.your-id').text(data['uid']);
    $$('.your-country').text(data['country']);
    $$('.your-age').text(data['age']);

    if(data['uploading'] == "1") {
      $$(".stop-upload-btn").removeClass("disabled");
      $$(".start-upload-btn").addClass("disabled");
    }
    else if(data['uploading'] == "0") {
      $$(".stop-upload-btn").addClass("disabled");
      $$(".start-upload-btn").removeClass("disabled");
    }

    app.request.post(apiUrl + 'commsettings.php', {
      action: 'get',
      userid: userid 
    }, function (data) {
      app.dialog.close();
      data = JSON.parse(data);

      if(data.length > 0) {
        if(data[0]['email'] == 1) {
          $$('.com-email').prop('checked', true);
        }
        else {
          $$('.com-email').prop('checked', false);
        }

        if(data[0]['whatsapp'] == 1) {
          $$('.com-whatsapp').prop('checked', true);
        }
        else {
          $$('.com-whatsapp').prop('checked', false);
        }
      }
    });
  });

  //Getting History list
  app.request.post(apiUrl + 'uploads.php', {
  }, function (data) {   
    data = JSON.parse(data);

    var html = '';
    for(i=0; i<data.length; i++) {
      html += '<tr>';
      html += '   <td class="label-cell">' + data[i]['name'] + '</td>';
      html += '   <td>' + data[i]['description'] + '</td>';
      html += '   <td>' + data[i]['date'] + '</td>';
      html += '   <td><a class="link external" href="' + data[i]['url'] + '">url1</a></td>';
      html += '</tr>';
    }

    $$(".history-list tbody").html(html);
  });

  var calendarDefault = app.calendar.create({
    inputEl: '#set-pause-date',
    dateFormat: 'DD, MM dd, yyyy'
  });

  $$('.com-email, .com-whatsapp').on('change', function () {
    var type = '', enabled = 0;

    if($$(this).hasClass('com-email')) {
      type = 'email';
    }

    if($$(this).hasClass('com-whatsapp')) {
      type = 'whatsapp';
    }

    if($$(this).prop('checked')) {
      enabled = 1;
    }
    else {
      enabled = 0;
    }

    app.request.post(apiUrl + 'commsettings.php', {
      action: 'update',
      userid: userid,
      type: type,
      enabled: enabled
    }, function (data) {
      console.log("Updated the communication setting.");
    });
  });
  
  $$('.pause-account-btn').on('click', function () {
    //Checking the date
    var date = $$("#set-pause-date").val();
    if(date == "") {
      app.dialog.alert('Please choose the time limit.');
    }
    else {
      app.dialog.confirm('Are you sure?', function () {
        app.request.post(apiUrl + 'user.php', {
          action: 'update_uploading',
          userid: userid,
          uploading: "0",
        }, function (data) {
          $$(".stop-upload-btn").addClass("disabled");
          $$(".start-upload-btn").removeClass("disabled");  
        });
      });
    }
  });

  $$('.stop-upload-btn').on('click', function () {
    $$('.start-upload-btn').toggleClass('disabled');
    $$(this).toggleClass('disabled');
    $$('.upload-enabled-desc').text('Stop all uploads until enabled again');

    app.request.post(apiUrl + 'user.php', {
      action: 'update_uploading',
      userid: userid,
      uploading: "0",
    }, function (data) {
      $$(".stop-upload-btn").addClass("disabled");
      $$(".start-upload-btn").removeClass("disabled");  
    });
  });

  $$('.start-upload-btn').on('click', function () {
    $$('.stop-upload-btn').toggleClass('disabled');
    $$(this).toggleClass('disabled');    
    $$('.upload-enabled-desc').text('Start all uploads until disabled again');
    app.request.post(apiUrl + 'user.php', {
      action: 'update_uploading',
      userid: userid,
      uploading: "1",
    }, function (data) {
      $$(".stop-upload-btn").removeClass("disabled");
      $$(".start-upload-btn").addClass("disabled");
    });
  });

  $$('.account-delete-btn').on('click', function () {
    app.dialog.confirm('Are you sure?', function () {
      app.request.post(apiUrl + 'user.php', {
        action: 'delete_user',
        userid: userid,
      }, function (data) {
        app.dialog.alert('Your account was deleted!');

        localStorage.removeItem("userid");
        mainView.router.navigate('/', {
          clearPreviousHistory: true
        });        
      });
    });
  });

});
