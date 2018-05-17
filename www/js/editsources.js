$$(document).on('page:init', '.page[data-name="editsources"]', function(e) {

  app.dialog.preloader("Loading...");
  app.request.post(apiUrl + 'userdatasources.php', {
    action: "get_usersubsources",
    userid: userid, 
  }, function (data) {

    app.dialog.close();
    data = JSON.parse(data);
    
    for(i=0; i<data.length; i++) {
      DisplayDataSourceAndSubSourceInList(data[i]['id'], data[i]['name'], data[i]['enabled'], data[i]['subsource']);
    }    
  });  

  $$('body').on('change', '.subsources-list input[type="checkbox"]', function() {
    var subsourceid = $$(this).val();
    var datasourceid = $$(this).parents(".accordion-item-content").attr("data-source-id");
    var enabled;

    if(this.readOnly) {
      this.checked = this.readOnly = false;      
      enabled = 0;
    }
    else if(!this.checked) {
      this.readOnly = this.indeterminate = true;
      enabled = 1;
    }
    else {
      enabled = 2;
    }

    app.request.post(apiUrl + 'userdatasources.php', {
      action: "update_usersubsources",
      userid: userid,
      datasourceid: datasourceid,
      subsourceid: subsourceid,
      enabled: enabled
    }, function (data) {
      console.log("Updated sub-source.", data);
    });

  });

});

function DisplayDataSourceAndSubSourceInList(sourceId, sourceName, enabled, subsources) {
  var html = '';

  if(enabled == 0) {
    html += '<li class="accordion-item disabled">';
  }
  else {
    html += '<li class="accordion-item">';
  }  
  html += '  <a href="#" class="item-content item-link">';
  html += '    <div class="item-inner">';
  html += '      <div class="item-title">' + sourceName + '</div>';
  html += '    </div>';
  html += '  </a> ';

  if(enabled != 0) {
    html += '<div class="accordion-item-content" data-source-id="' + sourceId + '">';
    html +=   '<div class="block">';
    html +=     '<div class="list ssss">';
    html +=       '<ul>';

    var subsourcesHTML = "";
    for(j=0; j<subsources.length; j++) {
      subsourcesHTML += '<li>';
      subsourcesHTML +=   '<label class="item-checkbox item-content">';

      var extensionStr = '';
      if(subsources[j]['enabled'] == 2) {
        extensionStr = 'checked=""';
      }
      else if(subsources[j]['enabled'] == 1) {
        extensionStr = 'class="indeterminate-state"';
      }
      
      subsourcesHTML +=     '<input type="checkbox" name="sub-checkbox" value="' + subsources[j]['id'] + '" ' + extensionStr + '/>';      
      subsourcesHTML +=     '<i class="icon icon-checkbox"></i>';
      subsourcesHTML +=     '<div class="item-inner">';
      subsourcesHTML +=       '<div class="item-title">' + subsources[j]['description'] + '</div>';
      subsourcesHTML +=     '</div>';
      subsourcesHTML +=   '</label>';
      subsourcesHTML += '</li>';
    }

    html += subsourcesHTML;
    html += '     </ul>';
    html += '   </div>';
    html += ' </div>';
    html += '</div>';
  }

  html += '</li>';

  $$('.subsources-list>ul').append(html);

  setTimeout(function() { // simulate long-running setup
    $$('.indeterminate-state').prop('indeterminate', true);
  }, 100);
}

