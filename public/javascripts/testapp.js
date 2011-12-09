(function($){
  var noopHandler = function(evt) {
    evt.stopPropagation();
    evt.preventDefault();
  };

  var handleFileLoadEnd = function(evt){
    console.log(evt.target.readyState);
    var pre = $('<pre></pre>');
    pre.append(evt.target.result);
    $('#preview').append(pre);
  }

  var handleFile = function(file){
    $('#preview').html("Processing:" + file.name);

    var reader = new FileReader();

    reader.onloadend = handleFileLoadEnd;

    reader.readAsText(file);
  };

  var drop = function(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    
    var files = evt.dataTransfer.files;
    var count = files.length;

    if(count > 0){
      handleFile(files[0]);
    }
  };

  $('#dropbox').each(function(){
    this.addEventListener("dragenter", noopHandler, false);
    this.addEventListener("dragexit", noopHandler, false);
    this.addEventListener("dragover", noopHandler, false);
    this.addEventListener("drop", drop, false);

  });
})(jQuery);
