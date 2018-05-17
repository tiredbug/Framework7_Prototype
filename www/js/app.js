// Dom7
var $$ = Dom7;

// Framework7 App main instance
var app  = new Framework7({
  root: '#app', // App root element
  id: 'io.framework7.testapp', // App bundle ID
  name: 'My app', // App name
  dialog: {
    title: 'Alert'
  },
  statusbar: {
    iosOverlaysWebview: true,
  },
  theme: 'auto', // Automatic theme detection
  // App routes
  routes: routes,  
});

// Init/Create main view
var mainView = app.views.create('.view-main', {
  url: '/'
});

const apiUrl = 'http://localhost/f7_API/'; // API Server URL

//If authentication is success, moving to Main page.
var userid = localStorage.getItem("userid"); 

if (userid) { 
  mainView.router.navigate('/home/', {
    clearPreviousHistory: true
  });
}