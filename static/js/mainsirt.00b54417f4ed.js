-function validateEmail(email) { 
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

$(function() {
    // send message popup
  $("body").on('click', '.send-channel-ctrl', function(){
    var $parent_ul = $(this).parents('ul'),
        $parent_li = $(this).parent(),
        $form = $(this).parents('form');
    if( !$parent_li.hasClass('inactive')){
      return;
    }
    $parent_ul.find('li').addClass('inactive');
    $parent_li.removeClass('inactive');
    $form.find('input[name="channel"]').val($(this).attr('data-channel'));
  })
  $("body").on('submit', "#SendMessageFrom", function(e){
    var $form = $(this),
        channel = $form.find('input[name="channel"]').val(),
        email = $form.find('input[name="email"]').val(),
        cc_email = $form.find('input[name="cc_to"]').val(),
        $emailErrorBlock = $form.find('.error_send_msg_email').parent();
        $ccEmailErrorBlock = $form.find('.error_send_msg_cc_email').parent();
    // validate the form
    if ($emailErrorBlock.length) {
        $emailErrorBlock.hide();
        if(channel == 'email'){
            if( !validateEmail(email)){
                $emailErrorBlock.show();
                return false;
            }
            if (cc_email && !validateEmail(cc_email)){
                $ccEmailErrorBlock.show();
                return false;
            }
        }
    }

    showLoading();
    if ($form.attr('data-ajax') == 'true'){
        $.post($form.attr('action'), $form.serialize(), function(data) {
            var invitationId = $form.find("input[name=invitation_id]").val();
            if( data.messages )
                updateMessages(data.messages);
            $form.parents('.modal').modal('hide');
            if( typeof quizesToTake !== 'undefined'){
                var phero_id = $form.find("input[name=phero_id]").val();
                quizesToTake.push({
                    'phero_id': phero_id,
                    'referral_type': 'invite',
                    'referral_id': invitationId
                });
            }
            if( $('#ref_response_card').length ){
                // if quizes are enabled, remember this invitation to show after all referrals are responded
                // if this is a tinder-like page, move to next candidate
                removeCarouselActiveItem(data.redirect_url);
            } else if($("#EmployeeDashboardTable").length){
                if (invitationId){
                    updateEmployeeDashboardItem("Invitation", invitationId)
                }
                if( typeof quizesToTake !== 'undefined'){
                    takeNextQuiz();
                }
            }
            hideLoading();
        });
        return false;
    }
  })
  $("body").on('submit', "#notfit_form", function(e){
    var $form = $(this);
    showLoading();
    if ($form.attr('data-ajax') == 'true'){
        $.post($form.attr('action'), $form.serialize(), function(data) {
            if (data.success){
                if( data.messages )
                    updateMessages(data.messages);
                $form.parents('.modal').modal('hide');
                if( $('#ref_response_card').length ){
                    // if this is a tinder-like page, move to next candidate
                    removeCarouselActiveItem(data.redirect_url);
                } else if($("#EmployeeDashboardTable").length){
                    var invitationId = $form.find("input[name=invite_id]").val();
                    if (invitationId){
                        updateEmployeeDashboardItem("Invitation", invitationId)
                    }
                }
            }
            else {
                $form.parents('.modal').html($(data.html).html());
            }
            hideLoading();
        });
        return false;
    }
  })
  // hr to contact form
  $("body").on('submit', "#hr_to_contact_form", function(e){
    var $form = $(this);
    showLoading();
    if ($form.attr('data-ajax') == 'true'){
        $.post($form.attr('action'), $form.serialize(), function(data) {
            if (data.success){
                if( data.messages )
                    updateMessages(data.messages);
                $form.parents('.modal').modal('hide');
                if( $('#ref_response_card').length ){
                    removeCarouselActiveItem(data.redirect_url);
                } else if($("#EmployeeDashboardTable").length){
                    var invitationId = $form.find("input[name=invite_id]").val();
                    if (invitationId){
                        updateEmployeeDashboardItem("Invitation", invitationId)
                    }
                }
            }
            else {
                $form.parents('.modal').html($(data.html).html());
            }
            hideLoading();
        });
        return false;
    }
  })

  // submit phero data correction
  $("body").on('submit', "#flagging_form", function(e){
    var $form = $(this);
    if ($form.attr('data-ajax') == 'true'){
        $.post($form.attr('action'), $form.serialize(), function(data) {
            if (data.success){
                if( data.messages )
                    updateMessages(data.messages);
                $form.parents('.modal').modal('hide');
            }
            else {
                $form.parents('.modal').html($(data.html).html());
            }
        });
        return false;
    }
  });

  // profile edit popup form
 $("#EditProfilePopupForm").submit(function(e){
    e.preventDefault();
    var $form = $(this),
        url = $form.attr('action');
    $form.find('.error-messages').each(function(){
        $(this).hide();
    })
    $.post(url, $form.serialize(), function(data) {
        if (data.success){
            if (data.redirect_url)
                window.location.href = data.redirect_url;
            else if (data.messages){
                updateMessages(data.messages);
                $form.parents('.modal').modal('hide');
            }
        }
        else{
            errors = data.errors
            for (var key in errors)
            {
              error_txt = errors[key]
              $form.find(".error_" + key).html(error_txt)
              $form.find(".error_" + key).parent().show();
            }
        }
    });  
  });
$("#EditProfileInitialPopupForm").submit(function(e){
    e.preventDefault();
    var $form = $(this),
        url = $form.attr('action');
    $form.find('.error-messages').each(function(){
        $(this).hide();
    })
    $.post(url, $form.serialize(), function(data) {
        if (data.success){
            $form.parents('.modal').modal('hide');
            $('#OnboardCompleteThanks').modal('show');
        }
        else{
            errors = data.errors
            for (var key in errors)
            {
              error_txt = errors[key]
              $form.find(".error_" + key).html(error_txt)
              $form.find(".error_" + key).parent().show();
            }
        }
    });  
  });

  // HR tracking page filter clicks
  $('body').on('click', '.hr-filter-tags li a', function(e){
    e.preventDefault();
    if ($(this).parent().hasClass('active')) return;
    var url = $(this).attr('href'),
        $activeTab = $(this).parents('.hr-filter-tags').find('li.active a'),
        prevFilter = $activeTab.attr('data-filter'),
        $listPanel = $(this).parents('.panel-collapse'),
        nextFilter = $(this).attr('data-filter');
    // if the filter was already called once, dont do ajax call
    if($listPanel.find('.hr-tr-list-table[data-tab="' + nextFilter + '"]').length){
        $listPanel.find('.hr-tr-list-table[data-tab="' + prevFilter + '"]').hide();
        $listPanel.find('.hr-tr-list-table[data-tab="' + nextFilter + '"]').show();
        showSubFilters(prevFilter, nextFilter);
    }
    else {
        $.get(url, {}, function(data){
            $listPanel.find('.hr-tr-list-table[data-tab="' + prevFilter + '"]').hide();
            $listPanel.append(data.html)
            $('.search-proj-cntrl').each(function() {
                showSearchPositions(this);
            });
            $('.search-msg-cntrl').each(function() {
                showSearchMsg(this);
            });
            showSubFilters(prevFilter, nextFilter);
        })
    }
    $activeTab.parent().removeClass('active')
    $(this).parent().addClass('active')
  })
  
  $('body').on('change', '#SRLForm #id_url, #SRLForm #id_cc_referral_msg_to_hr', function(e){
        var current_default_msg = $('#SRLForm #id_description').val(),
            default_msgs = [$('#recruit_dflt_message').val(), $('#recruit_dflt_message_no_url').val(),
                            $('#recruit_dflt_message_no_cc').val(), $('#recruit_dflt_message_no_url_no_cc').val()];
        if (default_msgs.indexOf(current_default_msg) > -1){
            var hasUrl = $('#SRLForm #id_url').val(),
                isCC = $('#SRLForm #id_cc_referral_msg_to_hr').prop('checked'),
                msg;
            if (hasUrl) {
                if(isCC)
                    msg = $('#recruit_dflt_message').val();
                else
                    msg = $('#recruit_dflt_message_no_cc').val();
            }
            else {
                if(isCC)
                    msg = $('#recruit_dflt_message_no_url').val();
                else
                    msg = $('#recruit_dflt_message_no_url_no_cc').val();
            }
            $('#SRLForm #id_description').val(msg);
        }
  });
    
  // pass welcome popup
  $("body").on('click', '#PassWelcomePopup', function(){
    var url = $(this).attr('data-url');
    $.post(url);
    $("#WelcomeToTeamable").modal('hide');
    $("#SocialLoginPopup").modal('show');
  })

  if($('input[name="location"]').length){
    $('input[name="location"]').autocomplete({
        source: '/resources/json/locations/',
        minLength: 2
    });
  }

// Legacy IE support

  $("body").on('change', '#uploader-li-legacy input[name="doccsv"]', function(){
      $(this).parents('form').submit();
      showLoading();
  })

  $("body").on('change', '.ai-bot-toggler', function(){
    var listId = $(this).parents('.list-item').attr('data-id'),
        url = '/referrals/update-bot-status/' + listId + '/',
        botEnabled = !$(this).prop('checked'),
        params = {'bot_enabled': botEnabled};
    $.post(url, params=params);
  })

    $("body").on('click', "#ID_ConfirmRemoveCandidate .confirm-ctrl", function(e){
        var url = $(this).attr('href');
        e.preventDefault();
        $.get(url, {}, function(data){
            if( data.messages )
                updateMessages(data.messages);
            $('#ID_ConfirmRemoveCandidate').modal('hide');
            if( data.entry_id )
                $(".hr-tr-list-table[data-list-entry=" + data.entry_id + "]").remove();            
        })
    })

// fade out any alert messages
if ($("#AlertMessages .alert").length){
    setTimeout(function(){ $("#AlertMessages .alert").fadeOut(1000) }, 2000);
}

  $("body").on('click', '#IdSubmitQuizPopup', function(){
      var $form = $(this).parents('form'),
          $popup = $(this).parents('.modal');
      showLoading();
      $popup.modal('hide');
      $.post($form.attr('action'), $form.serialize(), function(data){
        if (!data.success){
            if (data.html){
                $popup.replaceWith(html);
                $('#QuizPopup').modal('show');
            }
            else {
                alert("Something went wrong please try later")
            }
        }
        else {
            var redirectUrl = $form.find('input[name=redirect_url]').val();
            if(redirectUrl)
                takeNextQuiz(redirectUrl);
            else
                takeNextQuiz();
        }
        hideLoading();
      })
  });
  $("body").on('click', '#IdDiscardQuizPopup', function(){
    var $form = $(this).parents('form'),
      $popup = $('#QuizPopup');
    $popup.modal('hide');
    var redirectUrl = $form.find('input[name=redirect_url]').val();
    if(redirectUrl)
        takeNextQuiz(redirectUrl);
    else
        takeNextQuiz();
  });
  $("body").on('change', '#QuizFilterBlock input', function(){
    var $applicantsBlock = $(".funnel-tab-content.applicants");
    var $funnelBlock = $(".funnel-tab-content #funnelSentMes");
    var loadingDiv = '<div class="loading"><img src="/static/images/loading-circle.gif" style="margin:0 auto;display:block;" width="35" height="35"></div>'
    if ($applicantsBlock.length){
        $applicantsBlock.find('.tab-pane').each(function(){
            $(this).html(loadingDiv);
        })
        showFunnelTab($(".app-tabs li.active a"));
    }
    if ($funnelBlock.length){
        $funnelBlock.find('.table-accordion').html("");
        funnelPages['messages-sent']['page'] = 0;
        funnelPages['messages-sent']['allEntriesLoaded'] = false;
        loadNewEntries($('.funnel-tabs .active a'));
    }
  });
});
  var updateEmployeeDashboardItem = function(itemType, itemId){
    var $container = $("#EmployeeDashboardTable"),
        $updateElem, updateUrl;

    if (itemType === 'Suggestion') // note: this case isn't applied yet
        $updateElem = $container.find("tr[data-suggest-id=" + itemId + "]");
    else // Invitation 
        $updateElem = $container.find("tr[data-id=" + itemId + "]");
    updateUrl = $updateElem.attr('data-update-url');
    if(updateUrl){
        $.get(updateUrl, {}, function(data){
            if(data.success){
                $updateElem.replaceWith(data.html);
                $('.action-button-tip-emp').each(function() {
                    if ($(this).attr('data-hasqtip') === undefined)
                        showMoreActions(this);
                });
            } else {
                alert(data.errors);
            }
        })
    }
  };

var takeNextQuiz = function(fallbackUrl){
    if( typeof quizesToTake !== 'undefined' && quizesToTake.length){
        var nextQuiz = quizesToTake[0],
            url = '/referrals/quiz/' + nextQuiz['phero_id'] + '/',
            params = {
                'referral_type': nextQuiz['referral_type'],
                'referral_id': nextQuiz['referral_id'],
                'list_id': nextQuiz['list_id']
            };
        if (fallbackUrl)
            params['redirect_url'] = fallbackUrl
        $.get(url, params, function(data){
            var html = data.html;
            if ($("#QuizPopup").length) {
                $("#QuizPopup").replaceWith(html)
            }
            else {
                $("body").append(html)
            }           
            $('#QuizPopup').modal('show');
        });
        quizesToTake.splice(0, 1);
    }
    else if (fallbackUrl)
        window.location.href = fallbackUrl;
}

var get_quiz_filters = function(){
    var params = {}
    if($("#QuizFilterBlock").length){
        var connectivityFilters = [];
        if($("#QuizFilterBlock").find('input[name=academic_life]').prop('checked')){
            connectivityFilters.push('academic_life');
        }
        if($("#QuizFilterBlock").find('input[name=social_life]').prop('checked')){
            connectivityFilters.push('social_life');
        }
        if($("#QuizFilterBlock").find('input[name=prof_life]').prop('checked')){
            connectivityFilters.push('prof_life');
        }
        if( connectivityFilters.length ){
            params ['connectivity'] = connectivityFilters.join(";")
        }
        var likelihoodFilter = $("#QuizFilterBlock").find('input[name=rating-input-1]:checked').val();
        if (likelihoodFilter){
            params['likelihood'] = likelihoodFilter
        }
        var colleaguesFilter = $("#QuizFilterBlock").find('input[name=yes-no]:checked').val();
        if (colleaguesFilter){
            params['colleagues'] = colleaguesFilter
        }
    }
    return params
}