//= require Chart.bundle
//= require chartkick
//= require moment
//= require EpicEditor
//= require daterangepicker
//= require jquery.fix.clone
//= require blueimp-file-upload/js/vendor/jquery.ui.widget
//= require blueimp-tmpl/js/tmpl.min
//= require blueimp-load-image/js/load-image.all.min
//= require blueimp-canvas-to-blob/js/canvas-to-blob.min
//= require blueimp-file-upload/js/jquery.iframe-transport
//= require blueimp-file-upload/js/jquery.fileupload
//= require blueimp-file-upload/js/jquery.fileupload-process
//= require blueimp-file-upload/js/jquery.fileupload-image
//= require blueimp-file-upload/js/jquery.fileupload-audio
//= require blueimp-file-upload/js/jquery.fileupload-video
//= require blueimp-file-upload/js/jquery.fileupload-validate
//= require blueimp-file-upload/js/jquery.fileupload-ui
//= require admin/file_uploads
//= require admin/s3_uploads.js
//= require admin/congress_message_tabulation
//= require admin/petitions
//= require admin/epic_editor_helper
//= require admin/analytics
//= require_tree ./admin/action_pages
//= require bootstrap/tab
//= require bootstrap-responsive-tabs
//= require react
//= require react_ujs
//= require_tree ./admin/components

$(document).on('ready', function() {

  var editor = initEpicEditor('action-page-description', 'description');
  var editor2 = $("#action-page-what-to-say").parents(".panel").is(".disabled") ?
                null : initEpicEditor('action-page-what-to-say', 'what-to-say');
  var editor3 = initEpicEditor('epic-petition-description', 'petition-description');
  var editor4 = initEpicEditor('epic-action-summary', 'action-summary');
  var editor5 = initEpicEditor('epic-email-text', 'email-text');
  var editor6 = initEpicEditor('epic-victory-message', 'victory-message');

  $("#action-page-description").data("editor", editor);
  $("#action-page-what-to-say").data("editor", editor2);
  $("#epic-petition-description-").data("editor", editor3);
  $("#epic-action-summary").data("editor", editor4);
  $("#epic-email-text").data("editor", editor5);
  $("#epic-victory-message").data("editor", editor);


  $(".edit-action .panel-heading").click(function(){
    setTimeout(function() { editor2 && editor2.reflow() }, 100);
  });

  // This is a hack to make the "edit petition description" Epiceditor display at the right height when the panel is openened.
  $("#action_page_enable_petition").change(function(){
    setTimeout(function(){editor3.reflow()}, 100);
  });

  $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    if(typeof editor5 != 'undefined'){
      editor5.reflow();
      editor6.reflow();
    }
  });

  $('.thumbnail').on('click', function (ev) {
    var image = $(ev.currentTarget);
    var md  = image.attr('src');
    $('.markdown-image-code').text(md);
    return false;
  });

  if (window.location.hash.length) {
    $('a[data-tab="'+window.location.hash.slice(1)+'"]').tab('show');
    window.scrollTo(0, 0); // Otherwise page starts scrolled to initial tab location
  }
  $('.edit-action .nav-tabs a').on('show.bs.tab', function(e) {
    var anchor = $(e.target).data('tab');
    $('#anchor').val(anchor);
    history.pushState(null,null,'#' + anchor);
  });
  $('.action_pages-index .nav-tabs a').on('show.bs.tab', function(e) {
    var anchor = $(e.target).data('tab');
    $('#anchor').val(anchor);
    history.pushState(null,null,'#' + anchor);
  });

  $("#action-page-form.edit_action_page").on("submit.check_timestamp", function(e) {
    e.preventDefault();
    e.stopPropagation();

    var form = this;
    $.get(form.action + ".json", function(record) {
      if (new Date(record.updated_at) <= new Date(form.dataset.timestamp)
          || confirm("Are you sure? This page has been updated since you started editing.")) {
        $(form).off("submit.check_timestamp").submit();
      }
    });
  });

  var preview_button = $('#action-page-preview').click(function() {
    var form = $('#action-page-form').clone()
                 .attr("id", null).css("display", "none")
                 .attr('action', preview_button.attr('href'))
                 .attr('target', '_blank');
    $("body").append(form);
    form.submit();
    return false;
  });


  // Bootstrap popovers and tooltips
  $('.action_pages-index i.has-tooltip').tooltip();

  var popovers = "#protip2, #protip3, .photo-specs-popover, .photo-popover";
  $(popovers).popover();

  $(popovers).on('shown.bs.popover', function(){
    $(".popover").click(function(e){
      e.stopPropagation();
    });

    $("body").click(function(){
      $(popovers).popover('hide');
      $("body").off('click');
    });
  });

  // Prevent scrolling to the top of the page when clicking on protip popovers.
  $( 'a[href="#"]' ).click( function(e) {
    e.preventDefault();
  });

  // Bootstrap responsive tabs: https://github.com/openam/bootstrap-responsive-tabs
  fakewaffle.responsiveTabs(['xs']);

  $("#action .panel").on("show.bs.collapse", function(e) {
    $(".caret .icon", this).addClass("ion-arrow-up-b").removeClass("ion-arrow-down-b");
  });

  $("#action .panel").on("hide.bs.collapse", function(e) {
    $(".caret .icon", this).addClass("ion-arrow-down-b").removeClass("ion-arrow-up-b");
  });

  $("#action_page_partner_ids").select2({
    placeholder: "Start typing to search..."
  });

  var filterActionPages = function(e) {
    if (e.type == "submit")
      e.preventDefault();

    var form = $(e.target).closest("form")[0];

    // timeout required for this to behave correctly during a form reset
    setTimeout(function() {
      $.get(form.action + '?' + $(form).serialize(), function(resp) {
        $(form).siblings('.table-simple').replaceWith($(resp).find('.table-simple'));
      });
    }, 1);
  };

  $('#filter_action_pages').on('submit', filterActionPages);
  $('#filter_action_pages').on('reset', filterActionPages);
  $('#filter_action_pages input[type=radio]').on('change', filterActionPages);
});


// Make chart.js redraw charts when we resize the browser
Chart.defaults.global.responsive = true;

