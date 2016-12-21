var toolbox = angular.module('toolbox', [ 'ngCookies', 'ngRoute', 'ngTouch',
                                          'ngSanitize', 'gloria.api', 'ui.bootstrap']);
toolbox.config(['$routeProvider',function($routeProvider){
	/*$routeProvider.when('/', {
	    templateUrl: "html/main.html",
	    controller: "MainController"
	});*/
  $routeProvider.when('/', {
	    templateUrl: "html/cazast-login.html",
	    controller: "CazasteroidesController"
	});
	$routeProvider.when('/home', {
	    templateUrl: "html/home.html",
	    controller: "LoginController"
	});
	$routeProvider.when('/login', {
	    templateUrl: "html/login.html",
	    controller: "LoginController"
	});
	$routeProvider.when('/register', {
	    templateUrl: "html/register.html",
	    controller: "RegisterController"
	});
	$routeProvider.when('/images', {
	    templateUrl: "html/images.html",
	    controller: "ImagesController"
	});
	$routeProvider.when('/reservations', {
	    templateUrl: "html/reservations.html",
	    controller: "ReservationsController"
	});
	$routeProvider.when('/reservations/new', {
	    templateUrl: "html/reservations.html",
	    controller: "ReservationsController"
	});
	$routeProvider.when('/reservations/pending', {
	    templateUrl: "html/reservations.html",
	    controller: "ReservationsController"
	});
	$routeProvider.when('/experiment/solar', {
	    templateUrl: "html/solar-experiment.html",
	    controller: "SolarExperimentController"
	});

  $routeProvider.when('/cazast-login', {
	    templateUrl: "html/cazast-login.html",
	    controller: "CazasteroidesController"
	});
  $routeProvider.when('/cazast-signup', {
	    templateUrl: "html/cazast-signup.html",
	    controller: "CazasteroidesController"
	});
  $routeProvider.when('/cazast-forgot', {
	    templateUrl: "html/cazast-forgot.html",
	    controller: "CazasteroidesController"
	});
  $routeProvider.when('/cazast-main', {
	    templateUrl: "html/cazast-main.html",
	    controller: "CazasteroidesController"
	});
  $routeProvider.when('/cazast-vote', {
      templateUrl: "html/cazast-vote.html",
      controller: "CazasteroidesController"
  });
  $routeProvider.when('/cazast-firststeps', {
      templateUrl: "html/cazast-firststeps.html",
      controller: "CazasteroidesController"
  });
  $routeProvider.when('/televirt', {
      templateUrl: "html/cazast-televirt.html",
      controller: "CazasteroidesController"
  });
  $routeProvider.when('/televirt2', {
      templateUrl: "html/cazast-televirt2.html",
      controller: "CazasteroidesController"
  });
  $routeProvider.when('/fields', {
      templateUrl: "html/cazast-fields.html",
      controller: "CazasteroidesController"
  });
  $routeProvider.when('/cazast-me', {
      templateUrl: "html/cazast-me.html",
      controller: "CazasteroidesController"
  });
  $routeProvider.when('/premios', {
      templateUrl: "html/cazast-premios.html",
      controller: "CazasteroidesController"
  });
  $routeProvider.when('/review', {
      templateUrl: "html/cazast-review.html",
      controller: "CazasteroidesController"
  });

	$routeProvider.when('/experiment/night', {
	    templateUrl: "html/night-experiment.html",
	    controller: "NightExperimentController"
	});
}]);

toolbox.directive('fallbackSrc', function () {
	var fallbackSrc = {
		link: function postLink(scope, iElement, iAttrs) {
			iElement.bind('error', function() {
				angular.element(this).attr("src", iAttrs.fallbackSrc);
			});
		}
	}
	return fallbackSrc;
});

toolbox.controller('MainController',function(){

});
toolbox.controller('LoginController', function($gloriaAPI, $scope, $location, Login, $timeout) {
    $scope.$on('$routeChangeSuccess', function() {
	    $("#sidebar").panel();
	    $("#sidelistview").listview();
    });

	$scope.login_loading = false;
	$scope.login = {};
	$scope.login.user = null;
	$scope.login.screen_name = null;
	$scope.verified = false;
	$scope.login.failed = false;
	$scope.login.email='sergy_keko_93@hotmail.com';
	$scope.login.password='SRDgloria2016';


	$scope.option = 'register';
	$scope.accountOption = "base.login.forgot";

	$scope.toggleLoginFace = function() {
		if ($scope.option == 'register') {
			$scope.accountOption = "base.login.new";
			$scope.option = 'reset';
		} else {
			$scope.accountOption = "base.login.forgot";
			$scope.option = 'register';
		}
	};

	$scope.inputStyle = {};

	$scope.canBeShown = function() {
		var view = $gloriaView.getViewInfoByPath($location.path());
		var go = false;

		if (view != undefined) {
			if ($scope.login.user != null) {
				go = view.visibility != 'only-public';
				if (!go) {
					$scope.login.disconnect();
				}

				return go;
			}

			go = view.visibility == "public"
					|| view.visibility == "only-public";

			if (go)
				return true;
		}

		if ($scope.login.user != null) {
			$scope.login.disconnect();
		}

	};

	$scope.login.connect = function() {
		if ($scope.login.email != null && $scope.login.password != null) {
			$scope.login_loading = true;
			Login.authenticate($scope.login.email, $scope.login.password).then(function() {
				$scope.login.success=true;
			}, function() {
				$scope.login.user = null;
				$scope.login.screen_name = null;
				$scope.login.failed = true;
				$scope.login.success=false;
				$scope.login_loading = false;
				$('#alert').modal();
			});

			Login.afterConnect(function() {
				$scope.login.user = $scope.login.email;

				var alias = Login.getUserInfo().alias;

				if (alias == null || alias == "") {
					$scope.login.screen_name = $scope.login.user;
				} else {
					$scope.login.screen_name = alias;
				}
				$scope.login.finalEmail = $scope.login.email;

				if ($location.url()=='/login'){
					$scope.login_loading = false;
					$('#alert').modal();
					$timeout($scope.welcome,1000);
				}
				else {
					$location.url('/home');
				}
			});
		}
		else {
			$scope.login.success=false;
			$('#alert').modal();
		}
	};
	$scope.welcome=function(){
		$('body').removeClass('modal-open');
		$('.modal-backdrop').remove();
		$location.url('/home');
	}
	$scope.$watch('login.email', function() {
		if ($scope.login.failed) {
			$scope.login.failed = false;
		}
	});

	$scope.$watch('login.password', function() {
		if ($scope.login.failed) {
			$scope.login.failed = false;
		}
	});

	$scope.login.disconnect = function() {
		Login.disconnect();
		$scope.login.user = null;
		$scope.login.screen_name = null;
		$scope.login.email = null;
		$scope.login.password = null;
		document.execCommand("ClearAuthenticationCache");
		//$location.url('/login');
	};

	$scope.$on('unauthorized', function() {
		console.log("unauthorized event received!");
		$scope.login.disconnect();
	});

	$scope.$on('server down', function() {
		console.log("server down event received!");
		$scope.login.disconnect();
	});

	Login.verifyToken(function() {
		$scope.login.user = Login.getUser();

		$scope.login.email = $scope.login.user;
		$scope.login.finalEmail = $scope.login.email;
		$scope.verified = true;
		var alias = Login.getUserInfo().alias;
		if (alias == null || alias == "") {
			$scope.login.screen_name = $scope.login.user;
		} else {
			$scope.login.screen_name = alias;
		}
	}, function() {
		$scope.verified = true;
		//if($location.url()!='/' && $location.url()!='/register')
			//$location.url('/login');
	});

	$scope.$on('$destroy', function() {
		$timeout.cancel($scope.login.timer);
	});

});
toolbox.controller('RegisterController',function($scope,Login,$timeout){
    $scope.$on('$routeChangeSuccess', function() {
	    $("#sidebar").panel();
	    $("#sidelistview").listview();
    });

	$scope.register_loading = false;
	$scope.register={};

	$scope.register.registerUser = function() {
		if($scope.register.alias!=null && $scope.register.email!=null && $scope.register.password!=null && $scope.register.password_2!=null){
			if($scope.register.password==$scope.register.password_2){
				$scope.register.success=null;
				$scope.register_loading = true;
				Login.registerUser($scope.register.alias, $scope.register.email, $scope.register.password,
					function(success){
						$scope.register.success=true;
						$scope.register_loading = false;
						$('#alert').modal();
					}, function(){
						$scope.register.success=false;
						$scope.register_loading = false;
						$('#alert').modal();
				});
			}
			else {
				$('#alert').modal();
			}
		}
	}
});

toolbox.controller('ImagesController',function($gloriaAPI,$scope){
    $scope.$on('$routeChangeSuccess', function() {
	    $("#sidebar").panel();
	    $("#sidelistview").listview();
    });

	$scope.images={};
	$scope.images.count=0;
	$scope.images.total=0;
	$scope.images.date=new Date();
    $scope.images.year=$scope.images.date.getFullYear();
    $scope.images.month=$scope.images.date.getMonth()+1;
    $scope.images.day=$scope.images.date.getDate();
    $scope.images.maxDate=new Date();

	$scope.date_options = {
		maxDate: $scope.images.maxDate,
		showWeeks: false
	}

    $scope.$watch('images.date', function(val, oldval){
    	if(val!=null || val==oldval){
            var date = new Date(val);
            $scope.images.year=date.getFullYear();
            $scope.images.month=date.getMonth()+1;
            $scope.images.day=date.getDate();
    	    $('#current_image').hide();
    	    $('#notfound_image').hide();
    	    $('#loading_image').show();
    	    $('#final_image').hide();
    	    $('#non_image').hide();
	        if($scope.images.year!=null && $scope.images.month!=null && $scope.images.day!=null){
	        	$gloriaAPI.getImagesByDate($scope.images.year,$scope.images.month,$scope.images.day,function(data){
	        		$scope.imagenes=data;
	        		$scope.images.total=0;
	        		$scope.images.count=0;
	    			$scope.images.fullscreencount=0;
	        		while(1){
	        			if(data[$scope.images.total]==undefined){
	        				break;
	        			}
	        			$scope.images.total++;
	        		}
	        		if($scope.images.total==0){
	        			$('#notfound_image').show();
	            	    $('#loading_image').hide();
	        		}
	        	});
	        }
    	}
    });
    $scope.images.random=function(){
	    $('#current_image').hide();
	    $('#notfound_image').hide();
	    $('#loading_image').show();
	    $('#final_image').hide();
	    $('#non_image').hide();
		$('#carousel').hide();
		$scope.imagenes=null;
		$scope.images.mine=false;
		var num=1;
		$gloriaAPI.getRandomImages(num,function(data){
			$scope.imagenes=data;
			$scope.images.count=0;
			$scope.images.total=num;
		});
	}
    $scope.images.myRandom=function(){
	    $('#current_image').hide();
	    $('#notfound_image').hide();
	    $('#loading_image').show();
	    $('#final_image').hide();
	    $('#non_image').hide();
		$('#carousel').hide();
		$scope.imagenes=null;
		$scope.images.mine=true;
		var num=1;
		$gloriaAPI.getMyRandomImages(num,function(data){
			$scope.imagenes=data;
			$scope.images.count=0;
			$scope.images.total=0;
    		while(1){
    			if(data[$scope.images.total]==undefined){
    				break;
    			}
    			$scope.images.total++;
    		}
    		if($scope.images.total==0){
    			$('#notfound_image').show();
        	    $('#loading_image').hide();
    		}
		});
	}
    $scope.images.more=function(){
	    $('#loading_fullimage').show();
    	if($scope.images.mine==true){
    		$scope.images.myRandom();
    	}
    	else{
    		$scope.images.random();
    	}
    }
    $scope.images.counter=function(operation){
    	if(operation==true){
    		if($scope.images.count<$scope.images.total-1){
    		    $('#current_image').hide();
    		    $('#non_image').hide();
    		    $('#loading_image').show();
        		$scope.images.count++;
    			$scope.images.fullscreencount++;
    		}
    	}
    	else if(operation==false){
    		if($scope.images.count>0){
    		    $('#current_image').hide();
    		    $('#non_image').hide();
    		    $('#loading_image').show();
    			$scope.images.count--;
    			$scope.images.fullscreencount--;
    		}
    	}
    	else if(operation=='fulltrue'){
    		if($scope.images.fullscreencount<$scope.images.total-1){
        		$scope.images.fullscreencount++;
    		}
    	}
    	else if(operation=='fullfalse'){
    		if($scope.images.fullscreencount>0){
        		$scope.images.fullscreencount--;
    		}
    	}
    }
	$scope.$watch('images.fullscreen',function(val){
		if(val==true){
			$('#capa').css({'background-color':'rgba(0,0,0,1)','top':'0','z-index':'1'});
			$('#principal').css({'z-index':'0'});
			$('#principal').hide();
			$('#header').hide();
		}
		else{
			$('#header').show();
			$('#capa').css({'background-color':'rgba(255,255,255,0)','top':'50px','z-index':'0'});
			$('#principal').css({'z-index':'1'});
			$('#principal').show();
		}
	});

	$('#current_image').error(function() {
		$(this).hide();
		if($scope.images.total<=1){
			if($scope.images.mine==true){
				$scope.images.myRandom();
			}
			else {
				$scope.images.random();
			}
		}
		else {
		    $('#non_image').show();
		    $('#loading_image').hide();
		    $('#final_image').show();
		}
	});
	$('#current_image').load(function() {
	    $(this).show();
	    $('#notfound_image').hide();
	    $('#loading_image').hide();
	    $('#final_image').show();
	    $('#non_image').hide();
	});
	$('#current_image').ready(function() {
	    $(this).hide();
	    $('#notfound_image').hide();
	    $('#loading_image').show();
	    $('#final_image').hide();
	    $('#non_image').hide();
	});
});

toolbox.controller('ReservationsController',function($gloriaAPI,$scope,$location,$timeout){
    $scope.$on('$routeChangeSuccess', function() {
	    $("#sidebar").panel();
	    $("#sidelistview").listview();
    });

	$scope.reservation={};
    $scope.reservation.minDate=new Date();
    $scope.reservation.minDate.setDate($scope.reservation.minDate.getDate());
    $scope.reservation.maxDate=new Date();
    $scope.reservation.maxDate.setDate($scope.reservation.maxDate.getDate()+6);
    $scope.reservation.summary=0;
	$scope.experimentSelected=null;
	$scope.telescopeSelected=null;
    $scope.hourSelected={};
    $scope.hourSelected.begin=null;
    $scope.hourSelected.end=null;
	$scope.reservation.anewURL=false;
	$scope.reservation.pendingURL=false;
	$scope.reservation.loading=false;
	$scope.reservation.notavailable=false;
	$( "#resrvationdatepicker" ).datepicker();
	$scope.date_options = {
		minDate: $scope.reservation.minDate,
		maxDate: $scope.reservation.maxDate,
		showWeeks: false
	}
	$scope.newReservation=function(){
		$('#alert').hide();
		$('body').removeClass('modal-open');
		$('.modal-backdrop').remove();
		$location.url('/reservations/new');
		$scope.reservation.anewURL=true;
		$scope.reservation.pendingURL=false;
	}
	$scope.pendingReservation=function(){
		$location.url('/reservations/pending');
		$('#alert').hide();
		$('body').removeClass('modal-open');
		$('.modal-backdrop').remove();
		$scope.reservation.anewURL=false;
		$scope.reservation.pendingURL=true;
		$scope.getPendingReservations();
	}
	$scope.setExperimentSelected=function(val){
		$scope.telescopeSelected=null;
		$scope.reservation.date=null;
		$scope.reservation.notavailable=false;
		$scope.experimentSelected=val;
		$('label#experiment-option').removeClass('active');
	}
	$scope.setTelescopeSelected=function(val){
		$scope.telescopeSelected=null;
		$scope.reservation.date=null;
		$scope.reservation.notavailable=false;
		$scope.telescopeSelected=val;
	}
	$scope.$watch('reservation.date', function(val){
    	if(val!=null){
            var date = new Date(val);
        	$scope.reservation.loading=true;
			$scope.reservation.available=null;
			$scope.reservation.notavailable=false;
    		$gloriaAPI.getAvailableReservations($scope.experimentSelected, [$scope.telescopeSelected], date,
    				function(data){
    			if(data[0]){
        			$scope.reservation.available=data;
    			}
    			else {
        			$scope.reservation.notavailable=true;
    			}
    			$scope.reservation.loading=false;
    		});
    	}
	});
	$scope.reservationSummaryOn=function(hour){
		$scope.reservation.makeSuccess=null;
		$scope.hourSelected.begin=hour.begin;
		$scope.hourSelected.end=hour.end;
	}
	$scope.reservationSummaryOff=function(){
		$scope.hourSelected.begin=null;
		$scope.hourSelected.end=null;
		$scope.reservation.makeSuccess=null;
		$('body').removeClass('modal-open');
		$('.modal-backdrop').remove();
	}
	$scope.makeReservation=function(){
		$gloriaAPI.makeReservation($scope.experimentSelected,[$scope.telescopeSelected],$scope.hourSelected.begin,
				$scope.hourSelected.end,function(data){
			$scope.reservation.makeSuccess=true;
			$scope.reservation.date=new Date($scope.reservation.date);
		},function(){
			$scope.reservation.makeSuccess=false;
			$scope.reservation.date=new Date($scope.reservation.date);
		});
	}
	$scope.cancelReservation=function(){
		$gloriaAPI.cancelReservation($scope.pendingSelected.reservationId,function(){
			$scope.reservation.cancelSuccess=true;
			$scope.getPendingReservations();
		},function(){
			$scope.reservation.cancelSuccess=false;
			$scope.getPendingReservations();
		});
	}
	$scope.startExperiment=function(){
		$('body').removeClass('modal-open');
		$('.modal-backdrop').remove();
		if($scope.pendingSelected.experiment=='SOLAR'){
			$location.url('/experiment/solar'+ '?rid=' + $scope.pendingSelected.reservationId);
		}
		else{
			$location.url('/experiment/night'+ '?rid=' + $scope.pendingSelected.reservationId);
		}
	}
	$scope.getPendingReservations=function(){
		$scope.reservation.loading=true;
		$scope.reservation.pendingSuccess=null;
		$gloriaAPI.getOnlinePendingReservations(function(data){
			$scope.reservation.pending=data;
			$scope.reservation.pendingSuccess=true;
			$scope.reservation.loading=false;
		},function(){
			$scope.reservation.pendingSuccess=false;
			$scope.reservation.loading=false;
		});
	}
	$scope.pendingSummaryOn=function(pending){
		$scope.reservation.makeSuccess=null;
		$scope.reservation.cancelSuccess=null;
		$scope.pendingSelected=pending;
		$scope.pendingSelected.mount='Cargando...';
		$scope.pendingSelected.dome='Cargando...';
		$scope.pendingSelected.weather='Cargando...';
		$gloriaAPI.getMountState($scope.pendingSelected.telescopes[0],function(data){
			if (data.state == 'UNDEFINED') {
				data.state = 'UNKNOWN';
			}
			$scope.pendingSelected.mount=data.state;
		},function(error){
			$scope.pendingSelected.mount='ERROR';
		});
		$gloriaAPI.getDomeState($scope.pendingSelected.telescopes[0],function(data){
			$scope.pendingSelected.dome=data.state;
		},function(error){
			$scope.pendingSelected.dome='ERROR';
		});
		$gloriaAPI.getWeatherState($scope.pendingSelected.telescopes[0],function(data){
			if(data.alarm){
				$scope.pendingSelected.weather='ALARM';
			}
			else {
				$scope.pendingSelected.weather='CLEAR';
			}
		},function(error){
			$scope.pendingSelected.weather='ERROR';
		});
	}
	$scope.$watch('pendingSelected',function(){
		if($scope.pendingSelected){
			$scope.pendingdate=new Date();
			if($scope.pendingdate>=$scope.pendingSelected.timeSlot.begin && $scope.pendingdate<$scope.pendingSelected.timeSlot.end){
				$scope.reservation.start=true;
				$scope.reservation.waiting=true;
				$scope.reservation.error=false;
				$scope.onReservation();
			}
			else{
				$scope.reservation.start=false;
			}
		}
	});
	$scope.onReservation = function() {
		$gloriaAPI.getReservationInformation($scope.pendingSelected.reservationId, function(data) {
			if (data.status == 'READY') {
				$scope.reservation.waiting=false;
				$scope.reservation.error=false;
			}
			else if (data.status == 'SCHEDULED') {
				$scope.reservation.waiting=true;
				$scope.reservation.error=false;
				$timeout($scope.onReservation, 1000);
			}
			else {
				$scope.reservation.waiting=false;
				$scope.reservation.error=true;
				$timeout($scope.onReservation, 5000);
			}
		}, function(error) {
			$scope.reservation.waiting=false;
			$scope.reservation.error=true;
		});
	};
	if($location.url()=='/reservations/new'){
		$scope.reservation.anewURL=true;
		$scope.reservation.pendingURL=false;
	}
	else if($location.url()=='/reservations/pending'){
		$scope.pendingReservation();
	}
});

toolbox.controller('SolarExperimentController',function($gloriaAPI,$scope,$location,$timeout,$sequenceFactory,$routeParams){
    $scope.$on('$routeChangeSuccess', function() {
	    $("#sidebar").panel();
	    $("#sidelistview").listview();
    });

	$scope.requestRid = $routeParams.rid;

	$scope.experiment = {};
	$scope.experiment.info = null;
	$scope.experiment.scamSelected=false;
	$scope.experiment.ccds0Selected=true;
	$scope.experiment.ccds1Selected=false;
	$scope.sequence = {};
	$scope.sequence.time = $sequenceFactory.getSequence();
	$scope.sequence.weather = $sequenceFactory.getSequence();
	$scope.sequence.mount = $sequenceFactory.getSequence();
	$scope.sequence.ccd = $sequenceFactory.getSequence();
	$scope.wind = {
		value : 0,
		high : false,
	};
	$scope.rh = {
		value : 0,
		high : false,
	};
	$scope.valuesLoaded = false;
	$scope.weather_status = {
		time : {}
	};

	$scope.scams = [ {}, {} ];
	$scope.dome_status = {
		time : {
			count : Math.floor(Math.random() * 100000)
		},
		dome : {
			closeEnabled : true,
			openEnabled : true,
			error : false
		}
	};

	$scope.mount_status = {
		time : {},
		context : null
	};

	$scope.ccds = [ {}, {} ];
	$scope.ccd_status = {
		time : {
			count : Math.floor(Math.random() * 100000)
		},
		finder : {
			focused : false
		},
		main : {
			focused : false,
			clock : {
				focused : false
			},
			focus : {
				focused : false
			},
			camera : {
				focused : false
			},
			exposure : {
				begin : null,
				end : null,
				length : 0,
				valueSet : true
			},
			focuser : {
				begin : null,
				end : null,
				length : 0,
				valueSet : true,
				exp_offset : 0
			}
		}
	};


	$scope.reservationEnd = false;
	$scope.notAuthorized = false;
	$scope.serverDown = false;
	$scope.infoUpdated = false;
	$scope.wrongReservation = false;
	$scope.reservationActive = false;
	$scope.reservationObsolete = false;
	$scope.arrowsEnabled = false;
	$scope.weatherLoaded = false;
	$scope.ccdImagesLoaded = false;
	$scope.elapsedTimeLoaded = false;
	$scope.targetSettingsLoaded = false;
	$scope.movementDirection = null;
	$scope.imageTaken = true;
	$scope.deviceOnError = false;
	$scope.weatherAlarm = false;
	$scope.sharedMode = false;
	$scope.limits = {
		east : false,
		west : false,
		north : false,
		south : false
	};
	$scope.images={};
	$scope.images.count=0;
	$scope.images.total=0;


	//SOLAR EXPERIMENT INFORMATION

	$scope.getReservationDetails=function(data){
		$scope.experiment.info=true;
		$scope.experiment.data=data;
		$('#alert').modal();
	}
	$scope.onReservation = function() {
		$gloriaAPI.getReservationInformation($scope.preRid, function(data) {
			if (data.status == 'READY') {
				$scope.rid = $scope.preRid;
				$scope.getReservationDetails(data);
			} else if (data.status == 'SCHEDULED') {
				$timeout($scope.onReservation, 1000);
			} else if (data.status == 'OBSOLETE') {
				$scope.rid = -1;
				$scope.experiment.reservationEnd = true;
			}
		}, function(error) {
			$scope.rid = -1;
			$scope.experiment.reservationEnd = true;
		});
	};
	if ($routeParams.rid != undefined) {
		$scope.preRid = parseInt($scope.requestRid);
		if (!isNaN($scope.preRid)) {
			$scope.onReservation();
		}
	} else if ($routeParams.dev != undefined) {
		$scope.experiment.reservationEnd = false;
	} else {
		$scope.rid = -1;
		$scope.preRid = '';
		$scope.experiment.reservationEnd = true;
	}
	$scope.$watch('rid', function(val) {
		if (val != null) {
			if (val > 0) {
				$scope.experiment.timer = $timeout($scope.experiment.onTimeout, 1000);
				CameraStyle();
				LoadDomeContent();
				$gloriaAPI.getParameterTreeValue($scope.rid, 'cameras', 'scam', function(data) {
					$scope.scams = data.images.slice(0, 2);
					$scope.dome_status.time.timer = $timeout($scope.dome_status.time.onTimeout, 1000);
				}, function(error) {
				});
				$scope.loadMyImages();
			}
			else {
				$timeout($scope.experiment.end,3000);
			}
		}
	});
	$scope.$watch('experiment.reservationEnd',function(val){
		if (val==true){
			$('#alert').modal();
			$scope.experiment.info = null;
			$('#alert').modal();
			$timeout($scope.experiment.end,2000);
		}
	});

	//CAMERAS CONTROL

	$scope.experiment.cameraSelected=function(cam){
		if (cam=='scam'){
			$scope.experiment.scamSelected=true;
			$scope.experiment.ccds0Selected=false;
			$scope.experiment.ccds1Selected=false;
		}
		else if (cam=='ccds1'){
			$scope.experiment.scamSelected=false;
			$scope.experiment.ccds0Selected=false;
			$scope.experiment.ccds1Selected=true;
		}
		else{
			$scope.experiment.scamSelected=false;
			$scope.experiment.ccds0Selected=true;
			$scope.experiment.ccds1Selected=false;
		}
	}

	//SOLAR EXPERIMENT TIME

	function LoadRemainingTime() {
		return $scope.sequence.time.execute(function() {
			return $gloriaAPI.getRemainingTime($scope.rid, function(data) {
				$scope.experiment.remaining = data;
			});
		}).then(function() {
		}, function(response) {
			if (response.status == 401) {
				$scope.notAuthorized = true;
			} else {
				$scope.experiment.reservationEnd = true;
			}
		});
	}
	function LoadElapsedTime() {
		return $scope.sequence.time.execute(function() {
			return $gloriaAPI.getElapsedTime($scope.rid, function(data) {
				$scope.experiment.elapsed = data;
				$scope.elapsedTimeLoaded = true;
			});
		}).then(function() {
		}, function(response) {
			if (response.status == 401) {
				$scope.notAuthorized = true;
			} else {
				$scope.experiment.reservationEnd = true;
			}
		});
	}

	$scope.experiment.onTimeout = function() {
		LoadRemainingTime();
		LoadElapsedTime().then(function() {
			$scope.experiment.timer = $timeout($scope.experiment.onTimeout, 1000);
		}, function() {
			$timeout.cancel($scope.experiment.timer);
		});
		$scope.experiment.totaltime = $scope.experiment.remaining + $scope.experiment.elapsed;
		$scope.experiment.remainingtime = $scope.experiment.remaining * 100 / $scope.experiment.totaltime;
	};
	$scope.experiment.end=function(){
		$('body').removeClass('modal-open');
		$('.modal-backdrop').remove();
		$location.url('/reservations/pending');
	}

	//SOLAR WEATHER

	function LoadWeatherValues() {
		return $scope.sequence.weather.execute(function() {
			return $gloriaAPI.executeOperation($scope.rid, 'load_weather_values', function(data) {
			}, function(error) {
			});
		});
	}
	function LoadWeatherContent() {
		$scope.weatherLoaded = true;
		$scope.valuesLoaded = true;
		$scope.wind.value = '--';
		$scope.rh.value = '--';
		return $scope.sequence.weather.execute(function() {
			return $gloriaAPI.getParameterValue($scope.rid, 'weather', function(data) {
				$scope.wind.value = data.wind.value;
				$scope.wind.high = data.wind.alarm;

				$scope.rh.value = data.rh.value;
				$scope.rh.high = data.rh.alarm;

			},function(error){
			});
		});
		$scope.weather_status.time.timer = $timeout(LoadWeatherContent,5000);
	}

	$scope.$watch('elapsedTimeLoaded', function() {
		if ($scope.rid > 0) {
			$scope.weather_status.time.timer = $timeout($scope.weather_status.time.onTimeout, 1000, 1000);
		}
	});

	$scope.weather_status.time.onTimeout = function() {
		if (!$scope.sharedMode) {
			LoadWeatherValues();
		}
		LoadWeatherContent().then(function() {
			$scope.weather_status.time.timer = $timeout($scope.weather_status.time.onTimeout, 10000, 0);
		}, function() {
			$timeout.cancel($scope.weather_status.time.timer);
		});
	}


	//SOLAR SCAMS

	function LoadDomeContent() {
		return $gloriaAPI.executeOperation($scope.rid, 'load_dome_status', function(data) {
		}, function(error) {
		}).then(function() {
			return $gloriaAPI.getParameterValue($scope.rid, 'dome', function(data) {
				if (data.last_operation != undefined) {
					$scope.dome_status.dome.lastOperation = data.last_operation;
					if (data.last_operation == 'open') {
						$scope.dome_status.dome.closeEnabled = true;
						$scope.dome_status.dome.openEnabled = false;
					} else {
						$scope.dome_status.dome.closeEnabled = false;
						$scope.dome_status.dome.openEnabled = true;
					}
				}

				if (data.status == undefined || data.status == 'UNDEFINED') {
					$scope.dome_status.dome.error = true;
				}
			});
		});
	}
	function OpenDome() {
		$scope.dome_status.dome.lastOperation = 'open';
		return $gloriaAPI.setParameterTreeValue($scope.rid, 'dome','last_operation', 'open',function() {
			return $gloriaAPI.executeOperation($scope.rid, 'open', function(data) {
				$scope.dome_status.dome.timer = $timeout($scope.dome_status.dome.timeout, 60000);
			}, function(error) {
				$scope.dome_status.dome.error = true;
				$scope.dome_status.dome.openEnabled = true;
				$scope.dome_status.dome.closeEnabled = true;
				$scope.dome_loading_open=false;
			});
		}, function() {
			$scope.dome_status.dome.error = true;
			$scope.dome_status.dome.openEnabled = true;
			$scope.dome_status.dome.closeEnabled = true;
			$scope.dome_loading_open=false;
		});
	}
	function CloseDome() {
		$scope.dome_status.dome.lastOperation = 'close';
		return $gloriaAPI.setParameterTreeValue($scope.rid, 'dome','last_operation', 'close',function() {
			return $gloriaAPI.executeOperation($scope.rid, 'close',function(data) {
				$scope.dome_status.dome.timer = $timeout($scope.dome_status.dome.timeout, 60000);
			}, function(error) {
				$scope.dome_status.dome.error = true;
				$scope.dome_status.dome.closeEnabled = true;
				$scope.dome_status.dome.openEnabled = true;
				$scope.dome_loading_close=false;
			});
		}, function() {
			$scope.dome_status.dome.error = true;
			$scope.dome_status.dome.closeEnabled = true;
			$scope.dome_status.dome.openEnabled = true;
			$scope.dome_loading_close=false;
		});
	}

	$scope.openDome = function() {
		$scope.dome_status.dome.openEnabled = false;
		$scope.dome_loading_open=true;
		$scope.dome_status.dome.lastOperation = 'open';
		OpenDome();
	};
	$scope.dome_status.dome.timeout = function() {
		$scope.dome_status.dome.closeEnabled = true;
		$scope.dome_status.dome.openEnabled = true;
		if ($scope.dome_status.dome.lastOperation == 'open') {
			$scope.dome_loading_close=false;
		} else {
			$scope.dome_loading_open=false;
		}
	};
	$scope.closeDome = function() {
		$scope.dome_status.dome.closeEnabled = false;
		$scope.dome_loading_close=true;
		$scope.dome_status.dome.lastOperation = 'close';
		CloseDome();
	};
	$scope.dome_status.time.onTimeout = function() {
		$scope.dome_status.time.count += 1;
		var i = 0;
		$scope.scams.forEach(function(index) {
			$scope.scams[i].purl = $scope.scams[i].url + '?d=' + $scope.dome_status.time.count;
			i++;
		});
		$scope.dome_status.time.timer = $timeout($scope.dome_status.time.onTimeout, 5000,1000);
	};

	$scope.$on('$destroy', function() {
		$timeout.cancel($scope.weather_status.time.timer);
		$timeout.cancel($scope.dome_status.time.timer);
		$timeout.cancel($scope.dome_status.dome.timer);
		$timeout.cancel($scope.weather_status.time.timer);
		$timeout.cancel($scope.experiment.timer);
	});


	//SOLAR MOUNT

	function SetSavedStatus(mount_status) {
		return $gloriaAPI.setParameterTreeValue($scope.rid, 'mount', 'saved_status', mount_status, function(data) {
			$scope.mount_status.context = mount_status;
		});
	}

	function LoadMountStatus() {
		return $gloriaAPI.executeOperation($scope.rid, 'load_mount_status', function(data) {
		}, function(error) {
				$scope.deviceOnError = true;
		});
	}

	function GetMountStatus() {
		return $gloriaAPI.getParameterTreeValue($scope.rid, 'mount', 'status', function(data) {
			$scope.mount_status.actual = data;
		}, function(error) {
		});
	}

	function GetSavedStatus() {
		return $gloriaAPI.getParameterTreeValue($scope.rid, 'mount', 'saved_status', function(data) {
			if (data == null || data == "") {
				if ($scope.sharedMode) {
					$scope.deviceOnError = true;
				} else {
					SetSavedStatus('TARGET_SET');
					$scope.mount_status.context = 'TARGET_SET';
				}
			} else {
				$scope.mount_status.context = data;
			}
		}, function(error) {
			$scope.mount_status.context = 'TARGET_SET';
			SetSavedStatus('TARGET_SET');
		});
	}

	function GetMountPositionConstraints() {
		return $gloriaAPI.getParameterTreeValue($scope.rid,'mount','constraints', function(data) {
			$scope.mount_status.constraints = data;
			$scope.limits.east = $scope.mount_status.constraints.x.current == $scope.mount_status.constraints.x.max;
			$scope.limits.west = $scope.mount_status.constraints.x.current == -$scope.mount_status.constraints.x.max;
			$scope.limits.north = $scope.mount_status.constraints.y.current == $scope.mount_status.constraints.y.max;
			$scope.limits.south = $scope.mount_status.constraints.y.current == -$scope.mount_status.constraints.y.max;
		}, function(error) {
		});
	}

	function PointToTarget() {
		$scope.pointDone = false;
		$scope.pointingEnabled = false;
		$scope.inAction = true;
		$scope.arrowsEnabled = false;
		var time = 5000;
		if ($scope.mount_status.actual == 'PARKED') {
			time = 10000;
		}

		return $gloriaAPI.executeOperation($scope.rid, 'point_to_object', function(data) {
			$scope.inAction = false;
			$scope.pointDone = true;
			SetSavedStatus('POINTED');
			$scope.mount_status.time.pointingTimer = $timeout($scope.mount_status.time.reenablePointing, time);
		}, function(error) {
			$scope.inAction = false;
			$scope.pointDone = true;
			$scope.mount_status.time.pointingTimer = $timeout($scope.mount_status.time.reenablePointing, time);
		});
	}

	function MoveMount(direction) {

		var operation = '';

		$scope.inAction = true;
		$scope.arrowsEnabled = false;

		if (direction == 'WEST') {
			operation = 'move_west';
			$scope.limits.east = false;
		} else if (direction == 'EAST') {
			operation = 'move_east';
			$scope.limits.west = false;
		} else if (direction == 'NORTH') {
			operation = 'move_north';
			$scope.limits.south = false;
		} else if (direction == 'SOUTH') {
			operation = 'move_south';
			$scope.limits.north = false;
		}

		return $gloriaAPI.executeOperation($scope.rid, operation, function(data) {
			GetMountPositionConstraints().then(function() {
				$scope.mount_status.time.messageTimer = $timeout($scope.mount_status.time.refreshMessages, 3000);
			});
		}, function(error) {
			$scope.mount_status.time.messageTimer = $timeout($scope.mount_status.time.refreshMessages, 3000);
		});
	}

	$scope.targetReady = true;
	$scope.pointDone = true;
	$scope.pointingEnabled = false;

	$scope.$watch('movementRequested', function() {
		if ($scope.movementRequested && $scope.movementDirection != null && $scope.movementDirection != undefined) {
				MoveMount($scope.movementDirection);
		}
	});

	$scope.$watch('ccdImagesLoaded', function() {
		if ($scope.rid > 0) {
			$scope.sequence.mount.execute(function() {
				return LoadMountStatus();
			});
			$scope.sequence.mount.execute(function() {
				return GetMountStatus();
			});
			$scope.sequence.mount.execute(function() {
				return GetMountPositionConstraints();
			});
			$scope.sequence.mount.execute(function() {
				return GetSavedStatus();
			}).then(function() {

				if ($scope.mount_status.actual != 'PARKED') {
					$scope.arrowsEnabled = true;
				}

				if ($scope.mount_status.context == 'TARGET_SET') {
					$scope.targetReady = true;
					$scope.pointingEnabled = true;
					$scope.targetSettingsLoaded = true;
				} else if ($scope.mount_status.context == 'POINTED') {
					$scope.targetReady = true;
					$scope.pointDone = true;
					$scope.pointingEnabled = true;
					$scope.targetSettingsLoaded = true;
				}

				if ($scope.sharedMode) {
					$scope.pointingEnabled = false;
					$scope.arrowsEnabled = false;
					$scope.inAction = true;
				}
			});
		}
	});

	$scope.pointToTarget = function() {
		if ($scope.pointingEnabled && $scope.targetReady) {
			PointToTarget();
		}
	};

	$scope.mount_status.time.refreshMessages = function() {
		$scope.inAction = false;
		$scope.arrowsEnabled = true;
		$scope.movementRequested = false;
	};

	$scope.mount_status.time.reenablePointing = function() {
		$scope.sequence.mount.execute(function() {
			return LoadMountStatus();
		});
		$scope.sequence.mount.execute(function() {
			return GetMountStatus();
		}).then( function() {
			if ($scope.mount_status.actual == 'TRACKING' || $scope.mount_status.actual == 'STOP') {
				$scope.pointingEnabled = true;
				$scope.arrowsEnabled = true;
			} else {
				$scope.mount_status.time.pointingTimer = $timeout($scope.mount_status.time.reenablePointing, 5000);
			}
		}, function() {
			$scope.pointingEnabled = true;
			$scope.arrowsEnabled = false;
		});

	};

	$scope.$on('$destroy', function() {
		$timeout.cancel($scope.mount_status.time.messageTimer);
		$timeout.cancel($scope.mount_status.time.pointingTimer);
	});


	//SOLAR CCDS

	$scope.loading = false;

	function LoadCCDContent() {
		return $scope.sequence.ccd.execute(function() {
			return $gloriaAPI.getParameterTreeValue($scope.rid, 'cameras', 'ccd', function(data) {
				$scope.ccds = data.images.slice(0, 2);
			});
		});
	}

	function LoadFocuserContent() {
		return $scope.sequence.ccd.execute(function() {
			return $gloriaAPI.getParameterValue($scope.rid, 'focuser', function(data) {
				$scope.focuser = data;
				if ($scope.focuser.last_offset == undefined) {
					$scope.focuser.last_offset = 1000;
				}
				$scope.focuser.offset = $scope.focuser.last_offset;
				$scope.focuserChange($scope.focuser.offset);
			});
		});
	}

	function LoadContinuousImage(order) {

		$scope.sequence.ccd.execute(function() {
			return $gloriaAPI.setParameterTreeValue($scope.rid, 'cameras','ccd.order', order, function() {
				$scope.ccdSelected = order;
			});
		});

		$scope.sequence.ccd.execute(function() {
			return $gloriaAPI.executeOperation($scope.rid, 'stop_continuous_image',function() {
				$scope.continuousMode = false;
			}, function(error) {
			});
		});

		return $scope.sequence.ccd.execute(function() {
			return $gloriaAPI.executeOperation($scope.rid, 'load_continuous_image',function() {
				$scope.continuousMode = true;
			}, function(error) {
			});
		});
	}

	function SetFocuserPosition() {
		$scope.ccd_status.main.focuser.valueSet = false;

		$scope.sequence.ccd.execute(function() {
			return $gloriaAPI.setParameterTreeValue($scope.rid, 'focuser', 'steps', $scope.focuser.exp_offset, function(data) {
			});
		});

		$scope.sequence.ccd.execute(function() {
			return $gloriaAPI.setParameterTreeValue($scope.rid,'focuser','last_offset', $scope.focuser.offset, function(data) {
				$scope.focuser.last_offset = $scope.focuser.offset;
			});
		});

		return $scope.sequence.ccd.execute(function() {
			return $gloriaAPI.executeOperation($scope.rid, 'move_focus', function(data) {
				$scope.ccd_status.main.focuser.valueSet = true;
			}, function() {
			});
		});
	}

	function SetExposureTime() {

		$scope.ccd_status.main.exposure.valueSet = false;

		if ($scope.ccdSelected != 0) {
			$scope.sequence.ccd.execute(function() {
				return $gloriaAPI.setParameterTreeValue($scope.rid, 'cameras','ccd.order', 0, function() {
					$scope.ccdSelected = 0;
				});
			});
		}

		$scope.sequence.ccd.execute(function() {
			return $gloriaAPI.setParameterTreeValue($scope.rid, 'cameras','ccd.images.[0].exposure',
					$scope.ccds[0].exposure, function(data) {
			});
		});

		return $scope.sequence.ccd.execute(function() {
			return $gloriaAPI.executeOperation($scope.rid, 'set_exposure', function(data) {
				$scope.ccd_status.main.exposure.valueSet = true;
			});
		});
	}

	function LoadCCDAttributes(order) {

		$scope.sequence.ccd.execute(function() {
			return $gloriaAPI.setParameterTreeValue($scope.rid, 'cameras','ccd.order', order, function() {
				$scope.ccdSelected = order;
			});
		});

		return $scope.sequence.ccd.execute(function() {
			return $gloriaAPI.executeOperation($scope.rid, 'get_ccd_attributes',function() {
			}, function(error) {
			});
		});
	}

	function CheckExposure() {
		$scope.ccd_status.main.exposure.timer = $timeout($scope.ccd_status.main.exposure.check, 1000);
	}

	function StartExposure() {

		$scope.imageTaken = false;
		$scope.sequence.ccd.execute(function() {
			return $gloriaAPI.setParameterTreeValue($scope.rid, 'cameras','ccd.order', 0, function() {
				$scope.ccdSelected = 0;
			});
		});

		return $scope.sequence.ccd.execute(function() {
			return $gloriaAPI.executeOperation($scope.rid, 'start_exposure',function(data) {
				CheckExposure();
			});
		});
	}

	$scope.moveFinder = function(direction) {
		$scope.movementDirection = direction;
		$scope.movementRequested = true;
	};

	$scope.ccd_status.main.exposure.check = function() {
		$scope.sequence.ccd.execute(function() {
			return $gloriaAPI.getParameterTreeValue($scope.rid, 'cameras','ccd.images.[0].inst', function(data) {
				if (data.id >= 0) {
					if (data.jpg != undefined && data.jpg != null) {
						$scope.imageTaken = true;
					} else {
						$scope.sequence.ccd.execute(function() {
							return $gloriaAPI.executeOperation($scope.rid, 'load_image_urls',function() {
								CheckExposure();
							});
						});
					}
				} else {
					$scope.imageTaken = true;
				}
			});
		});
	};

	function CameraStyle(){
		if (parseInt($('#exposureBar').css('height'))>0) {
			$scope.exposureBarStyle=parseInt($('#exposureBar').css('height'));
		}
		if (parseInt($('#focuserBar').css('height'))>0) {
			$scope.focuserBarStyle=parseInt($('#focuserBar').css('height'));
		}
		if (parseInt($('#carousel').css('height'))>0) {
			$scope.carouselHeight=parseInt($('#carousel').css('height'));
		}
		if (parseInt($('#carousel').css('width'))>0) {
			$scope.carouselWidth=parseInt($('#carousel').css('width'));
			$scope.focuserBarPosition=$scope.carouselWidth/6;
		}
	}

	$scope.exposureChange=function(data){
		$scope.ccds[0].exposure = parseFloat(data);
		$scope.exposuretop=$scope.carouselHeight*86/100-(data*($scope.exposureBarStyle-40)/0.05)-18;
	}
	$scope.focuserChange=function(data){
		$scope.focuser.offset=parseInt(data);
		$scope.focuser.exp_offset = Math.floor($scope.focuser.offset - $scope.focuser.last_offset);
		$scope.focusertop=$scope.carouselHeight*86/100-($scope.focuser.offset*($scope.focuserBarStyle-30)/2000)-12;
	}

	$scope.setExposureTimeValue = function(sign) {
		$scope.ccds[0].exposure = parseFloat($scope.ccds[0].exposure + 0.001 * sign);

		if ($scope.ccds[0].exposure < 0) {
			$scope.ccds[0].exposure = 0;
		} else if ($scope.ccds[0].exposure > 0.05) {
			$scope.ccds[0].exposure = 0.05;
		}
		$scope.exposureChange($scope.ccds[0].exposure);
	};

	$scope.setFocuserPositionValue = function(sign) {
		$scope.focuser.offset += sign;

		if ($scope.focuser.offset < 0) {
			$scope.focuser.offset = 0;
		} else if ($scope.focuser.offset > 2000) {
			$scope.focuser.offset = 2000;
		}

		$scope.focuserChange($scope.focuser.offset);
	};

	$scope.setExposureTime = function() {
		if (!$scope.sharedMode) {
			SetExposureTime();
		}
	};

	$scope.setFocuserPosition = function() {
		if (!$scope.sharedMode) {
			SetFocuserPosition();
		}
	};

	$scope.startExposure = function() {
		if (!$scope.sharedMode) {
			StartExposure();
		}
	};

	$scope.initCCDSystem = function() {
		var upToDate = true;

		if (!$scope.sharedMode) {
			for (var i = 0; i < $scope.ccds.length; i++) {
				if ($scope.ccds[i].cont == undefined || $scope.ccds[i].cont == null) {
					LoadContinuousImage(i);
					upToDate = false;
				}
			}
		}

		if ($scope.ccds[0].exposure < 0) {
			$scope.ccds[0].exposure = 0;
		}
		$scope.exposureChange($scope.ccds[0].exposure);

		if (!upToDate) {
			LoadCCDContent().then(function() {
				$scope.ccdImagesLoaded = true;
			});
		} else {
			$scope.ccdImagesLoaded = true;
		}
	};

	$scope.$watch('weatherLoaded', function() {
		if ($scope.rid > 0) {

			if (!$scope.sharedMode) {
				LoadCCDAttributes(0);
			} else {
				$scope.loadContentTimer = $timeout($scope.loadSharedContent,5000);
			}
			LoadFocuserContent();
			LoadCCDContent().then(function() {
				$scope.initCCDSystem();
				$scope.ccd_status.time.timer = $timeout($scope.ccd_status.time.onTimeout, 1000, 1000);
				$scope.focuserChange($scope.focuser.offset);
			});
		}
	});

	$scope.loadSharedContent = function() {
		LoadFocuserContent().then(function() {
			$scope.focuserChange($scope.focuser.offset);
		});
		$gloriaAPI.getParameterTreeValue($scope.rid,'cameras','ccd', function(data) {
			var ccds = data.images.slice(0, 2);
			$scope.ccds[0].exposure = ccds[0].exposure;

			$scope.exposureChange($scope.ccds[0].exposure);
		});

		$scope.loadContentTimer = $timeout($scope.loadSharedContent, 5000);
	};

	$scope.ccd_status.time.onTimeout = function() {
		$scope.ccd_status.time.count += 1;
		var i = 0;
		if (!$scope.loading) {
			$scope.ccds.forEach(function(index) {
				if ($scope.ccds[i].cont != null && $scope.ccds[i].cont != undefined) {
					$scope.ccds[i].pcont = $scope.ccds[i].cont + '?v=' + $scope.ccd_status.time.count;
				}

				i++;
			});
		}
		$scope.ccd_status.time.timer = $timeout($scope.ccd_status.time.onTimeout, 1000,1000);
	};

	$scope.$on('$destroy', function() {
		$timeout.cancel($scope.ccd_status.time.timer);
		$timeout.cancel($scope.ccd_status.main.exposure.timer);
		$timeout.cancel($scope.loadContentTimer);
	});


	//SOLAR IMAGES

	$scope.loadMyImages=function(){
		$scope.images.total=0;
		$scope.images.count=0;
	    $('#experiment_images').hide();
		$('#notfound_image').hide();
	    $('#loading_image').show();
    	return $gloriaAPI.getImagesByContext($scope.rid,function(data){
    		$scope.imagenes=data;
    		while(1){
    			if(data[$scope.images.total]==undefined){
    				break;
    			}
    			$scope.images.total++;
    		}
    		if($scope.images.total==0){
    			$('#notfound_image').show();
    		}
    		else {
        	    $('#experiment_images').show();
    		}
    	    $('#loading_image').hide();
    	});
	}
    $scope.images.counter=function(operation){
    	if(operation==true){
    		if($scope.images.count<$scope.images.total-1){
        		$scope.images.count++;
    		}
    	}
    	else if(operation==false){
    		if($scope.images.count>0){
    			$scope.images.count--;
    		}
    	}
    }

	$scope.$watch('imageTaken', function(){
    	if($scope.rid && $scope.imageTaken){
    		$scope.loadMyImages();
	    }
    });

});

toolbox.controller('NightExperimentController',function($gloriaAPI,$scope,$location,$timeout,$sequenceFactory,$routeParams){
    $scope.$on('$routeChangeSuccess', function() {
	    $("#sidebar").panel();
	    $("#sidelistview").listview();
    });

	$scope.requestRid = $routeParams.rid;

	$scope.experiment = {};
	$scope.experiment.info = null;
	$scope.sequence = {};
	$scope.sequence.time = $sequenceFactory.getSequence();
	$scope.sequence.mount = $sequenceFactory.getSequence();
	$scope.sequence.ccd = $sequenceFactory.getSequence();
	$scope.elapsedTimeLoaded = false;
	$scope.imageTaken = true;

	$scope.wind = {
		value : 0,
		high : false,
	};
	$scope.rh = {
		value : 0,
		high : false,
	};
	$scope.temperature = {
		value : 0,
		high : false,
	};
	$scope.valuesLoaded = false;
	$scope.weather_status = {
			time : {}
		};
	$scope.weatherLoaded = false;
	$scope.weatherAlarm = false;
	$scope.dome_status = {
		time : {
			count : Math.floor(Math.random() * 100000)
		},
		dome : {
			closeEnabled : true,
			openEnabled : true,
			error : false
		}
	};

	$scope.mount_status = {
		time : {},
		context : null
	};
	$scope.weather_status = {
		time : {}
	};

	$scope.scams = [ {}, {} ];
	$scope.dome_status = {
		value : null,
		dome : {}
	};

	$scope.mount_status = {};
	$scope.images={};
	$scope.images.count=0;
	$scope.images.total=0;

	//NIGHT EXPERIMENT INFORMATION

	$scope.getReservationDetails=function(data){
		$scope.experiment.info=true;
		$scope.experiment.data=data;
		$('#alert').modal();
	}
	$scope.onReservation = function() {
		$gloriaAPI.getReservationInformation($scope.preRid, function(data) {
			if (data.status == 'READY') {
				$scope.rid = $scope.preRid;
				$scope.getReservationDetails(data);
			} else if (data.status == 'SCHEDULED') {
				$timeout($scope.onReservation, 1000);
			} else if (data.status == 'OBSOLETE') {
				$scope.rid = -1;
				$scope.experiment.reservationEnd = true;
			}
		}, function(error) {
			$scope.rid = -1;
			$scope.experiment.reservationEnd = true;
		});
	};
	if ($routeParams.rid != undefined) {
		$scope.preRid = parseInt($scope.requestRid);
		if (!isNaN($scope.preRid)) {
			$scope.onReservation();
		}
	} else if ($routeParams.dev != undefined) {
		$scope.experiment.reservationEnd = false;
	} else {
		$scope.rid = -1;
		$scope.preRid = '';
		$scope.experiment.reservationEnd = true;
	}
	$scope.$watch('rid', function(val) {
		if (val != null) {
			if (val > 0) {
				$scope.experiment.timer = $timeout($scope.experiment.onTimeout, 1000);
				LoadDomeContent();
				LoadMountParameters();
				InitCCDSystem();
				CamerasCtrl();
				CameraStyle();
				$scope.loadMyImages();
			}
			else {
				$timeout($scope.experiment.end,3000);
			}
		}
	});
	$scope.$watch('experiment.reservationEnd',function(val){
		if (val==true){
			$('body').removeClass('modal-open');
			$('.modal-backdrop').remove();
			$scope.experiment.info = null;
			$('#alert').modal();
			$timeout($scope.experiment.end,2000);
		}
	});

	//NIGHT EXPERIMENT TIME

	function LoadRemainingTime() {
		return $scope.sequence.time.execute(function() {
			return $gloriaAPI.getRemainingTime($scope.rid, function(data) {
				$scope.experiment.remaining = data;
			});
		}).then(function() {
		}, function(response) {
			if (response.status == 401) {
				$scope.notAuthorized = true;
			} else {
				$scope.experiment.reservationEnd = true;
			}
		});
	}
	function LoadElapsedTime() {
		return $scope.sequence.time.execute(function() {
			return $gloriaAPI.getElapsedTime($scope.rid, function(data) {
				$scope.experiment.elapsed = data;
				$scope.elapsedTimeLoaded = true;
			});
		}).then(function() {
		}, function(response) {
			if (response.status == 401) {
				$scope.notAuthorized = true;
			} else {
				$scope.experiment.reservationEnd = true;
			}
		});
	}

	$scope.experiment.onTimeout = function() {
		LoadRemainingTime();
		LoadElapsedTime().then(function() {
			$scope.experiment.timer = $timeout($scope.experiment.onTimeout, 1000);
		}, function() {
			$timeout.cancel($scope.experiment.timer);
		});
		$scope.experiment.totaltime = $scope.experiment.remaining + $scope.experiment.elapsed;
		$scope.experiment.remainingtime = $scope.experiment.remaining * 100 / $scope.experiment.totaltime;
	};
	$scope.experiment.end=function(){
		$('body').removeClass('modal-open');
		$('.modal-backdrop').remove();
		$location.url('/reservations/pending');
	}

	//NIGHT WEATHER

	function LoadWeatherConditions() {
		$scope.weatherLoaded = true;
		$scope.valuesLoaded = true;
		$scope.wind.value = '--';
		$scope.rh.value = '--';
		$scope.temperature.value = '--';
		$gloriaAPI.executeOperation($scope.rid, 'load_weather_values', function(data) {
			$gloriaAPI.getParameterValue($scope.rid, 'weather', function(data) {
				$scope.wind.value = data.wind.value;
				$scope.wind.high = data.wind.alarm;

				$scope.rh.value = data.rh.value;
				$scope.rh.high = data.rh.alarm;

				$scope.temperature.value = data.temperature.value;
				$scope.temperature.high = data.temperature.alarm;

				if ($scope.wind.high == true || $scope.rh.high == true || $scope.temperature.high == true){
					$scope.weather_alarm = true;
				}
				else if ($scope.wind.high == false && $scope.rh.high == false && $scope.temperature.high == false){
					$scope.weather_alarm = false;
				}

			}, function(error) {
			});
		}, function(error) {
			if (error.status = 500){
				$timeout.cancel($scope.weather_status.time.timer);
			}
		});
	}

	$scope.$watch('elapsedTimeLoaded', function() {
		if ($scope.rid > 0) {
			$scope.weather_status.time.timer = $timeout(function(){LoadWeatherConditions();}, 10000);
		}
	});

	$scope.$on('$destroy', function() {
		$timeout.cancel($scope.weather_status.time.timer);
		$timeout.cancel($scope.experiment.timer);
	});

	//NIGHT SCAMS

	function LoadDomeContent() {
		$gloriaAPI.executeOperation($scope.rid, 'load_dome_status', function(data) {
			$gloriaAPI.getParameterValue($scope.rid, 'dome', function(data) {
				$scope.dome_status.value = data.status;
				if (data.status == "CLOSED"){
					//$("#DomeModal").modal();
				}
				$scope.dome_status.dome.timer = $timeout(function(){LoadDomeContent();}, 10000);
			}, function(error){
				$scope.dome_status.dome.timer = $timeout(function(){LoadDomeContent();}, 10000);
			});
		}, function(error) {
			if (error.status == 500) {
				$timeout.cancel($scope.dome_status.dome.timer);
			}
			else {
				$scope.dome_status.dome.timer = $timeout(function(){LoadDomeContent();}, 10000);
			}
		});
	}

	$scope.$on('$destroy', function() {
		$timeout.cancel($scope.dome_status.dome.timer);
	});

	//NIGHT MOUNT

	$scope.hasMove = true;
	$scope.hasTargetPoint = true;
	$scope.rah = "--";
	$scope.ram = "--";
	$scope.ras = "--";

	$scope.decg = "--";
	$scope.decm = "--";
	$scope.decs = "--";

	$scope.ra_limits=[[0,0,0],[23,59,59.9]];
	$scope.dec_limits=[[-90,0,0],[90,59,59]];

	var latitude_array = {
			'BART' : 49.909049,
			'TADn' : 28.298566,
			'BOOTES-1A' : 37.10402,
			'BOOTES-2' : 36.7592,
			'D50' : 49.909372
	}
	var longitude_array = {
			'BART' : 14.781911,
			'TADn' : -16.509490,
			'BOOTES-1A' : -6.73406,
			'BOOTES-2' : -4.0410,
			'D50' : 14.781363
	}
	var magnitude_array = {
			'BART' : 10,
			'TADn' : 10,
			'BOOTES-1A' : 10,
			'BOOTES-2' : 10,
			'D50' : 10
	}
	function LoadMountParameters(){
		$scope.mountTimer = $timeout ($scope.mountMovementTimer, 3000);
		return $gloriaAPI.getParameterTreeValue($scope.rid,'rt','name',function(success){
			if (latitude_array[success] < 0){
				$scope.latitude = -1 * latitude_array[success];
				$scope.latitudeSign = 'South';
			} else {
				$scope.latitude = latitude_array[success];
				$scope.latitudeSign = 'North';
			}
			if (longitude_array[success] < 0){
				$scope.longitude = -1 * longitude_array[success];
				$scope.longitudeSign = 'West';
			} else {
				$scope.longitude = longitude_array[success];
				$scope.longitudeSign = 'East';
			}
			$scope.magnitude = magnitude_array[success];
		}, function(error){

		});
	}

	$scope.mountMovementTimer = function(){
		console.log("Request movement:"+$scope.rid);
		$gloriaAPI.executeOperation($scope.rid,'load_mount_status',function(success){
			$gloriaAPI.getParameterTreeValue($scope.rid,'mount','status',function(success){
				console.log("Read mount status:"+success);
				if (success == "PARKED"){
					$scope.status_mount = "night.mount.status.parked";
				} else if (success == "TRACKING"){
					$scope.status_mount = "night.mount.status.tracking";
				} else if (success == "STOP"){
					$scope.status_mount = "night.mount.status.stop";
				} else if (success == "MOVING"){
					$scope.status_mount = "night.mount.status.moving";
				}

			}, function(error){
				$scope.mount_alarm_message = "night.mount.messages.alarm_status";
				$scope.mount_status = "night.mount.status.error";
			});
		}, function(error){
			$scope.mount_alarm_message = "night.mount.messages.alarm_status";
			$scope.mount_status = "night.mount.status.error";
		});
		$scope.mountTimer = $timeout ($scope.mountMovementTimer, 5000);
	};

	$scope.move_north = function(){
		$scope.hasMove = false;
		$gloriaAPI.executeOperation($scope.rid,'move_north',function(success){
			$scope.hasMove = true;
		}, function(dataError, statusError){
			$scope.hasMove = true;
		});
	};

	$scope.move_south = function(){
		$scope.hasMove = false;
		$gloriaAPI.executeOperation($scope.rid,'move_south',function(success){
			$scope.hasMove = true;
		}, function(dataError, statusError){
			$scope.hasMove = true;
		});
	};

	$scope.move_east = function(){
		$scope.hasMove = false;
		$gloriaAPI.executeOperation($scope.rid,'move_east',function(success){
			$scope.hasMove = true;
		}, function(dataError, statusError){
			$scope.hasMove = true;
		});
	};

	$scope.move_west = function(){
		$scope.hasMove = false;
		$gloriaAPI.executeOperation($scope.rid,'move_west',function(success){
			$scope.hasMove = true;
		}, function(dataError, statusError){
			$scope.hasMove = true;
		});
	};

	$scope.showInformation = function(){

		 console.log("Tutorial");
	};

	$scope.go = function(){
		if ($scope.target_selected == "" || $scope.target_selected == null){
			SetCoordinates();
			if ($scope.rah != "--" && $scope.ram != "--" && $scope.ras != "--"){
				if ($scope.decg != "--" && $scope.decm != "--" && $scope.decs != "--"){
					$scope.sequence.mount = $sequenceFactory.getSequence();
					$scope.hasTargetPoint = false;
					$scope.mount_alarm = false;
					console.log("Move to coordinates:");
						//Set radec
						SetRADEC();
						//Execute go operation
						GoRADEC();
						//TODO in GoRADEC function
						$("#exposure_slider").slider({max:10,step:0.001});

					}
			}
		} else {
			$scope.hasTargetPoint = false;
			$scope.mount_alarm = false;
			$scope.target_name = $scope.target_selected;
			console.log("Move to target:"+$scope.target_name);
			$scope.sequence.mount = $sequenceFactory.getSequence();
			//Set target name
			SetTargetName();
			//Execute go operation
			GoTargetName();
			//TODO in GoTargetName function
			SetExposureTarget();

		}

	};

	$scope.open_catalog = function(){
		if (($scope.dec!=undefined) && ($scope.dec.length>0)){
			console.log("longitud:"+$scope.dec.length);
		}
		$("#CatalogModal").modal();
	};

	$scope.open_coordinates = function(){
		$("#CoordinatesModal").modal();
	};

	$scope.hasCoordinates = function(){
		var hasRaCoordinate = (($scope.rah != undefined) && ($scope.rah.length > 0)) || (($scope.ram != undefined) && ($scope.ram.length > 0)) || (($scope.ras != undefined) && ($scope.ras.length > 0));
		var hasDecCoordinate = (($scope.decg != undefined) && ($scope.decg.length > 0)) || (($scope.decm != undefined) && ($scope.decm.length > 0)) || (($scope.decs != undefined) && ($scope.decs.length > 0));
		return (hasRaCoordinate || hasDecCoordinate);
	};

	$scope.Range = function(start, end) {
	    var result = [];
	    for (var i = start; i <= end; i++) {
	        result.push(i);
	    }
	    return result;
	};
	$scope.coordinateChange=function(val,min,max){
		if(val<min){
			val=min;
		}
		else if(val>max){
			val=max;
		}
		return val;
	}
	function SetCoordinates(){
		if($scope.decg_sel == 90 || $scope.decg_sel == -90){
			$scope.decm_sel = 0;
			$scope.decs_sel = 0;
		}
		$scope.rah = $scope.rah_sel;
		$scope.ram = $scope.ram_sel;
		$scope.ras = $scope.ras_sel;
		$scope.decg = $scope.decg_sel;
		$scope.decm = $scope.decm_sel;
		$scope.decs = $scope.decs_sel;
		if($scope.rah == undefined){
			$scope.rah = "--";
		}
		if($scope.ram == undefined){
			$scope.ram = "--";
		}
		if($scope.ras == undefined){
			$scope.ras = "--";
		}
		if($scope.decg == undefined){
			$scope.decg = "--";
		}
		if($scope.decm == undefined){
			$scope.decm = "--";
		}
		if($scope.decs == undefined){
			$scope.decs = "--";
		}
	}


	function convertRaToDecimal(hour, minutes, seconds){
		var raDecimal = 0.0;
		raDecimal = raDecimal + hour * 15;
		raDecimal = raDecimal + minutes * 0.25;
		raDecimal = raDecimal + seconds * (15 / 3600);
		return raDecimal.toFixed(3);
	}
	function convertDecToDecimal(grades, arcminutes, arcseconds){
		var decDecimal=parseFloat(grades);
		if (grades<0){
			decDecimal = decDecimal - (arcminutes / 60);
			decDecimal = decDecimal - (arcseconds / 3600);
		} else {
			decDecimal = decDecimal + (arcminutes / 60);
			decDecimal = decDecimal + (arcseconds / 3600);
		}
		return decDecimal.toFixed(3);
	}

	function SetRADEC(){
		var coordinates = new Object();
		coordinates.ra = parseFloat(convertRaToDecimal($scope.rah, $scope.ram, $scope.ras));
		coordinates.dec = parseFloat(convertDecToDecimal($scope.decg, $scope.decm,$scope.decs));

		return $scope.sequence.mount.execute(function() {
			return $gloriaAPI.setParameterTreeValue($scope.rid,'mount','target.coordinates',coordinates,function(success){

			}, function(error){
				$scope.hasTargetPoint = true;
				$scope.mount_alarm = true;
				$scope.mount_alarm_message = "night.mount.messages.alarm_set_radec";
				$scope.status_main_ccd = "night.ccd.status.error";
			});
		});
	}

	function GoRADEC(){
		return $scope.sequence.mount.execute(function() {
			return $gloriaAPI.executeOperation($scope.rid,'point_to_coordinates',function(success){
				$scope.hasTargetPoint = true;
			}, function(error){
				$scope.hasTargetPoint = true;
				$scope.mount_alarm = true;
				$scope.status_main_ccd = "night.ccd.status.error";
				$scope.mount_alarm_message = "night.mount.messages.alarm_taget";
			});
		});
	}

	function SetTargetName(){
		return $scope.sequence.mount.execute(function() {
			return $gloriaAPI.setParameterTreeValue($scope.rid,'mount','target.object',$scope.target_name,function(success){

			}, function(error){
				$scope.hasTargetPoint = true;
				$scope.mount_alarm = true;
				$scope.mount_alarm_message = "alarm_set_target";
				$scope.status_main_ccd = "night.ccd.status.error";
			});
		});
	}

	function SetExposureTarget(){
		return $scope.sequence.mount.execute(function() {
			return $gloriaAPI.executeOperation($scope.rid,'get_exposure_range',function(success){
				console.log("Asking for exposure range");
				$gloriaAPI.getParameterTreeValue($scope.rid,"cameras",'ccd.images.['+$scope.ccd_order+'].range',function(success){
					console.log("Range:"+success.min+"-"+success.max);
					if ($scope.ccds.exposure.value > success.max){
						$scope.ccds.exposure.value = success.max;
					}
					$scope.ccds.exposure.value.min=success.min;
					$scope.ccds.exposure.value.max=success.max;
				}, function(error){

				});
			}, function(error){

			});
		});
	}

	function GoTargetName(){

		console.log("Ir");
		return $scope.sequence.mount.execute(function() {
			return $gloriaAPI.executeOperation($scope.rid,'point_to_object',function(success){
				$scope.hasTargetPoint = true;
			}, function(error){
				$scope.hasTargetPoint = true;
				$scope.mount_alarm = true;
				$scope.status_main_ccd = "night.ccd.status.error";
				$scope.mount_alarm_message = "night.mount.messages.alarm_taget";

			});
		});
	}

	$scope.$on('$destroy', function() {
		$timeout.cancel($scope.mountTimer);
	});

	//CAMERAS CONTROL

	function CamerasCtrl(){
		$gloriaAPI.getParameterValue($scope.rid,'cameras',function(success){

			$scope.scam0 = success.scam.images[0].url;
			$scope.scam0_url = success.scam.images[0].url;

			if (success.scam.number >= 2){
				$scope.hasSecondaryWebcam = true;
				$scope.scam1 = success.scam.images[1].url;
				$scope.scam1_url = success.scam.images[1].url;
			}
		}, function(error){
		});
		$scope.scamStatusTimer = $timeout($scope.scamTimer, 10000);
	}

	$scope.scamTimer = function(){
		var currentDate = new Date();

		console.log("Load scam:"+currentDate.getMinutes()+currentDate.getSeconds());

		if ($scope.scam0.indexOf("?") != -1){
			url0 = $scope.scam0 + "&" + currentDate.getMinutes()+currentDate.getSeconds();
		} else {
			url0 = $scope.scam0 + "?" + currentDate.getMinutes()+currentDate.getSeconds();
		}

		if ($scope.scam1.indexOf("?") != -1){
			url1 = $scope.scam1 + "&" + currentDate.getMinutes()+currentDate.getSeconds();
		} else {
			url1 = $scope.scam1 + "?" + currentDate.getMinutes()+currentDate.getSeconds();
		}

		$scope.scam0_url = url0;
		$scope.scam1_url = url1;

		$scope.scamStatusTimer = $timeout($scope.scamTimer, 10000);

	}

	$scope.$on('$destroy', function() {
		$timeout.cancel($scope.scamStatusTimer);
	});

	//NIGHT CCDS

	$scope.ccd_order = 0;

	$scope.ccds = {
		exposure : {
			value : null,
			min : [0,0],
			max : [10,10]
		},
		focuser : {
			value : null,
			last_value : null,
			min : [0,0],
			max : [2000,2000]
		},
		gain : {
			value : null,
			min : [260,260],
			max : [1023,1023]
		}
	}

	$scope.hasCcd = [false,false];
	$scope.hasFilterWheel = [false, false];
	$scope.hasVideoMode = [false,false];
	$scope.continuousUrl = [null,null];

	$scope.hasGain = [false, false];
	$scope.hasExposition = [true,true];
	$scope.isExposing=false;

	$scope.hasFilterWheel[0] = false;

	$scope.ccd_alarm = false;

	var max_ccd_timer=20;
	var num_ccd_timer=max_ccd_timer;

	function InitCCDSystem(){
		console.log("Run init sequence");
		GetNumCcds();
		LoadCcdAttributes();
		LoadContinuousMode();
		$scope.loadFilters();
		console.log("Finish init sequence");
	}

	$scope.loadFilters = function(){
		console.log("Request filters:"+$scope.rid);
		$gloriaAPI.executeOperation($scope.rid,'get_filters', function(success){
			$gloriaAPI.getParameterValue($scope.rid, 'fw', function(listFilters){
				$scope.filters_0 = listFilters.filters;
				//We select the first of the list as default value
				$gloriaAPI.setParameterTreeValue($scope.rid,'fw','selected',listFilters.filters[0],function(success){
					$scope.filter = $scope.filters_0[0];
					tutorial_filter_wheel = true;
					$gloriaAPI.executeOperation($scope.rid,'select_filter', function(success){

					}, function(dataError, statusError){

					});
				}, function(error){
					$scope.hasFilterWheel[0] = false;
				});
			}, function(error){
				$scope.hasFilterWheel[0] = false;
			});

		}, function(dataError, statusError){
			$scope.hasFilterWheel[0] = false;
		});
	}

	$scope.setFilter = function(){
		$gloriaAPI.setParameterTreeValue($scope.rid,'fw','selected',$scope.filter,function(success){
			$gloriaAPI.executeOperation($scope.rid,'select_filter', function(success){

			}, function(dataError, statusError){

			});
		}, function(error){

		});
	};

	$scope.expose = function(){
		console.log("Order:"+$scope.ccd_order);
		$scope.isVideo = false;
		if (!$scope.isExposing){
			if (!isNaN($scope.ccds.exposure.value) && ($scope.ccds.exposure.value>=$scope.ccds.exposure.min[$scope.ccd_order]) && ($scope.ccds.exposure.value<=$scope.ccds.exposure.max[$scope.ccd_order])){
					$scope.isExposing = true;
					$scope.ccd_alarm = false;
					$scope.sequence.ccd = $sequenceFactory.getSequence();
					$scope.status_main_ccd = "night.ccd.status.exposing";
					num_ccd_timer=max_ccd_timer;

					SetExposureTime();
					SetFocuserPosition();
					if ($scope.hasGain[$scope.ccd_order]){
						SetGain();
					}
					SetCCDAttributes();
					StartExposure();
					CheckInstImages();
			} else {
				console.log("Exposure time invalid");
			}
		} else {
			console.log("Operation in progress");
		}
	};

	$scope.video = function(){
		$scope.hasVideoMode[$scope.ccd_order]=true;
		$scope.isExposing=false;
		if (!$scope.isVideo){
			console.log("Enter in video mode ....");
			$scope.status_main_ccd = "night.ccd.status.video_mode";
			$scope.isVideo = true;
			$scope.gainChange = false;
			$scope.sequence.ccd = $sequenceFactory.getSequence();
			SetExposureTime();
			SetFocuserPosition();
			SetGain();
			SetCCDAttributes();

			if ($scope.continuousUrl[$scope.ccd_order] == null){
				console.log("Load continuous mode");
				LoadContinuousMode();
			}

			console.log("Checking cont images");
			CheckContImages();

		} else {
			$scope.status_main_ccd = "night.ccd.status.ready";
			console.log("Exit from video mode ....");
			$scope.isVideo = false;
		}
	};

	$scope.setOrder = function(){
		console.log("Changing ccd order");
		if ($scope.ccd_order == 0){
			$scope.ccd_order = 1;
		} else if ($scope.ccd_order == 1){
			$scope.ccd_order = 0;
		}

		$scope.ccds.exposure.value = null;
		$scope.ccds.gain.value = null;
		$scope.ccds.focuser.value = null;
		LoadCcdAttributes();
	};

	function ContinuousMode(){
		console.log("Enter on continuous mode operation");
		if ($scope.isVideo){
			//Check if the exposition time value has change

			if ($scope.gainChange){
				console.log("Change GAIN");
				$gloriaAPI.setParameterTreeValue($scope.rid,'cameras','ccd.images.['+$scope.ccd_order+'].gain',$scope.ccds.gain.value,function(success){
					$gloriaAPI.executeOperation($scope.rid,'set_ccd_attributes',function(success){

					}, function(error){

					});
				}, function(error){
					$scope.isExposing = false;
				});

				$scope.gainChange = false;
			}

			var mImage = new Image();
			var currentDate = new Date();
			if ($scope.continuousUrl[$scope.ccd_order] != null){
				mImage.src = $scope.continuousUrl[$scope.ccd_order]+"?"+currentDate.getMinutes()+currentDate.getSeconds();

				mImage.onload = function(){
					$("#image_0").attr("src",mImage.src);
				};
				$scope.continuousTimer =  $timeout(function() {ContinuousMode();}, 1000);
			} else {
				$gloriaAPI.executeOperation($scope.rid,'load_continuous_image', function(success){
					console.log("get continuous mode");
					$scope.hasVideoMode[$scope.ccd_order] = true;
					$gloriaAPI.getParameterTreeValue($scope.rid,'cameras','ccd.images.['+$scope.ccd_order+'].cont', function(success){
						console.log("URL:"+success+" "+$scope.ccd_order);
						$scope.continuousUrl[$scope.ccd_order] = success;
						$scope.continuousTimer = $timeout (function() {ContinuousMode();}, 1000);
					}, function(error){
						$scope.continuousTimer = $timeout (function() {ContinuousMode();}, 1000);
					});
				}, function(error){
					$scope.continuousTimer = $timeout (function() {ContinuousMode();}, 1000);
				});
			}
		}
	}

	function CheckContImages(){
		console.log("Enter in check continuous mode"+$scope.ccd_order);
		return $scope.sequence.ccd.execute(function(){
			console.log("Executing sequence"+$scope.ccd_order);
			$("#exposure_slider").slider("disable");
			$scope.continuousTimer = $timeout (function() {ContinuousMode();}, 1000);
		});
	}

	function GetNumCcds(){
		console.log("get_ccd");
		return $scope.sequence.ccd.execute(function() {
			return $gloriaAPI.getParameterValue($scope.rid, 'cameras', function(success){
				console.log("Number of ccds:"+success.ccd.number);
				$scope.num_ccds = success.ccd.number;
				if (success.ccd.number>=1){
					$scope.hasCcd[0] = true;
				}
				if (success.ccd.number>=2){
					$scope.hasCcd[1] = true;
					tutorial_hasCcds = true;
				}
			}, function(error){
				console.log("Error getting ccd number");
			});
		});
	}

	function LoadContinuousMode(){
		console.log("load_continuous_mode");
		return $scope.sequence.ccd.execute(function() {
			return $gloriaAPI.executeOperation($scope.rid,'load_continuous_image', function(success){
				console.log("get continuous mode");
				$scope.hasVideoMode[$scope.ccd_order] = true;
				$gloriaAPI.getParameterTreeValue($scope.rid,'cameras','ccd.images.['+$scope.ccd_order+'].cont', function(success){
					console.log("URL:"+success+" "+$scope.ccd_order);
					$scope.continuousUrl[$scope.ccd_order] = success;
					$scope.hasVideoMode[$scope.ccd_order] = true;
				}, function(error){
					console.log("Error getting ccd order");
				});
			}, function(error){
			});
		});
	}

	function LoadCcdAttributes(){
		console.log("load_ccd");
		return $scope.sequence.ccd.execute(function() {
			return $gloriaAPI.executeOperation($scope.rid,'get_ccd_attributes', function(success){
				console.log("get ccd attributes");
				$gloriaAPI.getParameterTreeValue($scope.rid,'cameras','ccd.images.['+$scope.ccd_order+']', function(success){
					console.log("Exposure:"+success.exposure);
					console.log("Gain:"+success.gain);
					$scope.exposure_time = success.exposure;
					if(success.exposure < 0){
						$scope.ccds.exposure.value = 0;
					}
					else{
						$scope.ccds.exposure.value = success.exposure;
					}
					$scope.exposureChange($scope.ccds.exposure.value);
					$scope.gain = success.gain;

					$scope.hasExposition[$scope.ccd_order] = true;
					LoadFocuserValues();

					$gloriaAPI.getParameterTreeValue($scope.rid,'cameras','ccd.images.['+$scope.ccd_order+'].caps.set-gain', function(success){

						if (success){
							console.log("Gain value:"+$scope.gain);
							if($scope.gain < 0){
								$scope.ccds.gain.value = 0;
							}
							else{
								$scope.ccds.gain.value = $scope.gain;
							}
							$scope.hasGain[$scope.ccd_order] = true;
							tutorial_gain = true;
						} else {
							$scope.ccds.gain.value = $scope.gain;
							$scope.hasGain[$scope.ccd_order] = false;
						}
					}, function(error){

					});
				}, function(error){

				});
			}, function(error){

			});
		});
	}

	function LoadFocuserValues(){
		$gloriaAPI.getParameterTreeValue($scope.rid,'focuser','pos',function(success){
			console.log("Initial position:"+success);
			if (success != ""){
				$scope.ccds.focuser.last_value = success;
			}
		}, function(dataError,statusError){

		});
		$gloriaAPI.executeOperation($scope.rid,'get_focuser_values', function(success){

		}, function(error){

		});
		$gloriaAPI.executeOperation($scope.rid,'get_focuser_position', function(success){
			//Read the initial position of the focuser
			$gloriaAPI.getParameterValue($scope.rid,'focuser',function(success){
				console.log("Initial position:"+success.position);
				if ((success.position == -1) && (success.range.max == 0) && (success.range.min == 0)){
					console.log ("Relative focuser");
					$scope.ccds.focuser.last_value = 1000;
					$scope.ccds.focuser.value = 1000;
					$scope.ccds.focuser.max[$scope.ccd_order] = 2000;
					$scope.ccds.focuser.min[$scope.ccd_order] = 0;
				}
				else {
					$scope.ccds.focuser.last_value = success.position;
					$scope.ccds.focuser.value = success.position;
					$scope.ccds.focuser.max[$scope.ccd_order] = success.range.max;
					$scope.ccds.focuser.min[$scope.ccd_order] = success.range.min;
				}
				$scope.focuserChange($scope.ccds.focuser.value);
			}, function(dataError,statusError){

			});
		}, function(error){

		});
	}

	function SetCcdOrder(order){
		console.log("set ccd order")
		return $scope.sequence.ccd.execute(function() {
			return $gloriaAPI.setParameterTreeValue($scope.rid,'cameras','ccd.order',order,function(success){
				console.log("ccd order");
			}, function(error){

			});
		});
	}

	/* Auxiliar functions */
	function GetFilters(cid){
		$gloriaAPI.getParameterValue(cid, 'fw', function(success){
			$scope.filters_0 = success.filters;
			$scope.filter = success.filters[0];
			$gloriaAPI.setParameterTreeValue($scope.reservation,'fw','selected',$scope.filter,function(success){

			}, function(error){
				$scope.hasFilterWheel[0] = false;
			});
		}, function(error){
			$scope.hasFilterWheel[0] = false;
		});

	}
	function rotateAnnotationCropper(offsetSelector, xCoordinate, yCoordinate, cropper){
	    var x = xCoordinate - offsetSelector.offset().left - offsetSelector.width()/2;
	    var y = -1*(yCoordinate - offsetSelector.offset().top - offsetSelector.height()/2);
	    var theta = Math.atan2(y,x)*(180/Math.PI);


	    var cssDegs = convertThetaToCssDegs(theta);

	    return cssDegs;
	}

	function convertThetaToCssDegs(theta){
		var cssDegs = 90 - theta;
		return cssDegs;
	}

	function CameraStyle(){
		if (parseInt($('#exposureBar').css('height'))>0) {
			$scope.exposureBarStyle=parseInt($('#exposureBar').css('height'));
		}
		if (parseInt($('#focuserBar').css('height'))>0) {
			$scope.focuserBarStyle=parseInt($('#focuserBar').css('height'));
		}
		if (parseInt($('#carousel').css('height'))>0) {
			$scope.carouselHeight=parseInt($('#carousel').css('height'));
		}
		if (parseInt($('#carousel').css('width'))>0) {
			$scope.carouselWidth=parseInt($('#carousel').css('width'));
			$scope.focuserBarPosition=$scope.carouselWidth/6;
		}
	}

	$scope.exposureChange=function(data){
		$scope.ccds.exposure.value = parseFloat(data);
		$scope.exposuretop=$scope.carouselHeight*86/100-($scope.ccds.exposure.value*($scope.exposureBarStyle-40)/$scope.ccds.exposure.max[$scope.ccd_order])-18;
	}
	$scope.focuserChange=function(data){
		$scope.ccds.focuser.value = parseInt(data);
		$scope.ccds.focuser.steps=Math.floor($scope.ccds.focuser.value-$scope.ccds.focuser.last_value);
		$scope.focusertop=$scope.carouselHeight*86/100-($scope.ccds.focuser.value*($scope.focuserBarStyle-30)/$scope.ccds.focuser.max[$scope.ccd_order])-12;
	}

	$scope.setExposureTimeValue = function(sign) {
		$scope.ccds.exposure.value = parseFloat($scope.ccds.exposure.value + 0.001 * sign);

		if ($scope.ccds.exposure.value < $scope.ccds.exposure.min) {
			$scope.ccds.exposure.value = $scope.ccds.exposure.min;
		} else if ($scope.ccds.exposure.value > $scope.ccds.exposure.max) {
			$scope.ccds.exposure.value = $scope.ccds.exposure.max;
		}
		$scope.exposureChange($scope.ccds.exposure.value);
	};

	$scope.setFocuserPositionValue = function(sign) {
		$scope.ccds.focuser.value += sign;

		if ($scope.ccds.focuser.value < $scope.ccds.focuser.min) {
			$scope.ccds.focuser.value = $scope.ccds.focuser.min;
		} else if ($scope.ccds.focuser.value > $scope.ccds.focuser.max) {
			$scope.ccds.focuser.value = $scope.ccds.focuser.max;
		}
		$scope.focuserChange($scope.ccds.focuser.value);
	};

	$scope.activate_focuser = function(){
		$scope.focuserPressed = true;

	};

	//Set the focuser new value
	function SetFocuserPosition(){
		$scope.sequence.ccd.execute(function() {
			return $gloriaAPI.setParameterTreeValue($scope.rid,'focuser','pos',$scope.ccds.focuser.value,function(success){

			}, function(error){

			});
		});
		$scope.sequence.ccd.execute(function() {
			return $gloriaAPI.setParameterTreeValue($scope.rid,'focuser','steps',$scope.ccds.focuser.steps,function(success){
				console.log("Move "+$scope.ccds.focuser.steps+" steps");
			}, function(error){
			});
		});
		return $scope.sequence.ccd.execute(function() {
			return $gloriaAPI.executeOperation($scope.rid,'move_focus', function(success){
				console.log("Focuser moved");
				$scope.ccds.focuser.last_value = $scope.ccds.focuser.value;
			}, function(error){

			});
		});
	}

	function SetExposureTime(){
		console.log("Set exposure time:"+$scope.ccds.exposure.value+" in order "+$scope.ccd_order);
		return $scope.sequence.ccd.execute(function() {
			return $gloriaAPI.setParameterTreeValue($scope.rid,'cameras','ccd.images.['+$scope.ccd_order+'].exposure',$scope.ccds.exposure.value,function(success){
					$scope.exposure_time = $scope.ccds.exposure.value;
				}, function(error){
					$scope.isExposing = false;
					$scope.ccd_alarm = true;
					$scope.status_main_ccd = "night.ccd.status.error";
					$scope.ccd_alarm_message = "night.ccd.messages.alarm_exposure";
				});
		});
	}
	function SetGain(){
		return $scope.sequence.ccd.execute(function() {
			return $gloriaAPI.setParameterTreeValue($scope.rid,'cameras','ccd.images.['+$scope.ccd_order+'].gain',$scope.ccds.gain.value,function(success){

				}, function(error){
					$scope.isExposing = false;
					$scope.ccd_alarm = true;
					$scope.status_main_ccd = "night.ccd.status.error";
					$scope.ccd_alarm_message = "night.mount.messages.alarm_gain";
				});
		});
	}
	function SetCCDAttributes(){
		return $scope.sequence.ccd.execute(function() {
			return $gloriaAPI.executeOperation($scope.rid,'set_ccd_attributes',function(success){

				}, function(error){

					$scope.ccd_alarm = true;
					$scope.isExposing = false;
					$scope.status_main_ccd = "night.ccd.status.error";
					$scope.ccd_alarm_message = "night.ccd.messages.internal_server";
				});
		});
	}

	function StartExposure(){
		console.log("eee0"+$scope.ccd_order);
		return $scope.sequence.ccd.execute(function() {
			console.log("ee1"+$scope.ccd_order);
			return $gloriaAPI.executeOperation($scope.rid,'start_exposure',function(success){
				console.log("ee2"+$scope.ccd_order);
				$scope.imageTaken = false;
				}, function(error){
					$scope.isExposing = false;
					$scope.ccd_alarm = true;
					$scope.status_main_ccd = "night.ccd.status.error";
					$scope.ccd_alarm_message = "night.ccd.messages.alarm_start_exposure";
				});
		});
	}

	function CheckInstImages(){
		console.log("ee4"+$scope.ccd_order);
		return $scope.sequence.ccd.execute(function(){
			console.log("ee5"+$scope.ccd_order);
			return $gloriaAPI.getParameterTreeValue($scope.rid,'cameras','ccd.images.['+$scope.ccd_order+'].inst.id',function(success){
				console.log("ee3"+$scope.ccd_order);
				if (success != -1){
					console.log("Image with id "+success+" generated");
					console.log("Timer para dentro de:"+ $scope.exposure_time);

					$scope.exposureTimer = $timeout(function() {ExposureTimer();}, parseInt($scope.exposure_time*1000));

				} else {
					$scope.isExposing = false;
					$scope.ccd_alarm = true;
					$scope.status_main_ccd = "night.ccd.status.error";
					$scope.ccd_alarm_message = "night.ccd.messages.internal_server";
				}
			}, function(error){
				$scope.isExposing = false;
				$scope.ccd_alarm = true;
				$scope.status_main_ccd = "night.ccd.status.error";
				$scope.ccd_alarm_message = "night.ccd.messages.internal_server";
			});
		});
	}


	function ExposureTimer(){

		console.log("Paso del timer");
		$gloriaAPI.executeOperation($scope.rid,'load_image_urls',function(success){
			$gloriaAPI.getParameterTreeValue($scope.rid,'cameras','ccd.images.['+$scope.ccd_order+'].inst',function(success){
				if ((success.jpg!=null) && (success.fits)!=null){
					$scope.status_main_ccd = "night.ccd.status.transfering";
					console.log("Deleting timer");

					/*
					 var hash = CryptoJS.SHA1("password");
					 console.log('Passwd:'+hash);

					//Send fits url to SADIRA

					var data_json = {
							'experimentid' : "night",
							'experiment':"Default Night Experiment",
							'reservationid' : $scope.rid,
							'url' : success.fits,
							'user': $scope.$parent.login.user,
							'passwd': hash
					};


					var dataJson = new FormData();
					dataJson.append('json_header', JSON.stringify(data_json));

					var xhr = new XMLHttpRequest();
					xhr.open('POST', 'http://sadira.iasfbo.inaf.it:9999/gloria/submit', true);
					xhr.onload = function () {
					    // do something to response
					    console.log("Sadira answers : " + this.responseText);
					};
					xhr.send(dataJson);
					*/

					$scope.mImage = new Image();
					$scope.mImage.src = success.jpg;
					mImage.onload = function(){
						$("#image_0").attr("src",success.jpg);
						$("#image_0").load(function(){
							$scope.status_main_ccd = "night.ccd.status.taken";
						});
					};

					$scope.isExposing = false;
					$scope.imageTaken = true;
				} else {
					console.log("Launching timer again");
					if (num_ccd_timer == 0){
						$scope.status_main_ccd = "night.ccd.status.error";
						$scope.isExposing = false;
					} else {
						num_ccd_timer--;
						$scope.exposureTimer = $timeout(function() {ExposureTimer();}, 4000);
					}
				}
			}, function(error){
				$scope.isExposing = false;
				$scope.status_main_ccd = "night.ccd.status.error";
				$scope.ccd_alarm_message = "night.ccd.messages.alarm_url";
			});
		}, function(error){
			$scope.isExposing = false;
			$scope.status_main_ccd = "night.ccd.status.error";
			$scope.ccd_alarm_message = "night.ccd.messages.alarm_url";
		});

	}

	$scope.$on('$destroy', function() {
		$timeout.cancel($scope.continuousTimer);
		$timeout.cancel($scope.exposureTimer);
	});

	//NIGHT IMAGES

	$scope.loadMyImages=function(){
		$scope.images.total=0;
		$scope.images.count=0;
	    $('#experiment_images').hide();
		$('#notfound_image').hide();
	    $('#loading_image').show();
    	return $gloriaAPI.getImagesByContext($scope.rid,function(data){
    		$scope.imagenes=data;
    		while(1){
    			if(data[$scope.images.total]==undefined){
    				break;
    			}
    			$scope.images.total++;
    		}
    		if($scope.images.total==0){
    			$('#notfound_image').show();
    		}
    		else {
        	    $('#experiment_images').show();
    		}
    	    $('#loading_image').hide();
    	});
	}
    $scope.images.counter=function(operation){
    	if(operation==true){
    		if($scope.images.count<$scope.images.total-1){
        		$scope.images.count++;
    		}
    	}
    	else if(operation==false){
    		if($scope.images.count>0){
    			$scope.images.count--;
    		}
    	}
    }

	$scope.$watch('imageTaken', function(){
    	if($scope.rid && $scope.imageTaken){
    		$scope.loadMyImages();
	    }
    });

});
