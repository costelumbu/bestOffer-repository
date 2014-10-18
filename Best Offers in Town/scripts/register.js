/**
 * Signup view model
 */
var app = app || {};
Signup = (function () {
    'use strict';

    var singupViewModel = (function () {
        var dataSourcePers, dataSourceBus,dataSourceStore;
        
        
       
        var pers=false;
        var bus=false;
        var PictureUrl;
        
        
        
        var  onSelect= function(e) {
            var buttonGroup = e.sender;
            var index = buttonGroup.current().index();
            if (index===0){this.set("pers",true);this.set("bus",false);}
            if (index===1){this.set("pers",false);this.set("bus",true);}
        }
       
        // Register user after required fields (username and password) are validated in Backend Services
        var signupPers = function () {

            Everlive.$.Users.register(
                dataSourcePers.Username,
                dataSourcePers.Password,
                dataSourcePers)
            .then(function () {
                alert("Registration successful");
                AllUsers();
                app.navigate('#home');
                
            },
            function (err) {
                alert(err.message);
            });
        };
         var signupBus = function () {

            Everlive.$.Users.register(
                dataSourceBus.Username,
                dataSourceBus.Password,
                dataSourceBus)
            .then(function (data) {
                console.log(data.result.Id)
                AllUsers();
                app.navigate('views/RegisterViewStores.html?uid=' + data.result.Id);
            },
            function (err) {
                alert(err.message);
            });
        };

        // Executed after Signup view initialization
        // init form validator
        var init = function () {
            console.log("init");

            
        }

        var show = function () {
          Offers.stores.fetch(function() {
                var dataItem = Offers.stores.data()
                 console.log(dataItem);
             });
            dataSourcePers = kendo.observable({
                DisplayName: '',
                Email: '',
                Username: '',
                Password: '',
                isBusiness:false
            });
            kendo.bind($('#signup-formPers'), dataSourcePers, kendo.mobile.ui);
            dataSourceBus = kendo.observable({
                CompanyName: '',
                Email: '',
                Username: '',
                Password: '',
                isBusiness:true,
                Picture:'c717e650-5667-11e4-9793-595ba64727f8',
                
                PictureUrl: function(){
                    return el.Files.getDownloadUrl(this.get('Picture'))
                },
               });
            kendo.bind($('#signup-formBus'), dataSourceBus, kendo.mobile.ui);
           kendo.bind($('#addPicView'), dataSourceBus, kendo.mobile.ui);
             dataSourceStore = kendo.observable({
                UserId:'',
                Name:'',
                Street:'',
                City:'',
                Phone:'',
               });
            kendo.bind($('#signup-formStore'), dataSourceStore, kendo.mobile.ui);               
            
            
        };
       

        var onSelectChange = function (sel) {
            var selected = sel.options[sel.selectedIndex].value;
            //sel.style.color = (selected == 0) ? '#b6c5c6' : '#34495e';
            console.log(selected)
        };
              
        var addImage= function () {
                var success = function (data) {
                     var file = {
                        "Filename": Math.random().toString(36).substring(2, 15) + ".jpg",
                        "ContentType": "image/jpeg",
                        "base64": data
                    };
                    
                    el.Files.create(file,
                        function (data) {
                            //alert(JSON.stringify(data));
                            console.dir(data.result.Id);
                            dataSourceBus.set("Picture",data.result.Id)
                            
                        },
                        function (error) {
                            alert(JSON.stringify(error));
                        });
                    
                };
                var error = function () {
                    alert("Unfortunately we could not add the image");
                };
                var config = {
                    destinationType: Camera.DestinationType.DATA_URL,
                    targetHeight: 200,
                    targetWidth: 200
                };
                navigator.camera.getPicture(success, error, config);
         }
       
        return {
            init: init,
            show: show,
            onSelectChange: onSelectChange,
            signupPers: signupPers,
            signupBus: signupBus,            
            pers:pers,
            bus:bus,
            onSelect:onSelect,
            addImage:addImage,
            PictureUrl:PictureUrl,
           
            
        };

    }());

    return singupViewModel;

}());

function test(){
    Signup.getPicId("")
}