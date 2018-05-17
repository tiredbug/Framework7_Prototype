$$(document).on('page:init', '.page[data-name="streamapprove"]', function(e) {

  app.dialog.preloader("Loading...");
  app.request.post(apiUrl + 'streamapprove.php', {
    userid: userid
  }, function (data) {
    app.dialog.close();
    data = JSON.parse(data);

    console.log(data);
    
    var sourcesHTML = '';
    var subHTML = '';
    var attrStr = '';

    for(i=0; i<data.length; i++) {
      //HTML for stream-data-source-list
      if(i == 0) attrStr = 'selected';
      else attrStr = "";
      sourcesHTML += '<option value="' + data[i]['id'] + '" ' + attrStr + '>' + data[i]['name'] + '</option>';

      //HTML for stream-sub-datasource-list
      var subHTML = '';
      var subSources = data[i]['subsource'];
      subHTML += '<div class="sub-group sub-group' + data[i]['id'] + '">';

      for(j=0; j<subSources.length; j++) {
        subHTML += '<div class="block-title row stream-sub-title">';
        subHTML += '  <span>' + data[i]['name'] + ' - ' + subSources[j]['description'] + '</span>';
        subHTML += '  <label class="toggle toggle-init">';
        if(subSources[j]['enabled'] == 2) {
          subHTML += '    <input type="checkbox" checked disabled>';
        }
        else {
          subHTML += '    <input type="checkbox" disabled>';
        }        
        subHTML += '    <span class="toggle-icon"></span>';
        subHTML += '  </label>';
        subHTML += '</div>';
        if(subSources[j]['enabled'] == 2) {
          subHTML += '<div class="list">';
        }
        else {
          subHTML += '<div class="list disabled">';
        }        
        subHTML += '  <ul>';
        subHTML += '    <li>';
        subHTML += '      <div class="item-content">';
        subHTML += '        <div class="item-inner">' + subSources[j]['contents'] + '</div>';
        subHTML += '      </div>';
        subHTML += '    </li>';
        subHTML += '  </ul>';
        subHTML += '</div>';
      }

      subHTML += '</div>';

      $$(".stream-sub-list").append(subHTML);
    }

    //Creating stream-data-source-list
    $$(".stream-source-list").html(sourcesHTML);
    $$(".stream-source-list~.item-content .item-after").html(data[0]['name']);
    $$(".sub-group" + data[0]['id']).show();
  });

  $$('body').on('change', '.stream-title .stream-source-list', function() {
    var sourceid = $$(this).val();
    $$(".sub-group").hide();
    $$(".sub-group" + sourceid).show(1000);
  });

});
