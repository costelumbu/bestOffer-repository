
Offer = (function () {
    'use strict'
    var activityViewModel = (function () {
            var offerUid,
            activity
        var files= new kendo.data.ObservableArray([]);
        var init = function () {
          
             $("#scrollview").kendoMobileScrollView({
                   dataSource: files,
                   template: "<img src='#: data #'width=99%>",
                  contentHeight:300,
            enablePager: false
                });
            
        };
        
        var show = function (e) {
            files.splice(0, files.length)
            offerUid = e.view.params.uid;
            // Get current activity (based on item uid) from Activities model
            activity = Offers.offers.getByUid(offerUid);
            console.dir(activity.Store().Geo);
            kendo.bind(e.view.element, activity, kendo.mobile.ui);
             function logArrayElements(element, index, array) {
              //console.log('a[' + index + '] = ' + element);
                files.push(AppHelper.resolvePictureUrl(element));
            }
            activity.Pictures.forEach(logArrayElements);
            //console.dir(files);
            $(document).ready(function() {
                $("a#phone_number").attr("href","tel-999");
            });
          
        };
        
        var MoreFromShop = function(){
            console.log("MOre")
            var thisUserId=activity.User().UserId;
            console.log(thisUserId);
            Offers.offers.filter({ field: "User().UserId", operator:"eq", value:thisUserId }); 
            Offers.userViewModel.set("moreOffers",true);
            console.log( Offers.userViewModel.get("moreOffers"));
            $("#homeTitle").text("More from shop");
            app.navigate("#home");
            
        };
        
       var  planRoute =function(){
           console.log("Planning");
           if (activity.Store().Geo){
           Map.drawRoute(activity.Store().Geo);}
           app.navigate("views/map.html")
       }
        
        return {
            init: init,
            show: show,
            MoreFromShop:MoreFromShop,
            planRoute:planRoute,
            activity: function () {
                return activity;
            },
        };
        
    }());
    
    return activityViewModel;
    
    
}());

