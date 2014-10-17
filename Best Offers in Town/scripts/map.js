var Map = (function () {
    'use strict'
    
    var mapObject = (function () {
        var map;

        var initMap = function () {
            var element = document.getElementById('map_canvas');
            var currentLocation = new google.maps.LatLng(42.6975100, 23.3241500);
            console.log(userViewModel.get('CurrentGeo').toString());
            console.log(currentLocation);
            var options = {
              center: currentLocation,
              mapTypeId: google.maps.MapTypeId.ROADMAP,
              zoom: 8
            };
            
            this.map = new google.maps.Map(element, options);
            /*Offers.stores.fetch(function() {
                var data = this.data();
                for (var i = 0; i < data.length; i++) {
                    console.log(data[i].Street);
                }              
            });*/
        }
        
        var getGeoLocation = function () {
            var initialLocation;
            if(navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
                    userViewModel.set('CurrentGeo', initialLocation);
                }, function () {
                    initialLocation = new google.maps.LatLng(42.6975100, 23.3241500);
                });
            } else {
                    initialLocation = new google.maps.LatLng(42.6975100, 23.3241500);
                }
        }
        
        
        
        return { 
            initMap: initMap,
            getGeoLocation: getGeoLocation
        }
    }());
    
    return mapObject;
}());