$(function() {

	$('body').hide().fadeIn('slow');

	$('#ResetPass').on('shown.bs.modal', function () {

		$('#loginPopup').modal('hide');

	})

	$('#ThankYou').on('shown.bs.modal', function () {

		$('#signupPopup').modal('hide');

	})

});

$('#editEmailPopup').click(function(event){
  event.stopPropagation();
});

//browser detect

var ListConteiner = $('ol.social-connect-steps').find('li.detect-browser');
var ListConteinerIe = $('ol.social-connect-steps').find('li.ie-only');
var browserDetected = false;

detectBrowserChrome = function(){
  $(ListConteiner).append('<div class="clearfix"><img src="/static/images/browsers/chrome.jpg" alt="linkedin drag contacts" title="Linkedin drag contacts" class="m-b-10 img-responsive"><p>Drag your contacts file from the bottom left corner of your window onto the Upload bar below.</p></div>')
}

detectBrowserFFMac = function(){
  $(ListConteiner).append('<div class="clearfix"><img src="/static/images/browsers/mac/firefox.png" alt="linkedin drag contacts" title="Linkedin drag contacts" class="m-b-10 img-responsive"><p>Drag your contacts file from the upper right corner of your window into the Upload bar below.</p></div>')
}
detectBrowserFFWin = function(){
  $(ListConteiner).append('<div class="clearfix"><img src="/static/images/browsers/firefox.png" alt="linkedin drag contacts" title="Linkedin drag contacts" class="m-b-10 img-responsive"><p>Drag your contacts file from the upper right corner of your window into the Upload bar below.</p></div>')
}
detectBrowserSafari = function(){
  $(ListConteiner).append('<div class="clearfix"><img src="/static/images/browsers/mac/safari.png" alt="linkedin drag contacts" title="Linkedin drag contacts" class="m-b-10 img-responsive"><p>Drag your contacts file from the upper right corner of your window into the Upload bar below.</p></div>')
}
detectBrowserOpera = function(){
  $(ListConteiner).append('<div class="clearfix"><img src="/static/images/browsers/opera.png" alt="linkedin drag contacts" title="Linkedin drag contacts" class="m-b-10 img-responsive"><p>Drag your contacts file from the bottom left corner of your window onto the Upload bar below.</p></div>')
}
detectBrowserIE = function(){
  $(ListConteiner).find('.display-explorer').css('display', 'block');
  $(ListConteinerIe).css('display', 'block');
}
detectBrowserLegacyIE = function(){
  $(ListConteiner).append('<div class="clearfix">' + '<img src="/static/images/browsers/ie_1.png" alt="linkedin drag contacts" title="Linkedin drag contacts" class="m-b-10" style="max-width:460px">' 
    + '<p>Save the downloaded file somewhere easy to find ' + '<br/>' + 'like Desktop</p>'+'</div>');
  $(ListConteinerIe).css('display', 'block');
  $("#uploader-li").hide();
  $("#uploader-li-legacy").show();
}

$('#SocialConnectAccount').on('shown.bs.modal', function (e){


  if(browserDetected){
      
      return false;
    
  }

  if (browser_detect.OS === 'Mac') {

    if (browser_detect.browser === 'Safari') {
               detectBrowserSafari();
    }

    if (browser_detect.browser === 'Chrome') {
                detectBrowserChrome();
    }

    if (browser_detect.browser === 'Firefox') {
                detectBrowserFFMac();
    }
                
  }

  if (browser_detect.OS === 'Windows') {
        
            if (browser_detect.browser === 'Chrome') {
                detectBrowserChrome();
            }
            if (browser_detect.browser === 'Firefox') {
                detectBrowserFFWin();
            }
            if (browser_detect.browser === 'Opera') {
                detectBrowserOpera();
            }
            if (browser_detect.browser === 'Explorer') {
                detectBrowserIE();
            }

            if (browser_detect.browser != 'Safari' && browser_detect.browser != 'Chrome' && browser_detect.browser != 'Firefox' && browser_detect.browser != 'Opera') {
                detectBrowserIE();  
            }
  }

   if (browser_detect.OS === 'Linux') {

       if (browser_detect.browser === 'Chrome') {
                detectBrowserChrome();
        }
        
        if (browser_detect.browser === 'Firefox') {
                detectBrowserFFWin();
        }
   }

    browserDetected = true;
     
 });

//collaps outlook wizard
ShowMoreNetwors = function() {
	var sliderText = $('.slider-txt-cntr');
	var slideConteiner = $('.add-more-networks');

	$(sliderText).next($(slideConteiner)).slideToggle( 400 , function() {
		 if ($('.slider-txt-cntr').text() === 'connect more networks'){
                    $('.slider-txt-cntr').text('hide networks');
                }
         else {
         	$('.slider-txt-cntr').text('connect more networks');
         }

	});	
}

slideDownOut2010 = function() {

  $('.btn-out-2010').parents().find('.outlook-2010').slideToggle( function(){
    
    $(this).perfectScrollbar({
                    wheelSpeed: 2,
                    wheelPropagation: true,
                    minScrollbarLength: 10
                });
  
  });

  $('.btn-out-2010').parents().find('.outlook-2013').slideUp();

}

slideDownOut2013 = function() {

  $('.btn-out-2013').parents().find('.outlook-2013').slideToggle( function(){
  
    
    $(this).perfectScrollbar({
                    wheelSpeed: 2,
                    wheelPropagation: true,
                    minScrollbarLength: 10
                });

  });

  $('.btn-out-2013').parents().find('.outlook-2010').slideUp();

}

//hide show modals on close
$('#SocialGmLearMore, #SocialCsvLearMore, #SocialConnectAccount, #SocialConnectAccountOutlook').on('hide.bs.modal', function (e) {
    $('#SocialLoginPopup').modal('show');
});

// added new social popup wizard content to show

socialWizard = function() {
  var btn = $('a.btn-wizard-next');
  $(btn).parents().find('.social-landing-login').hide();
  $(btn).parents().find('.social-connect-txt').hide();
  $(btn).parents().find('.social-connect-next').show();
  $(btn).parents().find('.btn-wizard-back').show();
//  $(btn).text('Done');

}

socialWizardBack = function() {
  var btn = $('a.btn-wizard-back');
  var closeModal = $(btn).parents().find('a.btn-wizard');
  $(btn).parents().find('.social-landing-login').show();
  $(btn).parents().find('.social-connect-txt').show();
  $(btn).parents().find('.social-connect-next').hide();
 // $(btn).hide();
  //$(closeModal).text('Next');
}

// $("body").on("click", "a.btn-wizard", function() {
//   if($(this).text() === 'Done') {
//         $('#SocialLoginPopup').modal('hide');
  
//   }
//   else if($(this).text() != 'done') {
//     socialWizard();
//     event.stopPropagation();
//   }

// });