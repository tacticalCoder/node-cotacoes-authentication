angular.module('nodeCotacoes').controller('mainController', function($scope, $http) {

    $scope.cotacoesData = {};
    $scope.hospitalData = {};
    $scope.sortType = 'descr_status_cotacao';
    $scope.sortReverse = false;
    $scope.searchCotacao = {"descr_status_cotacao":"COTAÇÃO ABERTA"};

    $http.get('/api/cotacoes')
        .success(function(data) {
            $scope.cotacoesData = data;
            console.log(data);
        })
        .error(function(error) {
            console.log('Error: ' + error);
        });
        
        
    $http.get('/api/hospital')
        .success(function(data) {
            $scope.hospitalData = data[0];
            console.log(data);
        })
        .error(function(error) {
            console.log('Error: ' + error);
        });


});


angular.module('nodeCotacoes').controller('loginController', ['$scope', '$state', 'AuthService', function ($scope, $state, AuthService){
    $scope.login = function(){
        $scope.error = false;
        $scope.disabled = true;
        
        AuthService.login($scope.loginForm.username, $scope.loginForm.password)
            .then(function(){
                $state.go('home');
                $scope.disabled = false;
                $scope.loginForm = {};
            })
            .catch(function(){
                $scope.error = true;
                $scope.errorMessage = "Invalid username and/or password";
                $scope.disabled = false;
                $scope.loginForm = {};
            });
    };
}]);

angular.module('nodeCotacoes').controller('logoutController', ['$scope', '$state', 'AuthService', function($scope, $state, AuthService){
    
    $scope.logout = function(){
        AuthService.logout()
            .then(function() {
                // $location.path('/login');
                $state.go('login');
            });
    };
}]);

angular.module('nodeCotacoes').controller('propostaController', function($scope, $http, $stateParams){
    $scope.propostasData = {};
    $scope.fabricanteSelecionado = null;
    $scope.fabricantesData = {};
    
     $http.get('/api/proposta/' + $stateParams.id_proposta)
        .success(function(data) {
            $scope.propostasData = data;
            console.log(data);
        })
        .error(function(error) {
            console.log('Error: ' + error);
        });
        
      $http.get('/api/fabricantes')
        .success(function(data){
            $scope.fabricantesData = data;
            console.log(data);
        })
        .error(function(error){
            console.log('Error: ' + error);
        });
        
     $scope.salvaItemProposta = function(proposta, isValid){
         
        if (isValid){
            $http.put('api/item_proposta/' + proposta.id_item_proposta, proposta)
                .success(function(data){
                    console.log('success');
                    $location.path('/home');
                })
                .error(function(error){
                    console.log('Error: ' + error);
                });
            };
        };
    
});

angular.module('nodeCotacoes').directive('smartFloat', function ($filter) {
    var FLOAT_REGEXP_1 = /^\$?\d+.(\d{3})*(\,\d*)$/; //Numbers like: 1.123,56
    var FLOAT_REGEXP_2 = /^\$?\d+,(\d{3})*(\.\d*)$/; //Numbers like: 1,123.56
    var FLOAT_REGEXP_3 = /^\$?\d+(\.\d*)?$/; //Numbers like: 1123.56
    var FLOAT_REGEXP_4 = /^\$?\d+(\,\d*)?$/; //Numbers like: 1123,56

    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function (viewValue) {
                if (FLOAT_REGEXP_1.test(viewValue)) {
                    ctrl.$setValidity('float', true);
                    return parseFloat(viewValue.replace('.', '').replace(',', '.'));
                } else if (FLOAT_REGEXP_2.test(viewValue)) {
                        ctrl.$setValidity('float', true);
                        return parseFloat(viewValue.replace(',', ''));
                } else if (FLOAT_REGEXP_3.test(viewValue)) {
                        ctrl.$setValidity('float', true);
                        return parseFloat(viewValue);
                } else if (FLOAT_REGEXP_4.test(viewValue)) {
                        ctrl.$setValidity('float', true);
                        return parseFloat(viewValue.replace(',', '.'));
                }else {
                    ctrl.$setValidity('float', false);
                    return undefined;
                }
            });

            ctrl.$formatters.unshift(
               function (modelValue) {
                   return $filter('number')(parseFloat(modelValue) , 2);
               }
           );
        }
    };
});