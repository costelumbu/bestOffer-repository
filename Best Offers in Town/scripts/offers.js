//-------------- offers model
var Offers = (function () {
    'use strict'
    var offersModel = (function () {
        var offerModel = {

             Id: el.idField,
            fields: {
                 isActive:{
                    field: 'isActive'
                    
                },
                Title:{
                    field: 'Title',
                    defaultValue:''
                },
                Category: {
                    field: 'Category',
                    defaultValue: ''
                },
                
                Description: {
                    field: 'Description',
                    defaultValue: ''
                },
                InitialPrice: {
                    field: 'InitialPrice',
                    defaultValue: null
                },
                FinalPrice: {
                    field: 'FinalPrice',
                    defaultValue: null
                },
                Discount: {
                    field: 'Discount',
                    defaultValue: null
                },
                ExpirationDate: {
                    field: 'ExpirationDate'
                },
                FeaturedPicture: {
                    field: 'FeaturedPicture'
                },
                Pictures: {
                    field: 'Pictures'
                },
                NumberClicks: {
                    field: 'NumberClicks',
                    defaultValue: null
                },
                NumberPlannedRoutes: {
                    field: "NumberPlannedRoutes",
                    defaultValue: null,
                },
                 NumberWishlistAdds: {
                    field: "NumberWishlistAdds",
                    defaultValue: null,
                },
                 StoreIdRow: {
                    field: "StoreIdRow",
                    defaultValue: null,
                },
                StoreID: {
                    field: "StoreID",
                    defaultValue: null,
                },

            },
            calculateDiscount: function(){
                var calcDisc= 100-(this.FinalPrice*100/this.InitialPrice);
                calcDisc=kendo.parseInt(calcDisc);
                this.Discount=calcDisc;
                return calcDisc
            },
            
              ExpFormatDate: function() {
                return AppHelper.formatDate(this.get("ExpirationDate"));
            },
            PictureUrl: function () {
                return AppHelper.resolvePictureUrl(this.get('FeaturedPicture'));
            },
           
            Store: function(){
                var id=this.get('StoreID');
                var dataItem
                StoresDataSource.fetch(function() {
                         dataItem = StoresDataSource.get(id[0]);
                });

                 return dataItem ? {
                    Name:dataItem.Name,
                    Geo: dataItem.Geo,
                    City: dataItem.City
                } :{}
              
            },
           
     
            User: function () {
                var stores=[{}];
                var dataItem;
                var id=this.get('StoreID');
                StoresDataSource.fetch(function() {

                        dataItem = StoresDataSource.get(id[0]);
                      
                });
               // stores.shift();
                
                if (dataItem){ var userId = dataItem.UserId;
               // console.log(userId);
                }
                var user = $.grep(UsersData, function (e) {
                    return e.Id === userId;
                })[0];
                
                return user ? {
                    UserId:userId,
                    CompanyName: user.CompanyName,
                    PictureUrl: AppHelper.resolveProfilePictureUrl(user.Logo)
                } : {
                    DisplayName: 'Anonymous',
                    PictureUrl: AppHelper.resolveProfilePictureUrl()
                };
            }

        };
        
        
  
        var offersDataSource = new kendo.data.DataSource({
            type: 'everlive',
            schema: {
                model: offerModel
            },
            transport: {
                // Required by Backend Services
                typeName: 'Offers'
            },
            change: function (e) {

                if (e.items && e.items.length > 0) {
                    $('#no-activities-span').hide();
                } else {
                    $('#no-activities-span').show();
                }
            },
            filter:{field: "Store().City", operator:"eq", value:"Sofia"},
           // serverFiltering: true,
           // autoSync: true,
            sort: {
                field: 'CreatedAt',
                dir: 'desc'
            }
        }); 

    var StoresDataSource = new kendo.data.DataSource({
            type: 'everlive',
            schema: {
                model: {
                    Id: el.idField,
                    fields: {
                        isActive:{
                            field: 'isActive',
                            defaultValue:false
                            },
                        UserIdRaw:{
                            field: 'UserIdRaw',
                            defaultValue:''
                        },
                        UserId:{
                             field: 'UserId',
                            defaultValue:''
                        },
                        Name:{
                            field: 'Name',
                            defaultValue:''
                        },
                        City: {
                            field: 'City',
                            defaultValue: ''
                        },
                        Street: {
                            field: 'Street',
                            defaultValue: null
                        },
                        Phone: {
                            field: 'Phone',
                            defaultValue: null
                        },
        
                    },
                    getOffers: function(){
                        Offers.offers.fetch(function() {
                            var dataItem = this.data();
                            console.log(dataItem);


                        })
                    },
                },
            },
            transport: {
                // Required by Backend Services
                typeName: 'Stores'
            },
          sync: function(e) {
                console.log("sync complete");
              },  
        //autoSync: true,
        }); 
        return {
            offers: offersDataSource,
            stores: StoresDataSource,
        };  
    }());
    // Offers view model
    var offersViewModel = (function () {
        
        var userViewModel = kendo.observable({ 
             data: null,
            skin:'',
            changeSkin : function () {
            console.log(this.get("skin"))
              app.skin(this.get("skin"));
            }, 
            personal:false,
            business:false,
            isLogged:false,
            isNotLogged:true,
            ProdFilter:null,
            PriceMin:0,
            PriceMax:500,
            PriceSort:'asc',
            catFilter:'',
            cityFilter:'',
            
            CurrentGeo:new Everlive.GeoPoint(),
            CurrentCity:'Sofia',
            AddressGeo:new Everlive.GeoPoint(),
            
            moreOffers:false,
            
        });
        var  init= function(e) {
            console.log("offer init")
              $("#OffersListview").kendoMobileListView({
                dataSource: offersModel.offers,
                pullToRefresh: true,
                template: $("#activityTemplate").html(),
                pullParameters: function(item) {
                  console.log(item); // the last item currently displayed
                  return { since_id: item.Id };
                }
              });

            };

        // Navigate to activityView When some activity is selected
        var activitySelected = function (e) {

            app.navigate('views/insideOffer.html?uid=' + e.data.uid);
        };
        var itemToDelete
         var CheckDeleteStore = function(e){
             $("#modalviewCheckDeleteStore").kendoMobileModalView("open");
             console.log( e.data);
            itemToDelete=e.data;
            console.log(itemToDelete.Id);
        }
        var removeSelectedStore = function () {
            console.log("remove store")
           
            Offers.stores.remove(itemToDelete);
            Offers.stores.sync();
            $("#modalviewCheckDeleteStore").kendoMobileModalView("close");
            //var x=Offers.offers.get(item.Id);
           /* Offers.offers.fetch(function(){
                  var data = this.data();
                  console.log(data.length);
                for(var i=0; i<data.length; i++){
                    if (data[i].StoreID[0]===itemToDelete.Id){
                        console.log("delete");
                        Offers.offers.remove(data[i]);
                    }
                    }
                });*/

            
            
           // app.navigate('views/insideOffer.html?uid=' + e.data.uid);
        };
       
        
         var OfferToDelete
         var CheckDeleteOffer = function(e){
             $("#modalviewCheckDeleteOffer").kendoMobileModalView("open");
             console.log( e.data);
            OfferToDelete=e.data;
            console.log(OfferToDelete.Id);
        }
        var removeSelectedOffer = function () {
            console.log("remove offer")
           
            Offers.offers.remove(OfferToDelete);
            Offers.offers.sync();
            $("#modalviewCheckDeleteOffer").kendoMobileModalView("close");
           
        };

        // Logout user
        var logout = function () {
            console.log("logging out")
            AppHelper.logout()
                .then(app.navigate('#home'))
        };
        
            
        var search =function(){
            console.log(userViewModel.get("ProdFilter"));
            Offers.offers.filter({ field: "Title", operator: "startswith", value:userViewModel.get("ProdFilter")  })
        };
        var applyFilter= function () {
            console.log("apply filter");
               Offers.offers.filter([
                {"logic":"and",
                 "filters":[
                     {
                        "field":"FinalPrice",
                        "operator":"gte",
                        "value":parseInt(userViewModel.get("PriceMin"))},
                     {
                         "field":"FinalPrice",
                          "operator":"lte",
                          "value":parseInt(userViewModel.get("PriceMax"))},
                     {
                        "field":"Category",
                        "operator":"startswith",
                        "value":userViewModel.get("catFilter")},
                    {
                        "field":"Store().City",
                        "operator":"startswith",
                        "value":userViewModel.get("cityFilter")}
                   

                 ]},
            
                ]);
                   console.log(userViewModel.get("PriceSort"));
                  Offers.offers.sort({ field: "FinalPrice", dir: userViewModel.get("PriceSort") });   
                   $("#modalviewPriceFilter").kendoMobileModalView("close");
                    $("#modalviewCatFilter").kendoMobileModalView("close");
                    $("#modalviewLocFilter").kendoMobileModalView("close");
                 $("#homeTitle").text("Filtered Offers");
                 app.navigate("#home");
        };
       var removeFilterPrice = function(){
                   console.log("remove price");
                   userViewModel.set("PriceMin",0);
                    userViewModel.set("PriceMax",500); 
                    applyFilter();
                   

                   } ; 
         var removeFilterCat = function(){
                   console.log("remove cat");
                   userViewModel.set("catFilter","");
                   
                    applyFilter();

                   } ; 
        var removeCityFilter = function(){
                   console.log("remove locat");
                   userViewModel.set("cityFilter","");
                    applyFilter();
                   } ; 
         var removeAllFilters = function(){
                   console.log("remove all");
                   userViewModel.set("PriceMin",0);
                    userViewModel.set("PriceMax",500); 
                    userViewModel.set("catFilter","");
                  applyFilter();
                $("#homeTitle").text("Best Offers");
                   } ; 
       
        var backFromMore = function(){
            console.log("back");
            removeAllFilters();
             Offers.userViewModel.set("moreOffers",false);
             $("#homeTitle").text("Best Offers");
            app.navigate("#home")
            
        }
         var MyOffers2 = function(){
            var thisUserId= userViewModel.get("data").Id;
                         console.log(thisUserId)
            Offers.offers.filter({ field: "User().UserId", operator:"eq", value:thisUserId }); 
            Offers.userViewModel.set("moreOffers",true);
            console.log( Offers.userViewModel.get("moreOffers"));
            $("#homeTitle").text("My Offers");
            app.navigate("#home");
            
        };
         var MyOffers = function(){
            var thisUserId= userViewModel.get("data").Id;
            console.log(thisUserId)
            Offers.offers.filter([
                {"logic":"and",
                 "filters":[
                     {field: "User().UserId", operator:"eq", value:thisUserId }
                    ]},
            
                ]);
            
        };
          var MyStores = function(){
            var thisUserId= userViewModel.get("data").Id;
            console.log(thisUserId)
            Offers.stores.filter([
                {"logic":"and",
                 "filters":[
                     {field: "UserId", operator:"eq", value:thisUserId }
                    
                    ]},
            
                ]);
            
        };
        var show= function(){
            console.log("in show ")
          // console.log( Offers.userViewModel.get("AddressGeo"))
        }

        return {
            offers: offersModel.offers,
            stores: offersModel.stores,
            activitySelected: activitySelected,
            removeSelectedStore:removeSelectedStore,
            CheckDeleteStore:CheckDeleteStore,
            removeSelectedOffer:removeSelectedOffer,
            CheckDeleteOffer:CheckDeleteOffer,
            logout: logout,
            userViewModel:userViewModel,
            init:init,
            show:show,
           
            search:search,
            applyFilter:applyFilter,
            removeFilterPrice:removeFilterPrice,
            removeFilterCat:removeFilterCat,
            removeCityFilter:removeCityFilter,
            removeAllFilters:removeAllFilters,
            backFromMore:backFromMore,
            MyOffers:MyOffers,
            MyStores:MyStores
        };

    }());

    return offersViewModel;

}());
