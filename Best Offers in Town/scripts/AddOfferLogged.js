/**
 add offer
 */
var app = app || {};
AddOfferLogged = (function () {
    'use strict';

    var AddOfferViewModel = (function () {
        
        var offerModel;
        var imageArray=[];
        var files = [];
        var PictureUrl;
       var SelectedStore = kendo.observable({ 
             Name: '',
            Id:null})
        
              
         var insertOffer = function () {
            offerModel.StoreID.push(SelectedStore.get("Id"));
            offerModel.set("Pictures",imageArray);
            offerModel.set("FeaturedPicture",imageArray[0]);
            Offers.offers.add(offerModel);
              Offers.offers.sync();
                        console.dir(offerModel);
             imageArray=[];
             files = [];
              $("#imagesList").kendoMobileListView({
                                dataSource: files,
                               template: "<img src='#: data #'width=90%>"
                               });  
             alert("Your offer is succesfully added");
             app.navigate("views/home.html");
             
             
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
            kendo.bind($('#AddOfferFormLogged'), offerModel, kendo.mobile.ui);
            kendo.bind($('#addPictureView'), offerModel, kendo.mobile.ui);
            
            var thisUserId= Offers.userViewModel.get("data").Id;
            console.log(thisUserId)
            Offers.stores.filter([
                {"logic":"and",
                 "filters":[
                     {field: "UserId", operator:"eq", value:thisUserId }
                    
                    ]},
            
                ]);
        }
       var getStore= function(e){
          console.log( e.dataItem.Id);
           SelectedStore.set("Name",e.dataItem.Name);
            SelectedStore.set("Id",e.dataItem.Id);
           
            
       }
        var show = function () {
          
             

                       
                       
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
            onSelectChange:onSelectChange,
            getStore:getStore,
            SelectedStore:SelectedStore
           
            
        };

    }());

    return AddOfferViewModel;

}());

function test(){
    Signup.getPicId("")
}