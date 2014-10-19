/**
 add offer
 */
var app = app || {};
AddOffer = (function () {
    'use strict';

    var AddOfferViewModel = (function () {
        
        var offerModel;
        var imageArray=[];
        var files = [];
        var PictureUrl;
        var StoreUid;
        
              
         var insertOffer = function () {

            offerModel.set("Pictures",imageArray) 
            Offers.offers.add(offerModel);
              Offers.offers.sync();
                        console.dir(offerModel);
             imageArray=[];
             files = [];
              $("#imagesList").kendoMobileListView({
                                dataSource: files,
                               template: "<img src='#: data #'width=90%>"
                               });  
             app.navigate("views/home.html");
             alert("Your offer is succesfully added")
             
        };
        var init= function(){
            offerModel = kendo.observable({
                    Category:'',
                    Description: '',
                    Discount: '',
                    ExpirationDate:'',
                   FeaturedPicture: 'b58b5590-48dc-11e4-8588-977fab5601d8',
                   Pictures:[],
                    FinalPrice:'',
                    InitialPrice: '',
                    StoreID:[],
                    Title:'',
                   isActive:true,

                    PictureUrl: function () {
        
                        return el.Files.getDownloadUrl(this.get('FeaturedPicture'))
                    },
                    
            });
            kendo.bind($('#AddOfferForm'), offerModel, kendo.mobile.ui);
            kendo.bind($('#addPictureView'), offerModel, kendo.mobile.ui);
        }
       
        // Executed after show of the Signup view
        var show = function (e) {
          
             StoreUid = e.view.params.uid;
            offerModel.StoreID.push(StoreUid)
            console.log(offerModel.get("StoreID"));
          
                       
                       
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
                            console.dir(data.result);
                            imageArray.push(data.result.Id);
                            console.dir(imageArray);
                                     files.push(data.result.Uri);
                            console.dir(files);
                            $("#imagesList").kendoMobileListView({
                                dataSource: files,
                               template: "<img src='#: data #'width=90%>"
                               });         
                            offerModel.set("FeaturedPicture",data.result.Id);

                            
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
                    targetHeight: 300,
                    targetWidth: 300
                };
                navigator.camera.getPicture(success, error, config);
         }
        var onSelectChange = function (sel) {
            var selected = sel.options[sel.selectedIndex].value;
            console.log(selected)
        };
       
        return {
            show: show,
            init:init,
            addImage:addImage,
            PictureUrl:PictureUrl,
            insertOffer:insertOffer,
            onSelectChange:onSelectChange
           
            
        };

    }());

    return AddOfferViewModel;

}());

function test(){
    Signup.getPicId("")
}