//-------------- offers model
var Offers = (function () {
    'use strict'
    var offersModel = (function () {

        var offerModel = {

            id: 'Id',
            fields: {
                Category:{
                    field: 'category',
                    defaultValue:''
                },
                Description: {
                    field: 'description',
                    defaultValue: ''
                },
                Discount: {
                    field: 'discount',
                    defaultValue: ''
                },
                Image: {
                    field: 'Image',
                    defaultValue: null
                },
                Images: {
                    field: 'Images',
                    defaultValue: null
                },
                Location: {
                    field: 'location'
                },
                Price: {
                    field: 'price'
                },
                Title: {
                    field: 'title'
                },
                UserId: {
                    field: 'userID',
                    defaultValue: null
                },

            },

            PictureUrl: function () {

                return AppHelper.resolvePictureUrl(this.get('Image'));
            },
            User: function () {

                var userId = this.get('UserId');
                //console.log(userId);
                var user = $.grep(usersData, function (e) {
                    return e.Id === userId;
                })[0];
                //console.log(usersData);

                return user ? {
                    DisplayName: user.DisplayName,
                    PictureUrl: AppHelper.resolveProfilePictureUrl(user.Picture)
                } : {
                    DisplayName: 'Anonymous',
                    PictureUrl: AppHelper.resolveProfilePictureUrl()
                };
            },
             
            /*
            isVisible: function () {
                var currentUserId = app.Users.currentUser.data.Id;
                var userId = this.get('UserId');

                return currentUserId === userId;
            }*/
        };
        
          
        var offersDataSource = new kendo.data.DataSource({
            type: 'everlive',
            schema: {
                model: offerModel
            },
            transport: {
                // Required by Backend Services
                typeName: 'offers2'
            },
            change: function (e) {

                if (e.items && e.items.length > 0) {
                    $('#no-activities-span').hide();
                } else {
                    $('#no-activities-span').show();
                }
            },
           // serverFiltering: true,
            autoSync: true,
            sort: {
                field: 'CreatedAt',
                dir: 'desc'
            }
        }); //console.dir(activitiesDataSource);

        return {
            offers: offersDataSource
        };  
    }());
    // Activities view model
    var offersViewModel = (function () {
        
        var userViewModel = kendo.observable({ 
             data: null,
            personal:false,
            business:false,
            isLogged:false,
            isNotLogged:true,
            ProdFilter:null,
            PriceMin:0,
            PriceMax:500,
            PriceSort:'asc',
            catFilter:'',
            
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
                  return { since_id: item.name };
                }
              });

            };

        // Navigate to activityView When some activity is selected
        var activitySelected = function (e) {

            app.navigate('views/insideOffer.html?uid=' + e.data.uid);
        };

        // Navigate to app home
        var navigateHome = function () {

            app.navigate('#home');
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
                        "field":"Price",
                        "operator":"gte",
                        "value":parseInt(userViewModel.get("PriceMin"))},
                     {
                         "field":"Price",
                          "operator":"lte",
                          "value":parseInt(userViewModel.get("PriceMax"))},
                     {
                        "field":"Category",
                        "operator":"startswith",
                        "value":userViewModel.get("catFilter")},
                 ]},
            
                ]);
                   console.log(userViewModel.get("PriceSort"));
                  Offers.offers.sort({ field: "Price", dir: userViewModel.get("PriceSort") });   
                   $("#modalviewPriceFilter").kendoMobileModalView("close");
                    $("#modalviewCatFilter").kendoMobileModalView("close");
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
         var removeAllFilters = function(){
                   console.log("remove all");
                  userViewModel.set("PriceMin",0);
                    userViewModel.set("PriceMax",500); 
                    userViewModel.set("catFilter","");
                   Offers.offers.filter([]);
                $("#homeTitle").text("Best Offers");
                   } ; 
        var backFromMore = function(){
            console.log("back");
            removeAllFilters();
             Offers.userViewModel.set("moreOffers",false);
             $("#homeTitle").text("Best Offers");
            app.navigate("#home")
            
        }
         var MyOffers = function(){
            var thisUserId= userViewModel.get("data").Id;
                         console.log(thisUserId)
            Offers.offers.filter({ field: "UserId", operator:"eq", value:thisUserId }); 
            Offers.userViewModel.set("moreOffers",true);
            console.log( Offers.userViewModel.get("moreOffers"));
            $("#homeTitle").text("My Offers");
            app.navigate("#home");
            
        };

        return {
            offers: offersModel.offers,
            activitySelected: activitySelected,
            logout: logout,
            userViewModel:userViewModel,
            init:init,
           
            search:search,
            applyFilter:applyFilter,
            removeFilterPrice:removeFilterPrice,
            removeFilterCat:removeFilterCat,
            removeAllFilters:removeAllFilters,
            backFromMore:backFromMore,
            MyOffers:MyOffers
        };

    }());

    return offersViewModel;

}());
