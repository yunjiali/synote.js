"use strict";

angular.module('config', [])

.constant('ENV', {name:'sandbox',apiEndpoint:'http://server.sandbox.synote.org',hostURL:'http://client.sandbox.synote.org',registerToken:'false',defaultLang:'en'})

;