var LOUDPANDA = LOUDPANDA || {};

LOUDPANDA.map = LOUDPANDA.map || (function funName (shapes, paper){
  var self= 
{
  items: [],
  isInside: function(selectBox, point){
    var xInside = (point.X > selectBox.left) && 
  (point.X < selectBox.left + selectBox.width) ;
var yInside = (point.Y > selectBox.top) && 
  (point.Y < selectBox.top + selectBox.height);
return xInside && yInside;
  },
  highlight: 
  function(selectBox){
    var i;
    var numItems = self.items.length;
    var selected = [];
    for(i = 0; i < numItems; i+=1){
      var item = self.items[i];
      if(item.name === "3000") {
        console.log("Melbourne!");
        console.log(item.center);
      }
      var on = self.isInside(selectBox, item.center);
      if(on){
        selected.push(item.name)
          if(!item.selected){
            item.selected = true;
            if(item.path !== null){
              item.path.animate({fill: "#f22", stroke: "#666"}, 5);
            }
          }
      }
      else{
        if(item.selected){
          item.selected = false;
          if(item.path !== null){
            item.path.animate({fill: "#fff", stroke: "#666"}, 5);
          }
        }
      } 

      //item.path.animate({fill: "#f22", stroke: "#666"}, 5);
    }
    return selected;
  },
  drawShapes: 
    function(){
      var i;
      for(i = 0; i < shapes.length; i+=1){
        var shape = shapes[i];
        if(shape.parts.length > 0){
          self.drawShape(shape);
        }
        else{
          self.items.push({
            center: self.translatePoint(shape.center),
            name: shape.name,
            path: null
          });
        } 
      }	
    },
  drawShape:
    function(shape){
      var parts = shape.parts; 
      var i;
      for(i = 0; i < parts.length; i += 1){
        var part = parts[i];
        var center = self.getCenter(part);
        var path = self.drawPart(part);
        self.items.push({
          center: center,
          name: shape.name,
          path: path
        });
      }
    },
  getCenter:
    function(part){
      var points = part.points;
      var i;
      var pathString = "";
      var firstPoint = points[0];
      var minX = firstPoint.X;
      var minY = firstPoint.Y;
      var maxX = firstPoint.X;
      var maxY = firstPoint.Y;
      for(i = 0; i < points.length; i+=1){
        var point = points[i];
        if(point.X < minX){
          minX = point.X;
        }

        if(point.Y < minY){
          minY = point.Y;
        }

        if(point.X > maxX){
          maxX = point.X;
        }

        if(point.Y > maxY){
          maxY = point.Y;
        }
      }

      var center = {
        X: minX + (maxX - minX) / 2,
        Y: minY + (maxY - minY) / 2
      };

      return self.translatePoint(center);
    },
  drawPart:
    function(part){
      var points = part.points;
      var i;
      var pathString = "";
      for(i = 0; i < points.length; i+=1){
        var point = self.translatePoint(points[i]);
        if(i ===0){
          pathString = "M " + self.printPoint(point)
        }	
        else{
          pathString = pathString + "L " + self.printPoint(point)
        }
      }
      var path = paper.path(pathString);
      path.animate({fill: "#fff", stroke: "#666"}, 5);
      return path;
    },
  translatePoint:
    function(point){
      var scale = 16;
      return {
        X: (point.X - 110) * scale,
          Y: (-point.Y - 10) * scale  
      }
    },
  printPoint:
    function(point){
      return point.X + " " + point.Y;
    }	

};
return self;
});
(function($) {
  $.widget("loudpanda.selectbox", $.ui.mouse, {
    options : {
      appendTo: 'body'
    },
    _create : function () {
      this._mouseInit();

      this.helper = $("<div class='selectbox-helper'></div>");
    },
    // Use the destroy method to clean up any modifications your widget has made to the DOM
    destroy: function() {
      this._mouseDestroy();
      // In jQuery UI 1.8, you must invoke the destroy method from the base widget
      $.Widget.prototype.destroy.call(this);
      // In jQuery UI 1.9 and above, you would define _destroy instead of destroy and not call the base method
    },
    _mouseStart: function(event) {
      var self = this;

      this.opos = [event.pageX, event.pageY];

      this._trigger("start", event);

      var options = this.options;
      $(options.appendTo).append(this.helper);

      this.helper.css({
        "left": event.clientX,
        "top": event.clientY,
        "width": 0,
        "height": 0
      })
    },
    _mouseDrag : function(event) {
      var self = this;

      var x1 = this.opos[0], y1 = this.opos[1], x2 = event.pageX, y2 = event.pageY;
      if (x1 > x2) {
        var tmp = x2;
        x2 = x1;
        x1 = tmp;
      }
      if (y1 > y2) {
        var tmp = y2;
        y2 = y1;
        y1 = tmp;
      }


      var width = x2 - x1;
      var height = y2 - y1;
      this.helper.css({left: x1, top: y1, width: width, height: height});

      this._trigger("select", event, {left: x1, top: y1, width: width, height: height});
    },
    _mouseStop: function(event) {
      this._trigger("stop", event);
      this.helper.remove();
    }
  });
}(jQuery) );

$(function () {
  var R = Raphael("paper", 800, 800);
  var attr = {
    fill: "#333",
  stroke: "#666",
  "stroke-width": 1,
  "stroke-linejoin": "round"
  };
  var map;
  $.getJSON("/assets/javascripts/map_data.js", function(data){
    var shapes = data.shapes;
    map = LOUDPANDA.map(shapes, R);
    map.drawShapes();
  });		

  var myCanvas = $("#canvas"); 
  myCanvas.selectbox({
    select: function(event, ui){
      var canvasPosition = myCanvas.offset();
      var selectRect = 
  {left: ui.left - canvasPosition.left,
    top: ui.top - canvasPosition.top,
    width: ui.width,
    height: ui.height
  }
  var highlighted = map.highlight(selectRect);
  var selected = highlighted.join(", ");
  var selectedDiv = $('#selected');
  selectedDiv.text(selected);
    }
  });
});
