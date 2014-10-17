var Map = (function () {
    'use strict'
    
    var mapObject = (function () {
        var map;

        var initMap = function () {
            var element = document.getElementById('map_canvas');
            var options = {
              center: new google.maps.LatLng(37.333333, -121.9),
              mapTypeId: google.maps.MapTypeId.ROADMAP,
              zoom: 8
            };
        
            this.map = new google.maps.Map(element, options);
            
        }
        
        var getGeoLocation = function (position) {
            
        }
        
        return { 
            initMap: initMap
        }
    }());
    
    return mapObject;
}());