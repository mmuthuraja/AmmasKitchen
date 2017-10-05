angular.module('starter.controllers',[])

.controller('AppCtrl', function($scope, $ionicModal, $timeout,$state, currentUser,ionicToast, pageService) {
    $scope.hasUserLoggedIn = function(){
      return currentUser.hasUserLoggedIn();
    };
    $scope.isLoginPage = function(){
      return ($state.current.name == "app.login");
    };
    $scope.signOut = function(){
      firebase.auth().signOut();
      currentUser.clearUserData();
      pageService.goTo('login');
      ionicToast.show('You are logged out now !', 'bottom', false, 4000);
    };
})

.controller('aboutusCtrl',function($scope){})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
  //test
})

.controller('todaysmenuCtrl',function($scope){
    //$scope.
})
.controller('locationsCtrl', function($scope){
    $scope.Locations = [];
    $scope.selectedLocation = {};
    $scope.locName="";
    dBase.ref('/Locations/').once('value').then(function(snapshot) {
        $scope.Locations = snapshot;
        $scope.selectedLocation = $scope.Locations.child('0').val();
        $scope.locName = $scope.selectedLocation.Name;
        $scope.setSelectedLocation($scope.selectedLocation);
        });
  $scope.IsItToday = function(dayName){
      var d = new Date();
      var weekday = new Array(7);
      weekday[0] =  "Sunday";
      weekday[1] = "Monday";
      weekday[2] = "Tuesday";
      weekday[3] = "Wednesday";
      weekday[4] = "Thursday";
      weekday[5] = "Friday";
      weekday[6] = "Saturday";
      return (weekday[d.getDay()]==dayName);
  };
  //google.maps.event.addDomListener(window, 'load', function() {
  $scope.setMapLocation = function(lat, lng) {
  
        var myLatlng = new google.maps.LatLng(lat, lng);

        var mapOptions = {
            center: myLatlng,
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        var map = new google.maps.Map(document.getElementById("map"), mapOptions);

        navigator.geolocation.getCurrentPosition(function(pos) {
            map.setCenter(new google.maps.LatLng(lat, lng));
            var myLocation = new google.maps.Marker({
                position: new google.maps.LatLng(lat, lng),
                map: map,
                title: "My Location"
            });
        });

        $scope.map = map;
    };

  $scope.setSelectedLocation = function(loc){
    $scope.selectedLocation = loc;
    $scope.locName=loc.Name;
    $scope.setMapLocation(loc.latitude, loc.longitude);
  };
  $scope.setSelectedLocation($scope.selectedLocation);
})

.controller('homeCtrl', function($scope, currentUser) {
  $scope.welcomeName = currentUser.getUserData().callName;
})

.controller('loginCtrl',['$scope', '$location','currentUser','$state','ionicToast','stringHandler','pageService',
 function($scope, $location, currentUser, $state,ionicToast,stringHandler,pageService){
    $scope.hasAlert = false;
    $scope.loginData = {
        emailId: "muthuajar@yahoo.com", 
        password: "testuser"
      };
    $scope.userInfo = {
      emailId: "",
      password: "",
      address: "",
      callName: "",
      phone: "",
      sms: true,
      showNotification: true,
      whatsApp: true
    };
    $scope.showLogin=true;
    $scope.showResetPassword=false;
    $scope.showRegistration=false;
    $scope.alertMessage = "";

    function setAlert(message){
      $scope.hasAlert = true;
      $scope.alertMessage = message;
    };

    $scope.showPanel = function(panelName){
      $scope.showLogin=false;
      $scope.showResetPassword=false;
      $scope.showRegistration=false;
      if(panelName=="login")
        $scope.showLogin = true;
      else if(panelName=="register")
        {$scope.showRegistration = true;$scope.hasAlert=false;}
      else if(panelName=="reset")
        {$scope.showResetPassword = true;$scope.hasAlert=false;}
    };

    $scope.signIn = function(){
        $scope.hasAlert=false;
        var emailId = $scope.loginData.emailId;
        var password = $scope.loginData.password;
        firebase.auth().signInWithEmailAndPassword(emailId, password)
        .then( function(data){
          currentUser.setUserData(data);
          setAlert('You are logged in now !');
          ionicToast.show('You are logged in now !', 'bottom', false, 4000);
          pageService.goTo('home');
        })
        .catch(function(error){
          setAlert(error.message);
          ionicToast.show("error.message", 'bottom', false, 4000);
        });
    };
    $scope.resetPassword = function(){
      $scope.hasAlert = false;
      var emailAddress = $scope.loginData.emailId;
      firebase.auth().sendPasswordResetEmail(emailAddress)
        .then(function(){
          setAlert("An email has been sent to you to reset your password.");
        })
        .catch(function(error) {
          setAlert(error.message);
          ionicToast.show(error.message, 'bottom', false, 4000);
        });
      ionicToast.show("An email has been sent to you to reset your password.", 'bottom', false, 4000);
      $scope.showPanel('login');
    };

    $scope.registerUser = function(){
      $scope.hasAlert = false;
       var emailKey = stringHandler.replaceSymbol($scope.userInfo.emailId,"@_.","");
       dBase.ref('/Users/' + emailKey).set({
          Address: $scope.userInfo.address,
          Admin: false,
          CallName: $scope.userInfo.callName,
          Email: $scope.userInfo.emailId,
          Password: $scope.userInfo.password,
          Phone: $scope.userInfo.phone,
          SMS: $scope.userInfo.sms,
          UserName: "",
          ShowNotification: $scope.userInfo.showNotification,
          WhatsApp: $scope.userInfo.whatsApp
       });
      firebase.auth().createUserWithEmailAndPassword($scope.userInfo.emailId, $scope.userInfo.password)
        .catch(function(error){
          setAlert(error.message);
          ionicToast.show("Unable to create user. " + error.message , 'bottom',false, 4000);
        });
      setAlert('Registered successfully!');
      $scope.showPanel('login');
    };

    $scope.singOut = function(){
      firebase.auth().singOut().then(function(){
        currentUser.clearUserData();
      }).
      catch(function(error){
          console.log(error);
      });
    };
}])

.controller('PlaylistCtrl', function($scope, $stateParams) {
});

