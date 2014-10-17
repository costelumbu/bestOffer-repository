var Map = (function () {
    'use strict'
    
    var mapObject = (function () {
        var map;
        var initialLocation;

        var initMap = function () {
            var element = document.getElementById('map_canvas');
            var options = {
              mapTypeId: google.maps.MapTypeId.ROADMAP,
              zoom: 8
            };
            
            map = new google.maps.Map(element, options);
            
            if(navigator.geolocation) {
                geoSupport = true;
                navigator.geolocation.getCurrentPosition(function(position) {
                    initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
                    map.setCenter(initialLocation);
                }, function () {
                    alert("Geolocation service has failed");
                });
            } 
            else {
                alert("Your deviced doesn't support Geolocation");
                initialLocation = new google.maps.LatLng(42.6975100, 23.3241500);
                map.setCenter(initialLocation);
            }
            /*Offers.stores.fetch(function() {
                var data = this.data();
                for (var i = 0; i < data.length; i++) {
                    console.log(data[i].Street);
                }              
            });*/
        }
        
        return { 
            initMap: initMap
        }
    }());
    
    return mapObject;
}());