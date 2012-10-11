
var sgudjonsson = sgudjonsson || {};

sgudjonsson.golf = (function() {

	var _methods = {
		_getAdjustedPar: function(playerCourseHandicap, holeHandicap, holePar) {
				var results = holePar;
				if(playerCourseHandicap >= 18)
					results++;

				if(playerCourseHandicap - 18 >= holeHandicap)
					results++;

				if((playerCourseHandicap > 0 && playerCourseHandicap < 18) && playerCourseHandicap > holeHandicap)
					results++;

				return results;
			},
		_getStablefordPoints: function(adjustedPar, strokes) {
			var stablefordPoints = 0;
			if(!isNaN(strokes) && strokes > 0) {
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
		_getNewHandicap: function(playerCurrentHandicap, stablefordPoints, is18) {

			// hdcp calculation categories
			var categories = [
				{ Category: 1, HcpMax:  4.4, Inc: 0.1, Dec: 0.1, BufferFrom18: 35, Buffer9: undefined },
				{ Category: 2, HcpMax: 11.4, Inc: 0.1, Dec: 0.2, BufferFrom18: 34, Buffer9: undefined },
				{ Category: 3, HcpMax: 18.4, Inc: 0.1, Dec: 0.3, BufferFrom18: 33, Buffer9: 35 },
				{ Category: 4, HcpMax: 26.4, Inc: 0.1, Dec: 0.4, BufferFrom18: 32, Buffer9: 34 },
				{ Category: 5, HcpMax: 36.0, Inc: 0.2, Dec: 0.5, BufferFrom18: 31, Buffer9: 33 }
			];

			// returns the current category for a current hdcp
			var getPlayerCategory = function() {
				var playerCategory = categories[categories.length - 1];
				for(var i = categories.length - 1; i >= 0; i--)
					if(categories[i].HcpMax >= playerCurrentHandicap)
						playerCategory = categories[i];
				return playerCategory;
			};

			// util function that fixes the return float value
			var fixFloat = function(hdcp) {
				return parseFloat(parseFloat(hdcp).toFixed(1));
			};

			// start by getting the current hdcp category
			var playerCategory = getPlayerCategory();

			// if 9 holes where played, then add 18 points to the current points
			if(!is18)
				stablefordPoints += 18;

			// get the buffer, depending on 9 or 18 holes played
			var buffer = is18 ? playerCategory.BufferFrom18 : playerCategory.Buffer9;

			// only for buffer 18 from cat 1 - 5 and buffer 9 cat 3 - 5
			if(buffer != undefined) {

				// if points are between buffer and 36 (inclusive) then the hdcp should remain the same
				if(stablefordPoints >= buffer && stablefordPoints <= 36)
					return fixFloat(playerCurrentHandicap);

				// if points are less than the given buffer then the hdcp should increase
				if(stablefordPoints < buffer)
					return fixFloat(playerCurrentHandicap + playerCategory.Inc);
			}

			// 9 holes don't qualify for cat 1 - 2 hdcp (buffer == undefined)
			if(buffer == undefined && !is18)
				return fixFloat(playerCurrentHandicap);

			// for all points above 36, decrease the hdcp by the correct category decrease amount
			for(var i = 0; i < (stablefordPoints - 36); i++) {
				playerCurrentHandicap -= getPlayerCategory().Dec;
			}

			return fixFloat(playerCurrentHandicap);
		},

		_getPlayingHandicap: function(playerExactHandicap, courseSlopeRating, courseRating, coursePar) {
			// Playing Handicap = Exact Handicap x (Slope Rating / 113) + (Course Rating - Par)
			return Math.round(playerExactHandicap * (courseSlopeRating / 113) + (courseRating - coursePar));
		}
	};

	return {

		getAdjustedPar: function(playerCourseHandicap, holeHandicap, holePar) {
			return _methods._getAdjustedPar(playerCourseHandicap, holeHandicap, holePar);
		},

		getStablefordPoints: function(adjustedPar, strokes) {
			return _methods._getStablefordPoints(adjustedPar, strokes);
		},

		getNewHandicap: function(playerCurrentHandicap, stablefordPoints, is18) {
			return _methods._getNewHandicap(playerCurrentHandicap, stablefordPoints, is18);
		},

		getPlayingHandicap: function(playerExactHandicap, courseSlopeRating, courseRating, coursePar) {
			return _methods._getPlayingHandicap(playerExactHandicap, courseSlopeRating, courseRating, coursePar);
		}

	}
})();