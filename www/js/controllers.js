angular.module('starter.controllers',[])

.controller('AppCtrl', function($scope, $ionicModal, $timeout,$state, userInfo,ionicToast) {
    $scope.hasUserLoggedIn = function(){
      return userInfo.hasUserLoggedIn();
    };
    $scope.isLoginPage = function(){
      return ($state.current.name == "app.login");
    };
    $scope.signOut = function(){
      firebase.auth().signOut();
      userInfo.clearUserData();
      $state.go("app.home", {
            url: '/home',
            views: {
              'menuContent': {
                templateUrl: 'templates/home.html',
                controller: 'homeCtrl',
                service:'cartService'
              }
            }
          });
      ionicToast.show('You are logged out now !', 'bottom', false, 4000);
      //alert("Logout successful!");
    };
})

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
.controller('locationCtrl', function($scope){
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

.controller('homeCtrl', function($scope, userInfo) {
  $scope.welcomeName = userInfo.getUserData().callName;
})

.controller('loginCtrl',['$scope', '$location','userInfo','$state','ionicToast', function($scope, $location, userInfo, $state,ionicToast){
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

    $scope.showPanel = function(panelName){
      $scope.showLogin=false;
      $scope.showResetPassword=false;
      $scope.showRegistration=false;
      if(panelName=="login")
        $scope.showLogin = true;
      else if(panelName=="register")
        $scope.showRegistration = true;
      else if(panelName=="reset")
        $scope.showResetPassword = true;
    };

    $scope.signIn = function(){
        var emailId = $scope.loginData.emailId;
        var password = $scope.loginData.password;
        firebase.auth().signInWithEmailAndPassword(emailId, password)
        .then( function(data){
          userInfo.setUserData(data);
          //$state.go("^");
          $state.go("app.home", {
              url: '/home',
              views: {
                'menuContent': {
                  templateUrl: 'templates/home.html',
                  controller: 'homeCtrl',
                  service:'cartService'
                }
              }
            });
          ionicToast.show('You are logged in now !', 'bottom', false, 4000);
          //alert("Logged in successful!");
        })
        .catch(function(error){
          //userInfo.setUserData(data);
          //$ionicLoading.show({ template: error.message, noBackdrop: true, duration: 2000 });
          //alert(error.message);
          ionicToast.show("", 'bottom', false, 4000);
          //console.log("Error while User login...");
          //console.log(error);
        });
    };
    $scope.resetPassword = function(){
      firebase.auth();
      var emailAddress = "user@example.com";
      auth.sendPasswordResetEmail(emailAddress).then(function() {
        // Email sent.
      }).catch(function(error) {
        // An error happened.
      });
    };
    $scope.registerUser = function(){

    };
    $scope.singOut = function(){
      firebase.auth().singOut().then(function(){
        userInfo.clearUserData();
      }).
      catch(function(error){
          console.log(error);
      });
    };
}])

.controller('PlaylistCtrl', function($scope, $stateParams) {
});

