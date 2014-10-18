var Map = (function () {
    'use strict'
    
    var mapObject = (function () {
        var map;
        var initialLocation;
        var current;
        var infowindow;

        var initMap = function () {
            var element = document.getElementById('map_canvas');
            var options = {
              mapTypeId: google.maps.MapTypeId.ROADMAP,
              zoom: 12
            };
            
            map = new google.maps.Map(element, options);
            Offers.stores.fetch(function() {
                var dataItem = this.get('455235d0-56c1-11e4-a799-8b449b438b8d');
                dataItem.set("Name", "UpdateSuccess");
                this.sync()
                console.log(dataItem);
            })
            
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
           }
        
        
        var showShops = function () {
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
                    dataItem.set("Geo", loc);
                    this.sync();
                })
                
            } else {
                //alert(errorMessages(status));
            }
            });
        }
        
        
        return { 
            initMap: initMap,
            showShops: showShops,
            parseAddress: parseAddress
        };
    }());
    
    return mapObject;
}());