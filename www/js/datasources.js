$$(document).on('page:init', '.page[data-name="datasources"]', function(e) {
  var selectedSource = "";
  var allSources = [], currentSources = [];

  //---------------
  //Loading user datasources from DB
  app.dialog.preloader("Loading...");
  app.request.post(apiUrl + 'userdatasources.php', {
    action: "get_userdatasources",
    userid: userid, 
  }, function (data) {
    app.dialog.close();    
    data = JSON.parse(data);

    for(i=0; i<data.length; i++) {
      DisplayDataSourceInList(data[i]['id'], data[i]['logo'], data[i]['name'], data[i]['enabled']);
    }
  });

  //---------------
  // Making auto-complete functionality
  var autocompleteDropdownTypeahead = app.autocomplete.create({
    inputEl: '#autocomplete-dropdown-typeahead-search',
    openIn: 'dropdown',
    dropdownPlaceholderText: 'Try to type "Snapchat"',
    typeahead: true,
    source: function (query, render) {
      var autocomplete = this;
      var results = [];
      if (query.length === 0) {
        render(results);
        return;
      }

      // Show Preloader
      autocomplete.preloaderShow();

      app.request.post(apiUrl + 'datasources.php', {
      }, function (data) {
        data = JSON.parse(data);
        allSources = data;

        // Find matched items
        for(i=0; i<data.length; i++) {
          if (data[i]['name'].toLowerCase().indexOf(query.toLowerCase()) === 0) results.push(data[i]['name']);
        }

        // Hide Preoloader
        autocomplete.preloaderHide();

        // Render items by passing array with result items
        render(results);
      });
    },
    on: {
      change: function (value) {
        selectedSource = value[0];
      }
    },
  });

  $$('body').on('click', '.autocomplete-dropdown', function() {
    if(!currentSources.includes(selectedSource)) {
      currentSources.push(selectedSource);

      for(i=0; i<allSources.length; i++) {
        if(allSources[i]['name'] == selectedSource) {
          break;
        }
      }

      DisplayDataSourceInList(allSources[i]['id'], allSources[i]['logo'], allSources[i]['name'], 0);
    }    
  });
});

function DisplayDataSourceInList(sourceId, sourceLogo, sourceName, enabled) {
  var html = '';
  html += '<li>';
  html +=   '<div class="item-content">';
  html +=     '<div class="item-media">';
  html +=       '<img src="' + apiUrl + 'images/' + sourceLogo + '" class="icon-img">';
  html +=     '</div>';
  html +=     '<div class="item-inner">';
  html +=       '<div class="item-title">';
  html +=         sourceName;
  html +=       '</div>';
  html +=       '<div class="item-after">';
  html +=         '<label class="toggle toggle' + sourceId + '">';
  if(enabled == 1 || enabled == 2) {
    html +=           '<input type="checkbox" value="' + sourceId + '" checked="">';
  }
  else {
    html +=           '<input type="checkbox" value="' + sourceId + '">';
  }  
  html +=           '<span class="toggle-icon"></span>';
  html +=         '</label>';
  html +=       '</div>';
  html +=     '</div>';
  html +=   '</div>';
  html += '</li>';
  $$('.sources-list ul').append(html);

  // Creating toggle instance
  var toggle = app.toggle.create({
    el: '.toggle' + sourceId,
    on: {
      change: function (value) {
        // Saving the selection to DB
        var enabled;
        if(this.checked) {
          enabled = 1;
        }
        else {
          enabled = 0;
        }

        app.request.post(apiUrl + 'userdatasources.php', {
          action: "update_userdatasources",
          id: sourceId,
          userid: userid,
          enabled: enabled
        }, function (data) {
          console.log("Data source was updated. ", data);
        });
        
      }
    }
  })
}


