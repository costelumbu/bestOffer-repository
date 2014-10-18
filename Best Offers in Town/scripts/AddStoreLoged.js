var app = app || {};
AddStoreLogged = (function () {
    'use strict';
    
    var AddViewModel = (function () {
        var StoreModel;
        var addr, lastItemId
         var insertStore = function () {
             if (StoreModel.get("Name")&&StoreModel.get("Street")&&StoreModel.get("City")&&StoreModel.get("Phone")){
                 addr=StoreModel.get("Street")+", "+StoreModel.get("City");
                Map.parseAddress(addr);      
                $("#modalviewMessage").data("kendoMobileModalView").open();
             }
             else{alert("Please fill in all required fields")}
             
             
        }
        var init= function(){
             StoreModel = kendo.observable({
                UserId:'',
                Name:'',
                Street:'',
                City:'',
                Phone:'',
                 Geo:'',
                 Province:'',
                 isActive:true,
               });
            kendo.bind($('#signup-formStoreLogged'), StoreModel, kendo.mobile.ui);               
            
        }
       
         var loadGeo= function(){
              var geo=Offers.userViewModel.get("AddressGeo");
             StoreModel.set("Geo",geo)
             Offers.stores.add(StoreModel);
                    Offers.stores.sync();
         } 
         var show = function () {

          var thisUserId= Offers.userViewModel.get("data").Id;
            console.log(thisUserId);
             StoreModel.set("UserId",thisUserId)
          
        };
      
       
        return {
            init: init,
            insertStore: insertStore,
            show:show,
            loadGeo:loadGeo
            
        };

    }());

    return AddViewModel;

}());
