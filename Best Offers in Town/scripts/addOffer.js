/**
 add offer
 */
var app = app || {};
AddOffer = (function () {
    'use strict';

    var AddOfferViewModel = (function () {
        
        var offerModel;
        var imageArray=[];
        var files = [];
        var $signUpForm;
        var $formFields;
        var $signupBtnWrp;
        var validator;
        var PictureUrl;
        
              
         var insertOffer = function () {

            offerModel.set("Images",imageArray) 
            Offers.offers.add(offerModel);
            //  Offers.offers.sync();
                        console.dir(offerModel);
             imageArray=[];
             files = [];
              $("#imagesList").kendoMobileListView({
                                dataSource: files,
                               template: "<img src='#: data #'width=90%>"
                               });  
             // $("#imagesList").kendoMobileListView().replace(); 
             //$("#imagesList").data("kendoMobileListView").replace();
             app.navigate("#home");
        };

       
        // Executed after show of the Signup view
        var show = function () {
            
            
            $signUpForm = $('#signUp');
            $formFields = $signUpForm.find('input, textarea, select');
            $signupBtnWrp = $('#signupBtnWrp');
            validator = $signUpForm.kendoValidator({ validateOnBlur: false }).data('kendoValidator');

            $formFields.on('keyup keypress blur change input', function () {
                if (validator.validate()) {
                    $signupBtnWrp.removeClass('disabled');
                } else {
                    $signupBtnWrp.addClass('disabled');
                }
            });
            
           offerModel = kendo.observable({
                    Description: '',
                    Discount: '',
                   Image: 'b58b5590-48dc-11e4-8588-977fab5601d8',
                   Images:[],
                    Price:'',
                    Title: '',
                    UserId:'',
                    Category:'',
                   ExpiresAt:null,
    
                    PictureUrl: function () {
        
                        return el.Files.getDownloadUrl(this.get('Image'))
                    },
                    
            });
            kendo.bind($('#AddOfferForm'), offerModel, kendo.mobile.ui);
            kendo.bind($('#addPictureView'), offerModel, kendo.mobile.ui);
            var x=Offers.userViewModel.get("data");
             offerModel.set("UserId",x.Id); 
                       
                       
        };
        
              
        var addImage= function () {
                var success = function (data) {
                     var file = {
                        "Filename": Math.random().toString(36).substring(2, 15) + ".jpg",
                        "ContentType": "image/jpeg",
                        "base64": data
                    };
                    
                    el.Files.create(file,
                        function (data) {
                            //alert(JSON.stringify(data));
                            console.dir(data.result);
                            imageArray.push(data.result.Id);
                            console.dir(imageArray);
                                     files.push(data.result.Uri);
                            console.dir(files);
                            $("#imagesList").kendoMobileListView({
                                dataSource: files,
                               template: "<img src='#: data #'width=90%>"
                               });         
                            offerModel.set("Image",data.result.Id);

                            
                        },
                        function (error) {
                            alert(JSON.stringify(error));
                        });
                    
                };
                var error = function () {
                    alert("Unfortunately we could not add the image");
                };
                var config = {
                    destinationType: Camera.DestinationType.DATA_URL,
                    targetHeight: 300,
                    targetWidth: 300
                };
                navigator.camera.getPicture(success, error, config);
         }
        var onSelectChange = function (sel) {
            var selected = sel.options[sel.selectedIndex].value;
            //sel.style.color = (selected == 0) ? '#b6c5c6' : '#34495e';
            console.log(selected)
        };
       
        return {
            show: show,
            addImage:addImage,
            PictureUrl:PictureUrl,
            insertOffer:insertOffer,
            onSelectChange:onSelectChange
           
            
        };

    }());

    return AddOfferViewModel;

}());

function test(){
    Signup.getPicId("")
}