angular.module('starter')
.service("cartService", function(){ 
    var cartTotalItems = 20;
    this.getCartQuantity = function(){
        return cartTotalItems;
    };
});