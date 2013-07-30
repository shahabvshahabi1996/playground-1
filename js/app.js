var editor_html = ace.edit("editor_html");
editor_html.setTheme("ace/theme/tomorrow");
editor_html.getSession().setMode("ace/mode/html");

var editor_css = ace.edit("editor_css");
editor_css.setTheme("ace/theme/tomorrow");
editor_css.getSession().setMode("ace/mode/css");

var editor_javascript = ace.edit("editor_javascript");
editor_javascript.setTheme("ace/theme/tomorrow");
editor_javascript.getSession().setMode("ace/mode/javascript");

var result_html = ace.edit("result_html");
result_html.setTheme("ace/theme/tomorrow");
result_html.getSession().setMode("ace/mode/html");
result_html.setReadOnly(true);


function generate_prototype() {
  "use strict";
  var source = $('#template').html();
  var template = Handlebars.compile(source);
  var data = {
    "html": editor_html.getValue(),
    "stylesheet": [],
    "style_inline": editor_css.getValue(),
    "script": [],
    "script_inline": editor_javascript.getValue()
  };

  $(':input[type="url"][id^="css"]').each(function(index, e) {
    if ($(e).val() === '') {
      return;
    }
    data.stylesheet.push({
      "src": $(e).val()
    });
  });
  $(':input[type="url"][id^="js"]').each(function(index, e) {
    if ($(e).val() === '') {
      return;
    }
    data.script.push({
      "src": $(e).val()
    });
  });

  result_html.setValue(template(data), -1);
  if (!!("srcdoc" in document.createElement("iframe"))) {
    $('#result_iframe').attr('srcdoc', result_html.getValue());
  }
  else {
    document.getElementById("result_iframe").contentWindow.document.body.innerHTML = result_html.getValue();
  }
}

$(function() {
  "use strict";
  jss('.tab-pane', {
    height: ($(window).height() - 181) + 'px'
  });


  // resources
  $('.add_resource').on('click', function() {
    $(this).data('count', $(this).data('count') + 1);
    var tmpl = '<div class="input-append"><input class="input-block-level" id="' + $(this).data('type') + $(this).data('count') + '" type="url"><button class="btn del_resource" type="button">-</button></div>';
    $(this).parent().find('.res').append(tmpl);
  });

  $('form').on('click', '.del_resource', function() {
    $(this).parent().remove();
  });


  // tabs
  $('#myTab').tab();

  $('.generate').click(function() {
    generate_prototype();
  });

  $('#download').click(function() {
    Download.save(result_html.getValue(), 'playground-prototype.html');
  });

  // fullscreen
  $('#result_fullscreen').click(function() {
    var x = document.getElementById('result_iframe');
    if (BigScreen.enabled) {
      $('#myTab a:eq(3)').tab('show');
      BigScreen.toggle(x);
    } else {
      // fallback for browsers that don't support full screen
    }
  });
});
