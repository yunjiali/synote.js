Synotejs Client
==============================
* The videogular youtube plugin needs to be changed:
```javascript
scope.$watch(
                            function() {
                                return API.sources;
                            },
                            function(newVal, oldVal) {
                              if(newVal && typeof newVal[0].src === "string")
                                onSourceChange(newVal[0].src);
                            }
                        );
```

```javascript
function isYoutube(url) {
                            if(typeof url !== "string")
                              return false;
                          
                            return url.match(youtubeReg);
                        }
```

```javascript
function onVideoReady() {
                            ...
                            angular.element(ytplayer.getIframe()).css({'width':'100%'});
                        }
```
height 100% will make the video very small.
