var Map = (function () {
    'use strict'
    
    var mapObject = (function () {
        var map;
        var initialLocation;
        var current;
        var infowindow;
        var directionsRenderer = new google.maps.DirectionsRenderer();
        var markers = new Array();

        var initMap = function () {
            
            var element = document.getElementById('map_canvas');
            var options = {
              mapTypeId: google.maps.MapTypeId.ROADMAP,
              zoom: 12
            };
            
            map = new google.maps.Map(element, options);
           
           }
        
        
        var show = function () {
            directionsRenderer.setMap(null);
            parseAddress("бул. „княз Александър Дондуков“ 23, Sofia" ,"45fc7100-56ec-11e4-8172-13706619d7e5");
            if(navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
                    map.setCenter(initialLocation);
                    
                }, function () {
                    alert("Geolocation service has failed");
                    initialLocation = new google.maps.LatLng(42.6975100, 23.3241500);
                    map.setCenter(initialLocation);
                });
            } 
            else {
                alert("Your deviced doesn't support Geolocation");
                initialLocation = new google.maps.LatLng(42.6975100, 23.3241500);
                map.setCenter(initialLocation);
            }

            Offers.stores.fetch(function() {
                infowindow = new google.maps.InfoWindow({
                    content: "holding...",
                    maxWidth: 320
                });
                var data = this.data();
                for (var i = 0; i < data.length; i++) {
                    var marker = new google.maps.Marker({
                        position: new google.maps.LatLng(data[i].Geo.latitude, data[i].Geo.longitude),
                        map: map,
                        animation: google.maps.Animation.DROP,
                        html: data[i].Name + "<br/>" + contentString
                      });
                    markers.push(marker);
                    var contentString = '<div id="content">'+
                      '<div id="siteNotice">'+
                      '</div>'+
                      '<h1 id="firstHeading" class="firstHeading">' + data[i].Name + '</h1>'+
                      '<div id="bodyContent">'+
                      '<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large ' +
                      'sandstone rock formation in the southern part of the '+
                      'Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) '+
                      'south west of the nearest large town, Alice Springs; 450&#160;km '+
                      '(280&#160;mi) by road. Kata Tjuta and Uluru are the two major '+
                      'features of the Uluru - Kata Tjuta National Park. Uluru is '+
                      'sacred to the Pitjantjatjara and Yankunytjatjara, the '+
                      'Aboriginal people of the area. It has many springs, waterholes, '+
                      'rock caves and ancient paintings. Uluru is listed as a World '+
                      'Heritage Site.</p>'+
                      '<p>Attribution: Uluru, <a href="http://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">'+
                      'http://en.wikipedia.org/w/index.php?title=Uluru</a> '+
                      '(last visited June 22, 2009).</p>'+
                      '</div>'+
                      '</div>';
                    google.maps.event.addListener(marker, "click", function () {
                        console.log(this.getPosition());
                        infowindow.setContent(this.html);
                        infowindow.setPosition(this.getPosition());
                        console.log(map.getBounds());
                        infowindow.open(map, this);
                    });
                }              
            });
            for (var i = 0; i < markers.length; i++) {
                console.log(markers[i]);
                markers[i].setVisible(true);
            }
        }
        
        var getCurrentCity = function () {
            var geocoder = new google.maps.Geocoder();
            if(navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
                    geocoder.geocode( { 'latLng': initialLocation}, function(results, status) {
                        if (status == google.maps.GeocoderStatus.OK) {
                            var res = results[0].address_components[2].short_name;
                            console.log(res);                                                        
                        } else {
                            //alert(errorMessages(status));
                        }
                    });
                    
                }, function () {
                    alert("Geolocation service has failed");
                    initialLocation = new google.maps.LatLng(42.6975100, 23.3241500);
                    map.setCenter(initialLocation);
                });
            } 
            else {
                alert("Your deviced doesn't support Geolocation");
                initialLocation = new google.maps.LatLng(42.6975100, 23.3241500);
                map.setCenter(initialLocation);
            }
        }
  
        var parseAddress = function (address, id) {
            var geocoder = new google.maps.Geocoder();
            var res;
            geocoder.geocode( { 'address': address}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                res = results[0].geometry.location;
                var parsedAddress = new Everlive.GeoPoint(res.lng(), res.lat())
                Offers.stores.fetch(function() {
                    var dataItem = this.get(id);
                    dataItem.set("Geo", parsedAddress);
                    this.sync();
                })
                
            } else {
                //alert(errorMessages(status));
            }
            });
        }
        
        var drawRoute = function (originEverlive, destinationEverlive) {
            var request;
            var directionsService = new google.maps.DirectionsService();
            var origin = new google.maps.LatLng(originEverlive.latitude, originEverlive.longitude);
            var destination = new google.maps.LatLng(destinationEverlive.latitude, destinationEverlive.longitude);
            directionsRenderer.setMap(map);
            
            for (var i = 0; i < markers.length; i++) {
                console.log(markers[i]);
                markers[i].setVisible(false);
            }
            
            directionsRenderer.setOptions({
                draggable: true
            });
            
            google.maps.event.addListener(directionsRenderer, 'directions_changed', function () {
                computeTotalDistanceforRoute(directionsRenderer.directions);
            });
            
            request = {
                origin: origin,
                destination: destination,
                travelMode: google.maps.DirectionsTravelMode.DRIVING
            }
            
            directionsService.route(request, function (response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    directionsRenderer.setDirections(response);
                }
            });

        }
        
        return { 
            initMap: initMap,
            show: show,
            parseAddress: parseAddress,
            drawRoute: drawRoute,
            getCurrentCity: getCurrentCity
        };
    }());
    
    return mapObject;
}());