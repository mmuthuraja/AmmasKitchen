angular.module('starter.controllers',[])

.controller('AppCtrl', function($scope, $ionicModal, $timeout,$state, spinningService, currentUser,ionicToast, pageService) {
    $scope.hasUserLoggedIn = function(){
      return currentUser.hasUserLoggedIn();
    };
    $scope.isUserAdmin = function(){
      var userInfo = currentUser.getUserData();
      return userInfo.admin;
    };
    $scope.isLoginPage = function(){
      return ($state.current.name == "app.login");
    };
    $scope.signOut = function(){
      spinningService.show();
      for(var i=0; i<=100000;i++){}
      firebase.auth().signOut();
      currentUser.clearUserData();
      pageService.goTo('login');
      ionicToast.show('You are logged out now !', 'bottom', false, 4000);
      spinningService.hide();
    };
})
.controller('settingsCtrl',function($scope, todayMenuSettings, spinningService){
  /***** for settings -- START **************/
  $scope.settings = [{"Name":"Today's Menu", "Code":"TM" },
                     {"Name":"Items","Code":"I"},
                     {"Name":"Categories","Code":"C"},
                     {"Name":"Other","Code":"O"}];
  $scope.currentSetting = "TM";
  $scope.setSelectedSetting = function(setName){
    $scope.currentSetting=setName;
  };
  $scope.canShowSettings=function(code){
    return ($scope.currentSetting==code);
  };
  /***** for settings -- END **************/

  /***** for todays Menu settings -- START **************/
  $scope.todaysMenuChoices = [];
  $scope.Categories = [{"Id":"CD","Name":"Dosa","Index":1},{"Id":"CNVA","Name":"Non-Veg Appatizer","Index":2}];
  $scope.Items = [];
  $scope.todaysMenuItems = [];
  $scope.SelectedCategory = null;

  $scope.getCategory = function(catId){
    var result = null;
    for(var catIndex in $scope.Categories)
      if($scope.Categories[catIndex].Id==catId){
        result = $scope.Categories[catIndex];
        break;
      }
    return result;
  };

  function refreshCategories(){
    $scope.Categories = todayMenuSettings.getCategories();
    $scope.Categories.sort(function(cat1, cat2){
              return cat1.Index - cat2.Index;
      });
    if($scope.Categories.length>0){
      $scope.SelectedCategory = $scope.Categories[0];
      //$scope.data.tempCategory = $scope.Categories[0].Id;
      $scope.refreshSelectedCategoryItems($scope.Categories[0].Id);
    }
  };

  $scope.refreshSelectedCategoryItems = function(catId){
    $scope.Items = [];
    $scope.SelectedCategory = $scope.getCategory(catId);
    todayMenuSettings.loadItems(catId, loadItems);
    //alert($scope.SelectedCategory.Id);
  };

  function refreshTodaysMenuItems(aTodaysMenuItems){
    $scope.todaysMenuItems = aTodaysMenuItems;
  };

  function isItInTodaysMenuItems(itemId){
    var isExist = false;
    if($scope.todaysMenuItems.length>0){
      for(index in $scope.todaysMenuItems)
        if($scope.todaysMenuItems[index].Id==itemId){
          isExist=true;
          break;
        }
    }
    return isExist;
  };

  function loadItems(aItems){
    $scope.Items = []; //aItems;
    for(index in aItems){
      var item = {
        "CategoryId": aItems[index].CategoryId,
        "ChiefSpecial": aItems[index].ChiefSpecial,
        "Desc": aItems[index].Desc,
        "Id": aItems[index].Id,
        "Name": aItems[index].Name,
        "Price": aItems[index].Price,
        "Spicy": aItems[index].Spicy,
        "ImageUrl": aItems[index].ImageUrl,
        "Checked": isItInTodaysMenuItems(aItems[index].Id)
      };
      $scope.Items.push(item);
    }
    spinningService.hide();
  }
  $scope.removeItemFromTodaysMenu = function(itemId){
    var newArray = [];
    for(var index in $scope.todaysMenuItems)
      if($scope.todaysMenuItems[index].Id!=itemId)
        newArray.push($scope.todaysMenuItems[index]);
    $scope.todaysMenuItems = newArray;
  };
  $scope.ModifyItems = function(){
    spinningService.show();
    // removing all items from current category from todays menu
    for(var itmIndex in $scope.Items)
      $scope.removeItemFromTodaysMenu($scope.Items[itmIndex].Id);
    // adding the ones which have selected to todays menu
    for(var itmIndex in $scope.Items)
      if($scope.Items[itmIndex].Checked)
        $scope.todaysMenuItems.push($scope.Items[itmIndex]);
    dBase.ref('/TodayMenuItem').set($scope.todaysMenuItems)
      .then(function(){
        spinningService.hide();
      })
      .catch(function(err){
        spinningService.hide();
      });
    
  };
  spinningService.show();
  todayMenuSettings.loadTodaysMenuItems(refreshTodaysMenuItems);
  todayMenuSettings.loadCategories(refreshCategories);
  /***** for todays Menu settings -- END **************/
  
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

.controller('todaysmenuCtrl',function($scope, todaysMenu, spinningService){
    $scope.totalTodaysItems =-1;
    $scope.itemsCategory = [];
    $scope.itemsList = [];
    $scope.hasAdded2Cart = function (itemId){
      return false;
    };
    $scope.sameCategory = function(catId, itemCatId){
      return catId==itemCatId;
    };
    $scope.isEmptyDesc = function(desc){
      return (desc=="" || desc == "undefined" || desc ==null);
    }
    $scope.isNormalSpicy = function(spicyCode){
      return (spicyCode=="Normal" || spicyCode=="Medium" || spicyCode=="Hot");
    }
    $scope.isMediumSpicy = function(spicyCode){
      return (spicyCode=="Medium" || spicyCode=="Hot");
    }
    $scope.isHotSpicy = function(spicyCode){
      return (spicyCode=="Hot");
    }
    function isCategoryExist(categoryId){
      var exists = false;
      for(catIndex in $scope.itemsCategory)
        if($scope.itemsCategory[catIndex].Id == categoryId)
          {exists = true;break;}
      return exists;
    };
    function refreshItems(){
      $scope.totalTodaysItems = $scope.totalTodaysItems + 1;
      if($scope.totalTodaysItems == 0){
        spinningService.show();
        todaysMenu.loadCategories(refreshItems);
      }
      if(todaysMenu.itemsCount>0){
        if($scope.totalTodaysItems==todaysMenu.itemsCount)
        {
          $scope.itemsList = todaysMenu.getItems();
          $scope.itemsList.sort(function(item1, item2){
              return item1.Category.Index - item2.Category.Index;
          });
          for(itemIndex in $scope.itemsList){
            if(!isCategoryExist($scope.itemsList[itemIndex].Category.Id)){
              $scope.itemsCategory.push($scope.itemsList[itemIndex].Category);
            }
          }
        }
        spinningService.hide();
      }
    };
    refreshItems();
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

.controller('loginCtrl',function($scope, $location, currentUser, 
                                  $state,ionicToast,stringHandler,
                                  pageService, spinningService){
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
    function canLogin(emailId, password){
        emailId = (emailId==undefined)?"":emailId.replace(" ","");
        password = (password==undefined)?"":password.replace(" ","");
        if(emailId=="" || password==""){
          setAlert("email or password is missing..");
          ionicToast.show('email or password is missing..', 'bottom', false, 4000);
          return false;
        }
        return true;
    };
    function registerUser(emailKey){
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
    };
    $scope.signIn = function(){
        $scope.hasAlert=false;
        var emailId = $scope.loginData.emailId;
        var password = $scope.loginData.password;
        if(canLogin(emailId,password)){
          spinningService.show();
          firebase.auth().signInWithEmailAndPassword(emailId, password)
          .then( function(data){
            currentUser.setUserData(data);
            ionicToast.show('You are logged in now !', 'bottom', false, 4000);
            pageService.goTo('home');
            spinningService.hide();
          })
          .catch(function(error){
            setAlert(error.message);
            ionicToast.show("error.message", 'bottom', false, 4000);
            spinningService.hide();
          });
        }
    };
    $scope.resetPassword = function(){
      $scope.hasAlert = false;
      var emailAddress = $scope.loginData.emailId;
      spinningService.show();
      firebase.auth().sendPasswordResetEmail(emailAddress)
        .then(function(){
          setAlert("An email has been sent to you to reset your password.");
          spinningService.hide();
        })
        .catch(function(error) {
          setAlert(error.message);
          ionicToast.show(error.message, 'bottom', false, 4000);
          spinningService.hide();
        });
      ionicToast.show("An email has been sent to you to reset your password.", 'bottom', false, 4000);
      $scope.showPanel('login');
    };

    $scope.registerUser = function(){
       spinningService.show();
       $scope.hasAlert = false;
       var emailKey = stringHandler.replaceSymbol($scope.userInfo.emailId,"@_.","");
      firebase.auth().createUserWithEmailAndPassword($scope.userInfo.emailId, $scope.userInfo.password)
        .then(function(){
          registerUser(emailKey);
          spinningService.hide();
        })
        .catch(function(error){
          spinningService.hide();
          setAlert(error.message);
          ionicToast.show("Unable to create user. " + error.message , 'bottom',false, 4000);
        });
      setAlert('Registered successfully!');
      $scope.showPanel('login');
    };

    $scope.singOut = function(){
      spinningService.show();
      firebase.auth().singOut().then(function(){
        currentUser.clearUserData();
        spinningService.hide();
      }).
      catch(function(error){
          spinningService.hide();
          console.log(error);
      });
    };
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
});

