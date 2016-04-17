function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
var csrftoken = getCookie('csrftoken');

function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
function sameOrigin(url) {
    // test that a given url is a same-origin URL
    // url could be relative or scheme relative or absolute
    var host = document.location.host; // host + port
    var protocol = document.location.protocol;
    var sr_origin = '//' + host;
    var origin = protocol + sr_origin;
    // Allow absolute or scheme relative URLs to same origin
    return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
        (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
        // or any other URL that isn't scheme relative or absolute i.e relative.
        !(/^(\/\/|http:|https:).*/.test(url));
}
$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && sameOrigin(settings.url)) {
            // Send the token to same-origin, relative URLs only.
            // Send the token only if the method warrants CSRF protection
            // Using the CSRFToken value acquired earlier
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});

/* validate email */
function validateEmail(email)
{
	var atpos=email.indexOf("@");
	var dotpos=email.lastIndexOf(".");
	if (atpos<1 || dotpos<atpos+2 || dotpos+2>=email.length)
	  return false;
	else
	  return true;
}

var menuOpened = 0;
$(document).ready(function(){
	var x=$(document).scrollTop()
	var y=$("body").attr("top")
	$('.menu_toggler').click(function(){
		$(document).trigger("resize")
		if($('body').hasClass('open_nav')){
			y=parseInt($("body").css("top"))*(-1);
			menuOpened = 0;
		}
		else{
			x=$(document).scrollTop()
			menuOpened = 1;
		}
		$('body').toggleClass('open_nav');
		if($('body').hasClass('open_nav')){
			$('body').css('top', -(x) + 'px');
		}
		else{
			$(document).scrollTop(y)
			$('body').removeAttr("style");
		}
	})
	$("div.mainwrap").click(function(){
		$('.open_nav .menu_toggler').trigger("click");
	})
	$("header a.get-started").click(function(){
		$("#lnkd-login").addClass("open"); 
	})
	$("section a.get-started").click(function(){
		$("#lnkd-login").addClass("open"); 
	})
	$("#email-open").click(function(){
		$(".popup-overlay").removeClass("open");
		$("#email-login").addClass("open");
	})
	$(".popup span.close").click(function(){
	
		$(".popup-overlay").removeClass("open");
	})
	$(".popup").click(function(event){
		event.stopPropagation();
	})
	/*$(".popup-overlay").click(function(){
		$(".popup-overlay").removeClass("open");
	})*/

	// do register/login by ajax
	$("#LoginRegisterForm").live('submit', function(e) {
		e.preventDefault();
		var $form = $( this ),
		    $btn = $form.find("input[type='submit']"),
       	            url = $form.attr('action');
		if (!validateEmail($form.find("input[name='email']").val())) {
		    alert("Please enter valid email address");
		    return false;
                }
		if (!$form.find("input[name='password']").val() ) {
		    alert("Please enter password");
		    return false;
                }
		$btn.addClass('busy');
		$btn.attr('disabled', 'disabled'); 
		$.post(url, $form.serialize(), function(data) {
            if (data.success) {
                if (data.redirect_url)
  	                window.location.href = data.redirect_url;
                else if (data.response_html) {
                	$(".popup-overlay").removeClass("open");
                	$(".mainbody-pane").find(".text").html(data.response_html);
                	$(".get-started").remove();
            	}
            }
	    else if (data.response_html)
	        $form.replaceWith(data.response_html);
	    $btn.removeClass('busy');
	    $btn.removeAttr('disabled'); 
		}); 
        return false;
	});
    $("#VerifyAccountForm").live('submit', function(e) {
        e.preventDefault();
        var $form = $( this ),
            $btn = $form.find("input[type='submit']"),
            url = $form.attr('action');
        if (!validateEmail($form.find("input[name='email']").val())) {
            alert("Please enter valid email address");
            return false;
        }
        $(".email-error").html("")
        $btn.addClass('busy');
        $btn.attr('disabled', 'disabled'); 
        $.post(url, $form.serialize(), function(data) {
            if (data.success) {
                if (data.response_html) {
                    $(".popup-overlay").removeClass("open");
                    $(".mainbody-pane").find(".text").html(data.response_html);
                    $(".get-started").remove();
                }
            }
            else if (data.error_msg)
                $(".email-error").html(data.error_msg)
            $btn.removeClass('busy');
            $btn.removeAttr('disabled'); 
        }); 
        return false;
    });
    $('.js-captcha-refresh').click(function(){
        $form = $(this).parents('form');

        $.getJSON($(this).data('url'), {}, function(json) {
            // This should update your captcha image src and captcha hidden input
            $form.find('input[name=captcha_0]').val(json.key);
            $form.find('img.captcha').attr('src', json.image_url);
        });

        return false;
    });
})

    // do register/login by ajax
    $("form[name='SIRTRegisterForm']").live('submit', function(e) {
        e.preventDefault();
        var $form = $( this ),
            $container = $(this).parents('#signupPopup'),
            $btn = $form.find("input[type='submit']"),
            url = $form.attr('action'),
            $landingText = $(".main-landing-txt"),
            email_error_msg = "Please enter valid email address",
            required_error_msg = "This field is required",
            passwords_not_match_error_msg = "The two password fields didn't match.";

        $form.find($(".error-messages span")).each(function(){
          $(this).html("");
        })
        $form.find("input").each(function(){
          $(this).removeClass("error");
        })
        has_error = false;
        if (!$form.find("input[name='first_name']").val()) {
            $form.find('span.error_first_name').html(required_error_msg);
            $form.find("input[name='first_name']").addClass('error')
            has_error = true;
        }
        if (!$form.find("input[name='last_name']").val()) {
            $form.find('span.error_last_name').html(required_error_msg);
            $form.find("input[name='last_name']").addClass('error')
            has_error = true;
        }
        if (!$form.find("input[name='email']").val()) {
            $form.find('span.error_username').html(required_error_msg);
            $form.find("input[name='email']").addClass('error')
            has_error = true;
        }
        if (!$form.find("input[name='password1']").val() ) {
            $form.find('span.error_password1').html(required_error_msg);
            $form.find("input[name='password1']").addClass('error')
            has_error = true;
        }
        if (!$form.find("input[name='password2']").val() ) {
            $form.find('span.error_password2').html(required_error_msg);
            $form.find("input[name='password2']").addClass('error')
            has_error = true;
        }
        if (!validateEmail($form.find("input[name='email']").val())) {
            $form.find('span.error_username').html(email_error_msg);
            $form.find("input[name='email']").addClass('error')
            has_error = true;
        }
        if ($form.find("input[name='password2']").val() != $form.find("input[name='password1']").val() ) {
            $form.find('span.error_password2').html(passwords_not_match_error_msg);
            $form.find("input[name='password2']").addClass('error')
            has_error = true;
        }
        if ($form.find("input[name='captcha_1']").length && !$form.find("input[name='captcha_1']").val()) {
            $form.find('span.error_captcha').html(required_error_msg);
            $form.find("input[name='captcha_1']").addClass('error')
            has_error = true;
        }
        if(has_error)
            return false;
        $btn.addClass('busy');
        $btn.attr('disabled', 'disabled'); 
        $.post(url, $form.serialize(), function(data) {
            if (!data.success){
                if (data.errors){
                    for (var key in data.errors)
                    {
                      error_txt = data.errors[key]
                      $form.find(".error_" + key).html(error_txt)
                    }
                }
                if (data.non_field_errors){
                    $form.find(".error_non_field_errors").html(data.non_field_errors)
                }
            }
            else {
                if (data.redirect_url)
                    window.location.href = data.redirect_url;
                if (data.response_html) {
                    //$(data.response_html).modal('show');
                    //$container.replaceWith($(data.response_html));
                    $container.modal('hide');
                    $landingText.replaceWith(data.response_html)
                }
            }
            if ($form.find("input[name='captcha_1']").length) {
                $form.find('input[name=captcha_0]').val(data.new_cptch_key);
                $form.find('img.captcha').attr('src', data.new_cptch_image);
            }
            $btn.removeClass('busy');
            $btn.removeAttr('disabled'); 
        }); 
        return false;
    });
    $("form[name='SIRTLoginForm']").live('submit', function(e) {
        e.preventDefault();
        var $form = $( this ),
            $container = $(this).parents('#loginPopup'),
            $btn = $form.find("input[type='submit']"),
            url = $form.attr('action'),
            email_error_msg = "Please enter valid email address",
            required_error_msg = "This field is required";

        $form.find(".error-messages span").each(function(){
          $(this).html("");
        })
        $form.find("input").each(function(){
          $(this).removeClass("error");
        })
        has_error = false;
        if (!$form.find("input[name='email']").val()) {
            $form.find('span.error_username').html(required_error_msg);
            $form.find("input[name='email']").addClass('error')
            has_error = true;
        }
        if (!$form.find("input[name='password']").val() ) {
            $form.find('span.error_password').html(required_error_msg);
            $form.find("input[name='password']").addClass('error')
            has_error = true;
        }
        if (!validateEmail($form.find("input[name='email']").val())) {
            $form.find('span.error_username').html(email_error_msg);
            $form.find("input[name='email']").addClass('error')
            has_error = true;
        }
        if ($form.find("input[name='captcha_1']").length && !$form.find("input[name='captcha_1']").val()) {
            $form.find('span.error_captcha').html(required_error_msg);
            $form.find("input[name='captcha_1']").addClass('error')
            has_error = true;
        }
        if(has_error)
            return false;
        $btn.addClass('busy');
        $btn.attr('disabled', 'disabled'); 
        $.post(url, $form.serialize(), function(data) {
            if (data.redirect_url)
                window.location.href = data.redirect_url;
            if (data.response_html) {
                //$container.modal('hide');
                //$(data.response_html).modal('show');
                $container.replaceWith($(data.response_html));
            }
            if (data.errors){

                for (var key in data.errors)
                {
                  error_txt = data.errors[key]
                  $form.find(".error_" + key).html(error_txt)
                }
            }
            if (data.non_field_errors){
                $form.find(".error_non_field_errors").html(data.non_field_errors)
            }
            $btn.removeClass('busy');
            $btn.removeAttr('disabled'); 

            if ($form.find("input[name='captcha_1']").length) {
                $form.find('input[name=captcha_0]').val(data.new_cptch_key);
                $form.find('img.captcha').attr('src', data.new_cptch_image);
            }
        }); 
        return false;
    });

var showLoading = function(){
    if ($('#overlay').length )
        $('#overlay').show();
    else {
       var docHeight = $(document).height();
       $("body").append("<div id='overlay' class='loader'><div></div></div>");
       $("#overlay")
          .height(docHeight)
          .css({
             'opacity' : 0.6,
             'position': 'absolute',
             'top': 0,
             'left': 0,
             'background-color': 'white',
             'width': '100%',
             'z-index': 10000
          });
    }
}
var hideLoading = function(){ $('#overlay').hide(); pageBusy=false;};