
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

			var categories = [
				{
					Category: 1,
					HcpMax: 4.4,
					Inc: 0.1,
					Dec: 0.1,
					BufferFrom18: 35,
					Buffer9: undefined,
				},
				{
					Category: 2,
					HcpMax: 11.4,
					Inc: 0.1,
					Dec: 0.2,
					BufferFrom18: 34,
					Buffer9: undefined,
				},
				{
					Category: 3,
					HcpMax: 18.4,
					Inc: 0.1,
					Dec: 0.3,
					BufferFrom18: 33,
					Buffer9: 35,
				},
				{
					Category: 4,
					HcpMax: 26.4,
					Inc: 0.1,
					Dec: 0.4,
					BufferFrom18: 32,
					Buffer9: 34,
				},
				{
					Category: 5,
					HcpMax: 36,
					Inc: 0.2,
					Dec: 0.5,
					BufferFrom18: 31,
					Buffer9: 33,
				}
			];

			var playerCategory = categories[categories.length - 1];
			for(var i = categories.length - 1; i >= 0; i--)
				if(categories[i].HcpMax >= playerCurrentHandicap)
					playerCategory = categories[i];

			var buffer = is18 ? playerCategory.BufferFrom18 : playerCategory.Buffer9;
			if(!is18)
				stablefordPoints += 18;

			if(buffer != undefined) {
				if(stablefordPoints >= buffer && stablefordPoints <= 36)
					return parseFloat(parseFloat(playerCurrentHandicap).toFixed(1));
				if(stablefordPoints < buffer)
					return parseFloat(parseFloat(playerCurrentHandicap + playerCategory.Inc).toFixed(1));
			}

			for(var i = 0; i < Math.abs(stablefordPoints - 36); i++) {

				// get the current category
				var playerCategory = categories[categories.length - 1];
				for(var c = categories.length - 1; c >= 0; c--)
					if(categories[c].HcpMax >= playerCurrentHandicap)
						playerCategory = categories[c];


				playerCurrentHandicap -= playerCategory.Dec;
			}

			return parseFloat(parseFloat(playerCurrentHandicap).toFixed(1));
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
		}

	}
})();