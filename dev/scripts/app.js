$(document).ready(function() {
  var guestData = [];
  $.ajax({
    url:"data/guest.csv",
    dataType:"text",
    success: function(data) {
      guestData = CSVtoArray(data);
    },
    statusCode: {
      404: function() {
        alert('There was a problem with the server.  Try again soon!');
      }
    }
  });
  $("body").on('keyup', '#search', debounce(function(event) {
    var searchValue = $(this).val();
    var regex = new RegExp(searchValue, "gi");
    var searchResults = [];
    var html;
    html = '';
    if (searchValue) {
      $("#results").empty();
      $.each(guestData, function(index, value) {
        if ((value.name.search(regex) != -1) || (value.name.search(regex) != -1)) {
          searchResults.push(value);
        }
      });
      $.each(searchResults, function(index, value){
          html += '<tr><td>' + value.name + '</td><td>' + value.table + '</td></tr>';
      });
    }
    $("#results").html(html);
  }, 250));

  $('body').click(function(){
    $('#search').focus();
  });
  function debounce(func, wait, immediate) {
  	var timeout;
  	return function() {
  		var context = this, args = arguments;
  		var later = function() {
  			timeout = null;
  			if (!immediate) func.apply(context, args);
  		};
  		var callNow = immediate && !timeout;
  		clearTimeout(timeout);
  		timeout = setTimeout(later, wait);
  		if (callNow) func.apply(context, args);
  	};
  };
  function CSVtoArray(data) {
    var result = [];
    var line = data.split(/\r?\n|\r/);
    var headers = line[0].split(",");
    for(i = 1; i < line.length; i++){
      if (line[i]) {
        var entry = line[i].split(",");
        temp = [];
        for( j = 0; j < headers.length; j++){
           temp[headers[j]] = entry[j];
        }
        result.push(temp);
      }
    }
    return result;
  }

});
