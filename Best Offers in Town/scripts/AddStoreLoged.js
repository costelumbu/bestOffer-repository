var app = app || {};
AddStoreLogged = (function () {
    'use strict';
    
    var AddViewModel = (function () {
        var StoreModel;
         var insertStore = function () {
             if (StoreModel.get("Name")&&StoreModel.get("Street")&&StoreModel.get("City")&&StoreModel.get("Phone")){
                   //console.log(dataSourceStore);
                   Offers.stores.add(StoreModel);
                    Offers.stores.sync();
                   app.navigate("views/MyStores.html");      
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
               });
            kendo.bind($('#signup-formStoreLogged'), StoreModel, kendo.mobile.ui);               
            
        }
       
          
         var show = function () {

          var thisUserId= Offers.userViewModel.get("data").Id;
            console.log(thisUserId);
             StoreModel.set("UserId",thisUserId)
          
        };
      
       
        return {
            init: init,
            insertStore: insertStore,
            show:show
            
        };

    }());

    return AddViewModel;

}());
