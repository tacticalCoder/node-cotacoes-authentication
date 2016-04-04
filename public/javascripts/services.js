angular.module('nodeCotacoes').factory('AuthService',['$q','$timeout', '$http', function($q, $timeout, $http){
    
    var user = null;
    
    return({
        isLoggedIn: isLoggedIn,
        getUserStatus: getUserStatus,
        login: login,
        logout: logout
    });
    
    function isLoggedIn(){
        if(user){
            return true;
        } else {
            return false;
        }
    };
    
    function getUserStatus(){

        $http.get('/user/status')
            .success(function(data){
                if(data.status){
                    user = true;
                    return user;
                    console.log('GetUserStatus USuario: ' + user);
                } else {
                    user = false;
                    return user;
                    console.log('GetUserStatus USuario: ' + user);
                }
            })
            .error(function(data){
                user = false;
                return user;
                console.log('GetUserStatus USuario: ' + user);
            });
           
    };
    
    function login(username, password){
        var deferred = $q.defer();
        
        $http.post('/user/login',
            {username: username, password: password})
            .success(function(data, status){
                console.log('voltou');
                if (status == 200 && data.status){
                    user = true;
                    deferred.resolve();
                } else{
                    user = false;
                    deferred.reject();
                }
            })
            .error(function(data){
                user = false;
                deferred.reject();
            })
            
        return deferred.promise;
    };
    
    function logout(){
        var deferred = $q.defer();
        
        $http.get('/user/logout')
            .success(function(data){
                user = false;
                deferred.resolve();
            })
            .error(function(data){
                user = false;
                deferred.reject();
            });
            
        return deferred.promise;
    }
}]);


// angular.module('nodeCotacoes').factory('AuthService',
//   ['$q', '$timeout', '$http',
//   function ($q, $timeout, $http) {

//     // create user variable
//     var user = null;

//     // return available functions for use in the controllers
//     return ({
//       isLoggedIn: isLoggedIn,
//       getUserStatus: getUserStatus,
//       login: login,
//       logout: logout,
//       register: register,
//       usuarioLogado: usuarioLogado
//     });

//     function isLoggedIn() {
//       if(user) {
//         return true;
//       } else {
//         return false;
//       }
//     }
    
//     function usuarioLogado(){
//         $http.get('/user/status')
//             .success(function(data){
//                 if(data.status){
//                     return true;
//                 } else {
//                     return false;
//                 }
//             })
//             .error(function(data){
//                 return false;
//             });
//     }

//     function getUserStatus() {
//       $http.get('/user/status')
//       // handle success
//       .success(function (data) {
//         if(data.status){
//           console.log('usuario continua logado');
//           user = true;
//         } else {
//           console.log('usuario esta deslogado');
//           user = false;
//         }
//       })
//       // handle error
//       .error(function (data) {
//         user = false;
//       });
//     }

//     function login(username, password) {

//       // create a new instance of deferred
//       var deferred = $q.defer();

//       // send a post request to the server
//       $http.post('/user/login',
//         {username: username, password: password})
//         // handle success
//         .success(function (data, status) {
//           if(status === 200 && data.status){
//             user = true;
//             deferred.resolve();
//           } else {
//             user = false;
//             deferred.reject();
//           }
//         })
//         // handle error
//         .error(function (data) {
//           user = false;
//           deferred.reject();
//         });

//       // return promise object
//       return deferred.promise;

//     }

//     function logout() {
        
//       console.log('iniciando logout');

//       // create a new instance of deferred
//       var deferred = $q.defer();

//       // send a get request to the server
//       $http.get('/user/logout')
//         // handle success
//         .success(function (data) {
//           user = false;
//           console.log('deslogou usuario');
//           deferred.resolve();
//         })
//         // handle error
//         .error(function (data) {
//           user = false;
//           deferred.reject();
//         });

//       // return promise object
//       return deferred.promise;

//     }

//     function register(username, password) {

//       // create a new instance of deferred
//       var deferred = $q.defer();

//       // send a post request to the server
//       $http.post('/user/register',
//         {username: username, password: password})
//         // handle success
//         .success(function (data, status) {
//           if(status === 200 && data.status){
//             deferred.resolve();
//           } else {
//             deferred.reject();
//           }
//         })
//         // handle error
//         .error(function (data) {
//           deferred.reject();
//         });

//       // return promise object
//       return deferred.promise;

//     }

// }]);