'use strict';

/**
 * @ngdoc directive
 * @name synoteClientApp.directive:synoteResize
 * @description
 * # synoteResize
 */
angular.module('synoteClient')
  .directive('synoteResize', function () {
    return function (scope, element, attrs) {
      var sourceElem = angular.element(document.querySelector(attrs.synoteResize));
      scope.getElemDimensions = function () {
        return { 'h': sourceElem.height(), 'w': sourceElem.width() };
      };
      scope.$watch(scope.getElemDimensions, function (newValue, oldValue) {
        scope.style = function () {
          return {
            'height': (newValue.h) + 'px'
          };
        };

      }, true);

      //sourceElem.bind('synoteResize', function () {
      //  scope.$apply();
      //});
    }
  });
