"use strict";

angular.module('config', [])

.constant('ENV', {name:'development',apiEndpoint:'http://localhost:1337',hostURL:'http://localhost:9000',registerToken:'false',defaultLang:'en'})

;