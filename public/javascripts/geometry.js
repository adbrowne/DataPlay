var Geometry = {
	_rotateVector: 
		function(vector){
			return {x: -vector.y, y: vector.x};
		},
	_getVector: 
		function(edge){
			return {x: edge.v2.x - edge.v1.x, y: edge.v2.y - edge.v1.y};
		},
	_edgeSeperates:
		function(edge, points){
			var vector = Geometry._getVector(edge);
			var rotated = Geometry._rotateVector(vector);
			var sides = []
			var i;	
			for(i = 0; i < points.length; i += 1){
				var side = Geometry._pointSide(rotated, points[i],edge.v2);
				sides.push(side);
			}

			return Geometry._allSame(sides);			
		},
	_allSame:
		function(arr){
			if(arr.length === 0) return true;

			var first = arr[0];

			var i;
			for(i = 0; i < arr.length; i+=1){
				if(arr[i] !== first) return false;
			}

			return true;
		},
	_pointSide:
		function(vector, point, endpoint){
			return Geometry._sameSide(vector, point, endpoint) < 0;	
		},
	_sameSide:
		function(vector, testpoint, endpoint){
			return (vector.x * (testpoint.x - endpoint.x) + 
					vector.y * (testpoint.y - endpoint.y));
		},
	_points:
		function(rectangle){
			var left = rectangle.left;
			var top = rectangle.top;
			var width = rectangle.width;
			var height = rectangle.height;
			return [
			{x: left, y: top},
			{x: left + width, y: top},
			{x: left + width, y: top + height},
			{x: left, y: top + height}];
		},
	_getEdgePairs: 
		function(points){
			var edges = [];
			var i;
			var numPoints = points.length; 
			for(i = 0; i < numPoints; i += 1){
				var prevIndex = i - 1;
				if(prevIndex === -1) prevIndex = numPoints -1;
				var v1 = points[prevIndex];
				var v2 = points[i];
				edges.push({v1:v1, v2:v2});
			}
			return edges;
		},
	_hasSeperatingEdge:
		function(edgeRectangle, pointRectangle){
			var edges = Geometry._getEdgePairs(Geometry._points(edgeRectangle));
			var points = Geometry._points(pointRectangle);
			var i;
			for(i = 0; i < edges.length; i+=1){
				if(!Geometry._edgeSeperates(edges[i], points))
					return false;
			}

			return true;
		},
	overlap_old: 
		function(rectangle1, rectangle2) {
			return !(Geometry._hasSeperatingEdge(rectangle1, rectangle2) || Geometry._hasSeperatingEdge(rectangle2, rectangle1));
		},
	_containsPoint:
		function(rectangle, point){
			var contains = 
				((point.x >= rectangle.left) && 
				(point.x <= rectangle.left + rectangle.width) && 
				(point.y >= rectangle.top) && 
				(point.y <= rectangle.top + rectangle.height));

			return contains;
		},
	_containsOnePoint: 
		function(rectangle1, rectangle2){
			var points = Geometry._points(rectangle2);
			var i;
			for(i = 0; i < points.length; i+= 1){
				var contains = Geometry._containsPoint(rectangle1, points[i]);
				if(contains) return true;
			}
			return false;
		},
	overlap: 
		function(rectangle1, rectangle2) {
			return Geometry._containsOnePoint(rectangle1, rectangle2)	|| Geometry._containsOnePoint(rectangle2, rectangle1);
		}
}
