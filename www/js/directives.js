angular.module('starter')  
.directive('radioButtonGroup', function(){

	var dController = ['$scope', function($scope){
		$scope.buttons = $scope.options.split(',');
		$scope.leftEndButton = -1;
		$scope.rightEndButton = 1;
		$scope.middleButton = 0;
		$scope.activeButtonIndex = -1;
		$scope.setButtonIndex = function(buttonCaption){
			var bIndex = -1;
			for(var index in $scope.buttons)
				if($scope.buttons[index]==buttonCaption)
					{bIndex = index;break;}
			$scope.activeButtonIndex = bIndex;
			$scope.selectedbutton = buttonCaption;
			return bIndex;
		}
		$scope.getButtonIndex = function(buttonCaption){
			var bIndex = -1;
			for(var index in $scope.buttons)
				if($scope.buttons[index]==buttonCaption)
					{bIndex = index;break;}
			return bIndex;
		}
		$scope.buttonPosition = function(buttonCaption){
			var position = $scope.middleButton;
			var buttonsCount = $scope.buttons.length;
			if($scope.buttons!=null){
				if(buttonsCount>0){
					if($scope.buttons[0]==buttonCaption)
						position = $scope.leftEndButton;
				}
				if(buttonsCount>1){
					if($scope.buttons[buttonsCount-1]==buttonCaption)
						position = $scope.rightEndButton;
				}
			}
			return position;
		};
		$scope.getButtonCSSClass = function(buttonCaption){
			var isActive = ($scope.getButtonIndex(buttonCaption) == $scope.activeButtonIndex);
			switch($scope.buttonPosition(buttonCaption)){
				case $scope.leftEndButton:
					return ($scope.type.toUpperCase()=="OVAL") ? "radioButtonGroupLeftEnd" + (isActive?"Active":"") : "radioButtonGroupSquare"+ (isActive?"Active":"");
				case $scope.rightEndButton:
					return ($scope.type.toUpperCase()=="OVAL") ? "radioButtonGroupRightEnd" + (isActive?"Active":"") : "radioButtonGroupSquare"+ (isActive?"Active":"");
				case $scope.middleButton:
					return ($scope.type.toUpperCase()=="OVAL") ? "radioButtonGroup" + (isActive?"Active":"") : "radioButtonGroupSquare"+ (isActive?"Active":"");
			}
		};
		$scope.setButtonIndex($scope.selectedbutton);
	}];

	function generateTemplate(){
		var templateContent = "<h1>{{options}}</h1>";
		//templateContent += "<p ng-repeat='opt in options'>{{opt}}</p>"
		return templateContent;
	};

	return {
		restrict: 'E',
		scope: {
			options: '@' ,
			type : '@',
			selectedbutton: '='
		},
		controller: dController,
		//template: generateTemplate()
		templateUrl: "templates/radiobutton.html"
	};
});
  