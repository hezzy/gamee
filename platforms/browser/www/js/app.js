// Dom7
var $$ = Dom7;

// Framework7 App main instance
var app  = new Framework7({
  root: '#app', // App root element
  id: 'ng.dialacab.driverapp', // App bundle ID
  name: 'Dial a Cab', // App name
  theme: 'auto', // Automatic theme detection
  // App root data
  data: function () {
    return {
      user: {
        firstName: 'John',
        lastName: 'Doe',
      },
    };
  },
  // App root methods
  methods: {
    helloWorld: function () {
      app.dialog.alert('Hello World!');
    },
  },
  // App routes
  routes: routes,
  // Enable panel left visibility breakpoint
  panel: {
    leftBreakpoint: 960,
  },
});

// Init/Create left panel view
var mainView = app.views.create('.view-left', {
  url: '/'
});

// Init/Create main view
var mainView = app.views.create('.view-main', {
  url: '/'
});

function nformat(x){
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

function loadlist(userID){
	var reqst = 'triplist';
	app.request.post('https://dialacab.ng/driverapp/', {req: reqst, user: userID}, function (data) {
    localStorage.tripList = data;
	$$('.triplist').html(data); });	
}



function loadContent(){
	$$('.appFullName').text(localStorage.appFullName);
	$$('.appWallet').text('₦' + nformat(localStorage.appWallet));
	$$('.appUserName').text(localStorage.appUserName);
	$$('.appUserEmail').text(localStorage.appUserEmail);
	$$('.appUserPhone').text(localStorage.appUserPhone);

}


$$(document).on('page:init', function (e) {
	loadContent();

});

$$(document).on('page:init', '.page[data-name="home"]', function (e) {

  });

if(localStorage.loginstatus != "true"){
	$$('.view-main, .panel').hide();
  app.loginScreen.open('#my-login-screen');
}else{
	$$('.view-main, .panel').show();
	loadContent();
	(function loopingFunction() {
    loadlist(localStorage.appUserID);
    setTimeout(loopingFunction, 20000);
})();	
}

// Logout
$$('.logout').on('click', function () {
  localStorage.loginstatus = "false";
  app.loginScreen.open('#my-login-screen');
  //app.dialog.alert('Successfully logged out');
	
});


// Login Screen
$$('#my-login-screen .login-button').on('click', function () {
  var username = $$('#my-login-screen [name="username"]').val();
  var password = $$('#my-login-screen [name="password"]').val();
  var reqst = 'login';
if(username != '' && password != ''){
 app.preloader.show();
  
app.request.post('https://dialacab.ng/driverapp/', {req: reqst, user: username, pass: password}, function (data) {
	data = JSON.parse(data);
 //app.dialog.alert(data.status);
  if(data.status == 'failed'){
	$$('.loginStat').html('<span class="red">'+ data.error +'</span>');	
	app.preloader.hide();
  }
	else if(data.status == 'success'){
  // Close login screen
	$$('.view-main, .panel').show();
	localStorage.loginstatus = "true";
    localStorage.appFullName = data.fullName;
    localStorage.appWallet = data.wallet;
    localStorage.appUserName = data.userName;
    localStorage.appUserEmail = data.email;
    localStorage.appUserPhone = data.phone;
    localStorage.appUserID = data.userID;
    localStorage.tripList = data.triplist;
	app.loginScreen.close('#my-login-screen');	
	loadContent();
	$$('.loginStat').html('');
  app.preloader.hide();
  

  
}
  else{	
	$$('.loginStat').html('<span class="red">Error! Unknown Error!</span>');	
	app.preloader.hide();
} 
  
}, function(){
	$$('.loginStat').html('<span class="red">Error! No internet connection.</span>');	
	app.preloader.hide();
}, {dataType: 'json'});

}
});


