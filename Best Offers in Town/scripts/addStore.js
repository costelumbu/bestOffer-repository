var app = app || {};
AddStore = (function () {
    'use strict';

    var AddViewModel = (function () {
        var dataSourceStore,UserUid,addOffer;
         
         var insertStore = function () {
           console.log(dataSourceStore);
           Offers.stores.add(dataSourceStore);
            Offers.stores.sync();
             app.navigate('views/addOfferView.html?uid=' + data.result.Id);
             
             
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
               });
            kendo.bind($('#signup-formStore'), dataSourceStore, kendo.mobile.ui);               
            
        }
        var checkAdd= function(e){
            
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
           
            
        };

    }());

    return AddViewModel;

}());

