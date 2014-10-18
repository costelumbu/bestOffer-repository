var app = app || {};
AddStore = (function () {
    'use strict';
    
    var AddViewModel = (function () {
        var dataSourceStore,UserUid,storeUid;
        var lastItemId,addr;
         var insertStore = function () {
             if (dataSourceStore.get("Name")&&dataSourceStore.get("Street")&&dataSourceStore.get("City")&&dataSourceStore.get("Phone")){
                  addr=dataSourceStore.get("Street")+", "+dataSourceStore.get("City");
                Map.parseAddress(addr);    
                 
                   
               
                     $("#modalviewAddStoreOrNot").data("kendoMobileModalView").open();
                         
             }
             else{alert("Please fill in all required fields")}
             
             
        }
        var init= function(){
             dataSourceStore = kendo.observable({
                UserId:'',
                Name:'',
                Street:'',
                City:'',
                Phone:'',
                 Geo:'',
                 Province:'',
                 isActive:true,
               });
            kendo.bind($('#signup-formStore'), dataSourceStore, kendo.mobile.ui);               
            
        }
        var checkYes= function(){
            console.log("check yes");
            var geo=Offers.userViewModel.get("AddressGeo");
             dataSourceStore.set("Geo",geo)
            Offers.stores.add(dataSourceStore);
               Offers.stores.one("change", function() {
                       var data = this.data();
                     var item=data[data.length-1];
                       lastItemId=item.Id;
                       app.navigate('views/addOfferView.html?uid=' + lastItemId);
                   });
                    Offers.stores.sync();
           
            
        }
         var checkNo= function(){
            console.log("check no");
             var geo=Offers.userViewModel.get("AddressGeo");
             dataSourceStore.set("Geo",geo)
             Offers.stores.add(dataSourceStore);
             Offers.stores.sync();
            app.navigate("views/home.html");
        }
          
         var show = function (e) {

            UserUid = e.view.params.uid;
            dataSourceStore.set("UserId",UserUid)
            console.log(dataSourceStore.get("UserId"));
            
        };
      
       
        return {
            init: init,
            show: show,
            insertStore: insertStore,
           checkYes:checkYes,
           checkNo:checkNo 
            
        };

    }());

    return AddViewModel;

}());

