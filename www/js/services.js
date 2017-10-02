angular.module('starter')
.service("cartService", function(){ 
    var cartTotalItems = 20;
    this.getCartQuantity = function(){
        return cartTotalItems;
    };
})
.service("userInfo", function(){
	var emailKey = '';
	var email = '';
	var token = {};
	var refreshToken = '';
	var userdata = {
		address: '',
		admin: false,
		callName: '',
		email: '',
		phone: '',
		sms: true,
		showNotification: true,
		name: '',
		whatsApp: true,
	};
	return {
		hasUserLoggedIn: function(){
			return !(emailKey=="");
		},
		replaceSymbol: function(source, symbols, replaceWith){
			var dummy = source;
			if(source != "") 
				if(symbols != "")
					for(var index=0;index<symbols.length;index++)
						dummy = dummy.replace(symbols.substring(index,index+1), replaceWith);
			return dummy;
		},
		getEmailKey: function(){ return emailKey;},
		getEmail: function(){ return email;},
		getToken: function(){ return token;},
		getRefreshToken: function(){ return refreshToken;},
		getUserData: function(){ return userdata;},
		clearUserData: function(){
			email = '';
			token = '';
			refreshToken = '';
			userdata.email = '';
			emailKey = '';
	        userdata.address = '';
	        userdata.admin = false;
	        userdata.callName = '';
	        userdata.email = '';
	        userdata.phone = '';
	        userdata.sms = true;
	        userdata.showNotification = true;
	        userdata.name = '';
	        userdata.whatsApp = true;
		},
		setUserData: function(loggedInUserInfo){ 
			email = loggedInUserInfo.email;
			token = loggedInUserInfo.getIdToken();
			refreshToken = loggedInUserInfo.refreshToken;
			userdata.email = loggedInUserInfo.email;
			emailKey = this.replaceSymbol(email,"@_.","");
			dBase.ref('/Users/' + emailKey).once('value').then(function(snapshot) {
		        userdata.address = snapshot.val().Address;
		        userdata.admin = snapshot.val().Admin;
		        userdata.callName = snapshot.val().CallName;
		        userdata.email = snapshot.val().Email;
		        userdata.phone = snapshot.val().Phone;
		        userdata.sms = snapshot.val().SMS;
		        userdata.showNotification = snapshot.val().ShowNotification;
		        userdata.name = snapshot.val().UserName;
		        userdata.whatsApp = snapshot.val().WhatsApp;
		    });
		}
	};
});