angular.module('starter')
.service("cartService", function(){ 
    var cart = {
    	"ItemsCount":0,
    	"Items":[{"Id":"Dummy", "Quantity":0, "Discount":0, "UnitPrice":0, "Total":0}]
    };
    Array.prototype.removeCartItem = function(name, value){
 		var array = $.map(this, function(v,i){
      			return v[name] === value ? null : v;
   			});
   		this.length = 0; //clear original array
   		this.push.apply(this, array); //push all elements except the one we want to delete
	};
	return {
		getItems: function(){
			return cart.Items;
		},
		getTotalAmount: function(){
			var totalAmt = 0;
			for (i in cart.Items) 
    			totalAmt += cart.Items[i].Total;
			return totalAmt;
		},
		getTotalItems: function(){
			var totalItms = 0;
			for (i in cart.Items) 
    			totalItms += cart.Items[i].Quantity;
			return totalItms;
		},
		isItemExist: function(code){
			var exist = false;
			for (i in cart.Items) {
    			if(cart.Items[i].Id === code){
    				exist = true;
    				break;
    			}
			}
			return exist;
		},
		addItem2Cart: function(code, qty, disc, price){
        	cart.ItemsCount += qty;
			var total = (qty * price) - ((qty*price) * (disc/100) );
			cart["Items"].push({"Id": code, "Quantity":qty, "Discount":disc, "UnitPrice":price, "Total":total})
		},
		updateItemQuantity: function(code, qty){
			for (i in cart.Items) {
    			if(cart.Items[i].Id === code){
    				cart.ItemsCount += qty;
    				cart.Items[i].Quantity += qty;
    				if(cart.Items[i].Quantity==0 || qty==0) {// if item qty is zero, then remove it from cart.
                    	cart.ItemsCount -= cart.Items[i].Quantity;
    					delete cart.Items[i];
                    }
    				else
	    				cart.Items[i].Total = (cart.Items[i].Quantity * cart.Items[i].UnitPrice) - ((cart.Items[i].Quantity*cart.Items[i].UnitPrice) * (cart.Items[i].Discount/100) );
    				break;
    			}
			}
		},
		addItemQuantity: function(code){ 
			this.updateItemQuantity(code, 1);
		},
		reduceItemQuantity : function(code, qty){
			this.updateItemQuantity(code, -1);	
		},
		removeCartItem: function(code){
			this.updateItemQuantity(code,0);
		}
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