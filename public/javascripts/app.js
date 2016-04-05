var app = angular.module('nodeCotacoes', ['ui.router']);

app.config(["$locationProvider","$stateProvider", "$urlRouterProvider",function($locationProvider,$stateProvider, $urlRouterProvider) {

    // $locationProvider.html5mode(true);
    $locationProvider.html5Mode(true);

    $urlRouterProvider.otherwise(function($injector){
        var $state = $injector.get('$state');
        $state.go('home');
    });

    $stateProvider

        // HOME STATES AND NESTED VIEWS ========================================
        .state('home', {
            url: '/home',
            templateUrl: 'templates/partial-home.html',
            controller: 'mainController',
            module: 'private'
        })
        
        .state('proposta',{
            url: '/proposta?id_proposta',
            templateUrl: 'templates/partial-proposta.ejs',
            controller: 'propostaController'
        })
        
        .state('login',{
            url: '/login',
            templateUrl: 'templates/partial-login.html' ,
            controller: 'loginController',
            module: 'public'
        })
        
        .state('logout',{
           url: '/logout',
           controller: 'logoutController' 
        })
        
        .state('about',{
           url: '/about',
           templateUrl: 'templates/partial-about.ejs'
        });
        
    // $urlRouterProvider.otherwise('/home');
}]);


app.run(function($rootScope, $state, $location, AuthService){
  
    $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
        console.log("isloggedIn" + AuthService.isLoggedIn());
        AuthService.getUserStatus().then(
            function(){
                console.log("isloggedIn" + AuthService.isLoggedIn());
                if (toState.module === 'private' && !AuthService.isLoggedIn()){
                    // the user is not authorized, do not switch to state
                    console.log('previnindo default route');
                    event.preventDefault();
                    // go to login page
                    console.log('indo para rota login');
                    console.log(AuthService.isLoggedIn());
                    $state.go('login');
                }
            }
        );
        // console.log("isLoggedIn : " + AuthService.isLoggedIn());
        
    });
});


// app.run(function($rootScope, $state, $location, AuthService){
  
//     $rootScope.$on("$stateChangeStart", function (event, next, current, toState) {
//         AuthService.getUserStatus();
//         if (next.access.restricted && !AuthService.isLoggedIn()){
//             // the user is not authorized, do not switch to state
//             event.preventDefault();
//             // go to login page
//             $state.go('login');
//         }
//     });
// });





