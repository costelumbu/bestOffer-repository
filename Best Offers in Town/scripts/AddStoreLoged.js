var app = app || {};
AddStoreLogged = (function () {
    'use strict';
    
    var AddViewModel = (function () {
        var StoreModel;
         var insertStore = function () {
             if (StoreModel.get("Name")&&StoreModel.get("Street")&&StoreModel.get("City")&&StoreModel.get("Phone")){
                   //console.log(dataSourceStore);
                   Offers.stores.add(StoreModel);
                     Offers.stores.one("change", function() {
                           var data = this.data();
                         var item=data[data.length-1];
                           var lastItemId=item.Id;

                           var addr=StoreModel.get("Street")+", "+StoreModel.get("City");
                           console.log(addr); 
                         console.log(lastItemId)
                           Map.parseAddress(addr,lastItemId);
                       });
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
                 isActive:true,
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
