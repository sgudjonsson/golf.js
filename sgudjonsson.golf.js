
var sgudjonsson = sgudjonsson || {};

var sgudjonsson.golf = (function() {

	var _methods = {
		_getAdjustedPar: function(playerCourseHandicap, holeHandicap, holePar) {
				var results = holePar;
				if(playerCourseHandicap >= 18)
					results++;

				if(playerCourseHandicap - 18 >= holeHandicap)
					results++;

				return results;
			},
		_getStablefordPoints: function(adjustedPar, strokes) {
			var stablefordPoints = 0;
			if(!isNaN(strokes)) {
				var strokesOverAdjustedPar = strokes - adjustedPar;

				if(strokesOverAdjustedPar == 1)
					stablefordPoints = 1;
				else if(strokesOverAdjustedPar == 0)
					stablefordPoints = 2;
				else if(strokesOverAdjustedPar == -1)
					stablefordPoints = 3;
				else if(strokesOverAdjustedPar == -2)
					stablefordPoints = 4;
				else if(strokesOverAdjustedPar == -3)
					stablefordPoints = 5;
				else if(strokesOverAdjustedPar <= -4)
					stablefordPoints = 6;
			}
			return stablefordPoints;
		},
	};

	return {

		getAdjustedPar: function(playerCourseHandicap, holeHandicap, holePar) {
			return _methods._getAdjustedPar(playerCourseHandicap, holeHandicap, holePar);
		},

		getStablefordPoints: function(adjustedPar, strokes) {
			return _methods._getStablefordPoints(adjustedPar, strokes);
		},

	}
})();