var Map = (function () {
    'use strict'
    
    var mapObject = (function () {
        var map;

        var initMap = function () {
            var element = document.getElementById('map_canvas');
            var currentLocation = getGeoLocation();
            console.log(currentLocation.lat());
            console.log(currentLocation.lng());
            var options = {
              center: new google.maps.LatLng(currentLocation.lat(), currentLocation.lng()),
              mapTypeId: google.maps.MapTypeId.ROADMAP,
              zoom: 8
            };
        
            this.map = new google.maps.Map(element, options);
            Offers.stores.fetch(function() {
                var data = this.data();
                for (var i = 0; i < data.length; i++) {
                    console.log(data[i].Street);
                }              
            });
        }
        
        var getGeoLocation = function () {
            var initialLocation;
            if(navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
                }, function () {
                    initialLocation = new google.maps.LatLng(42.6975100, 23.3241500);
                });
            }
                else {
                    initialLocation = new google.maps.LatLng(42.6975100, 23.3241500);
                }
            return initialLocation;
        }
        
        
        
        return { 
            initMap: initMap
        }
    }());
    
    return mapObject;
}());