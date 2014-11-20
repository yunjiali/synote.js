/**
 * Created by Yunjia Li on 20/11/2014.
 * A utils toolkit to deal with various of things
 */

module.exports = {
    stringToSec:function(timeStr)
    {
        if (timeStr == null || timeStr.length == 0)
        {
            return 0;
        }

        // implement regexp validation

        var seconds = null;
        var index = timeStr.lastIndexOf(":");
        if (index != -1)
        {
            seconds = timeStr.substring(index + 1);
            timeStr = timeStr.substring(0, index);
        }
        else
        {
            seconds = timeStr;
            timeStr = null;
        }

        var minutes = null;
        index = (timeStr != null) ? timeStr.lastIndexOf(":") : -1;
        if (index != -1)
        {
            minutes = timeStr.substring(index + 1);
            timeStr = timeStr.substring(0, index);
        }
        else
        {
            minutes = timeStr;
            timeStr = null;
        }

        var hours = timeStr;

        var time = 0;
        if (seconds != null && seconds.length != 0)
        {
            time += parseInt(seconds,10);
        }

        if (minutes != null && minutes.length != 0)
            time += parseInt(minutes,10) * 60;

        if (hours != null && hours.length != 0)
            time += parseInt(hours,10) * 3600;

        return time;
    },


    isYouTubeURL:function(url,bool) {

        var pattern = /^https?:\/\/(?:www\.)?youtube\.com\/watch\?(?=.*v=((\w|-){11}))(?:\S+)?$/;
        if (url.match(pattern)) {
            return (bool !== true) ? RegExp.$1 : true;
        } else { return false; }
    },

    /*
     * Convert Youtube ISO8601 format duration to seconds
     */
    convertYouTubeISO8601ToSec:function(ytDurationStr)
    {
        //PT2M47S
        //PT25S
        //PT3M
        //PT1H2M13S
        var timeStr = ytDurationStr.replace("PT","").replace("H",":").replace("M",":").replace("S","");
        if(timeStr.match("^:"))
        {
            timeStr ="00"+timeStr;
        }

        if(timeStr.match(":^"))
        {
            timeStr =timeStr+"00";
        }

        return this.stringToSec(timeStr);
    },

    getVideoIDFromYoutubeURL:function(url)
    {
        var regExp = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
        var match = url.match(regExp);
        if (match&&match[1].length==11){
            return match[1];
        }else{
            return;
        }
    },

    /*the section parameter is not useful here I think*/
    isDailyMotionURL:function(url,bool)
    {
        var m = url.match(/^.+dailymotion.com\/(video|hub)\/([^_]+)[^#]*(#video=([^_&]+))?/);
        if (m !== null) {
            return true;
        }
        else
        {
            return false;
        }
    },

    getVideoIDFromDailyMotionURL:function(url)
    {
        var m = url.match(/^.+dailymotion.com\/(video|hub)\/([^_]+)[^#]*(#video=([^_&]+))?/);
        if (m !== null) {
            if(m[4] !== undefined) {
                return m[4];
            }
            return m[2];
        }
        return;
    }
}
