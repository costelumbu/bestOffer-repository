  var app;
var UsersData;

(function () {
    document.addEventListener('deviceready', function () {
        navigator.splashscreen.hide();
        app = new kendo.mobile.Application(document.body, {
            transition: 'slide',
            // comment out the following line to get a UI which matches the look
            skin: 'flat',
            initial: 'views/home.html'
        });
    }, false);
}());
var emptyGuid = '00000000-0000-0000-0000-000000000000';
var el = new Everlive({
    apiKey: 'hFumNF4NWU4mUzeT', // Put your Backend Services API key here
    scheme: 'http'
});

function LogIn(){
    console.log("in login");
     var username = $("#LogInUsername").val();
     var password = $("#LogInPassword").val();
     el.Users.login(username, password)
            .then(function () {
                    currentUserGet();
            })
            .then(function () {
                Offers.userViewModel.set("isLogged",true);
                Offers.userViewModel.set("isNotLogged",false);
                app.navigate('views/home.html');
                $("#modalview-login").kendoMobileModalView("close");
            })
            .then(null,
                  function (err) {
                      alert(err.message);
                  }
            );
}
function currentUserGet(){
    console.log("get current");
   el.Users.currentUser()
            .then(function (data) {
                var currentUserData = data.result;
                Offers.userViewModel.set("data",currentUserData);

           })
}
function setMenu(){
     var d=Offers.userViewModel.get("data");
    if (d && Offers.userViewModel.get("isLogged")){
     Offers.userViewModel.set("personal",!d.isBusiness);
        Offers.userViewModel.set("business",d.isBusiness)
       console.log(d);
    }
}

function clickLogged(){
    var x=Offers.userViewModel.get('data');
    console.dir(x);
     Offers.userViewModel.set("isLogged","false");
     Offers.userViewModel.set("isNotLogged","false");
    console.log(Offers.userViewModel.get("isLogged"));
    console.log(Offers.userViewModel.get("isNotLogged"));

}


var AppHelper = {

    // Return user profile picture url
    resolveProfilePictureUrl: function (id) {
        if (id && id !== emptyGuid) {
            console.log(id);
            return el.Files.getDownloadUrl(id);
        } else {
            return 'styles/images/appbuilder.png';
        }
    },

    // Return current activity picture url
    resolvePictureUrl: function (id) {
        if (id && id !== emptyGuid) {
            return el.Files.getDownloadUrl(id);
        } else {
            return '';
        }
    },

    // Date formatter. Return date in d.m.yyyy format
    formatDate: function (dateString) {
        return kendo.toString(new Date(dateString), 'MMM d, yyyy');
    },

    // Current user logout
    logout: function () {
        Offers.userViewModel.set("isLogged",false);
        Offers.userViewModel.set("isNotLogged",true);
        Offers.userViewModel.set("personal",false);
        Offers.userViewModel.set("business",false);
        return el.Users.logout();
    }
};
function Logout() {
            console.log("logging out")
            AppHelper.logout()
                .then(app.navigate('#home'))
        };        
function AllUsers() {
    el.Users.get().then(function (data) {
        UsersData = new kendo.data.ObservableArray(data.result);
    });
}
AllUsers();
//console.dir(activitiesDataSource);
 