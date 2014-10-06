
Offer = (function () {
    'use strict'
        
    var $commentsContainer,
        listScroller;
    
    var activityViewModel = (function () {
            var activityUid,
            activity,
            $activityPicture;
        var files= new kendo.data.ObservableArray([]);
        var init = function () {
          
           // $commentsContainer = $('#comments-listview');
           // $activityPicture = $('#picture');
             
                       
           
             $("#scrollview").kendoMobileScrollView({
                   dataSource: files,
                   template: "<img src='#: data #'width=99%>",
                  contentHeight:300,
            enablePager: false
                });
            
        };
        
        var show = function (e) {
            files.splice(0, files.length)
             $commentsContainer = $('#comments-listview');
            $activityPicture = $('#picture');
            activityUid = e.view.params.uid;
            // Get current activity (based on item uid) from Activities model
            activity = Offers.offers.getByUid(activityUid);
           // console.dir(activity);
            kendo.bind(e.view.element, activity, kendo.mobile.ui);
            


             function logArrayElements(element, index, array) {
              console.log('a[' + index + '] = ' + element);
                files.push(AppHelper.resolvePictureUrl(element));
            }
            activity.Images.forEach(logArrayElements);
            console.dir(files);
          
        };
        
        var MoreFromShop = function(){
            console.log("MOre")
            var thisUserId=activity.UserId;
            Offers.offers.filter({ field: "UserId", operator:"eq", value:thisUserId }); 
            Offers.userViewModel.set("moreOffers",true);
            console.log( Offers.userViewModel.get("moreOffers"))
            app.navigate("#home");
            
        };
        
        var removeActivity = function () {
            
            var activities = Offers.offers;
            var activity = activities.getByUid(activityUid);
            
            app.showConfirm(
                appSettings.messages.removeActivityConfirm,
                'Delete Activity',
                function (confirmed) {
                    if (confirmed === true || confirmed === 1) {
                        
                        activities.remove(activity);
                        activities.one('sync', function () {
                            app.mobileApp.navigate('#:back');
                        });
                        activities.sync();
                    }
                }
            );
        };
        
        return {
            init: init,
            show: show,
            MoreFromShop:MoreFromShop,
           // remove: removeActivity,
            activity: function () {
                return activity;
            },
        };
        
    }());
    
    return activityViewModel;
    
    
}());

