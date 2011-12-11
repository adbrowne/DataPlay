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
