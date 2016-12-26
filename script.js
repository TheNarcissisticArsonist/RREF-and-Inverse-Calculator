var rows;
var cols;
var rowInput;
var colInput;
var calcButton;
var inputArea;
var givenMatrix;
var htmlMatrix;
var rrefAnswer;
var invAnswer;
var detAnswer;
var detProduct;

var epsilon = 0.000001;

function setup() {
	rowInput = document.getElementById("rows");
	colInput = document.getElementById("cols");
	calcButton = document.getElementById("calc");
	inputArea = document.getElementById("inputArea");
	rrefAnswer = document.getElementById("rrefAnswerField");
	invAnswer = document.getElementById("inverseAnswerField");
	detAnswer = document.getElementById("determinantAnswerField");

	rowInput.addEventListener("input", updateInputDimensions);
	colInput.addEventListener("input", updateInputDimensions);
	calcButton.addEventListener("click", main);
}
function updateInputDimensions() {
	var r = Number(rowInput.value);
	var c = Number(colInput.value);
	if(isNaN(r) || isNaN(c)) {
		return;
	}
	else {
		htmlMatrix = [];
		rows = r;
		cols = c;

		inputArea.innerHTML = "";

		for(var i=0; i<rows; ++i) {
			htmlMatrix.push([]);
			for(var j=0; j<cols; ++j) {
				inputArea.innerHTML += "<textarea id='matrix_"+i+"_"+j+"' style='width:40px; height:40px; resize:none; margin-left:5px;'></textarea>";
			}
			inputArea.innerHTML += "<br>"
		}
		window.setTimeout(function() {
			for(var i=0; i<rows; ++i) {
				for(var j=0; j<cols; ++j) {
					htmlMatrix[i].push(document.getElementById("matrix_"+i+"_"+j));
					htmlMatrix[i][j].addEventListener("focus", function(event) {
						this.select();
					});
					htmlMatrix[i][j].addEventListener("mouseUp", function(event) {
						event.preventDefault();
					});
				}
			}
		}, 0);
	}
}
function getRawInput() {
	var matrix = []
	for(var i=0; i<rows; ++i) {
		matrix.push([]);
		for(var j=0; j<cols; ++j) {
			var val = htmlMatrix[i][j].value;
			val = Number(val);
			if(isNaN(val)) {
				return "FAIL";
			}
			else {
				matrix[i].push(val);
			}
		}
	}
	return matrix;
}
function augmentIdentity(matrix) {
	var len = matrix[0].length;
	for(var i=0; i<matrix.length; ++i) {
		for(var j=0; j<len; ++j) {
			matrix[i].push(Number(i==j));
		}
	}
	return matrix;
}
function main() {
	var rawMatrix = getRawInput();
	if(rawMatrix == "FAIL") {
		return;
	}

	detProduct = 1;

	var matrix = rawMatrix.slice(0);
	var rrefMatrix = rref(matrix);
	var rrefMatrixImage = matrixToImage(rrefMatrix);
	rrefAnswer.innerHTML = rrefMatrixImage;

	var determinant = 1;
	for(var i=0; i<rows; ++i) {
		determinant *= rrefMatrix[i][i];
	}
	determinant *= detProduct;

	if(rows == cols) {
		var invMatrix = augmentIdentity(rawMatrix.slice(0));
		var rrefInvMatrix = rref(invMatrix);
		var inverse = extractInverse(rrefInvMatrix);
		var inverseImage = matrixToImage(inverse);
	}
	else {
		var invMatrix = "NOT_SQUARE";
		var inverseImage = "<p>Not invertible.</p>";
		determinant = "N/A";
	}
	invAnswer.innerHTML = inverseImage;
	detAnswer.innerHTML = determinant;
}
function rref(matrix) {
	//Conceptually based off of rref in general, and https://www.csun.edu/~panferov/math262/262_rref.pdf
	var rowVectors = [];
	for(var i=0; i<matrix.length; ++i) {
		rowVectors.push(matrix[i].slice(0));
	}
	var i = 0;
	var j = 0;
	while(i < rowVectors.length && j < rowVectors[i].length) {
		var onlyCol;
		var colSum = 0;
		for(var k=0; k<rowVectors.length; ++k) {
			colSum += rowVectors[k][j];
		}
		if(colSum == 0) {
			onlyCol = true;
		}
		else {
			var swap1 = rowVectors[i].slice(0);
			var noSwap;
			var found = false;
			for(var k=i; k<rowVectors.length; ++k) {
				if(rowVectors[k][j] != 0) {
					var swap2 = rowVectors[k].slice(0);
					var swap2Num = k;
					noSwap = (k==i);
					found = true;
					break;
				}
			}
			if(!found) {
				onlyCol = true;
			}
			else {
				if(!noSwap) {
					rowVectors[i] = swap2.slice(0);
					rowVectors[swap2Num] = swap1.slice(0);
					detProduct *= -1;
				}

				var c = rowVectors[i][j];
				for(var k=0; k<rowVectors[i].length; ++k) {
					rowVectors[i][k] *= (1/c);
				}
				detProduct *= c;

				onlyCol = false;
			}
		}

		for(var k=0; k<rowVectors.length; ++k) {
			if(k != i) {
				var x = rowVectors[k][j];
				if(x != 0) {
					for(var l=0; l<rowVectors[k].length; ++l) {
						rowVectors[k][l] *= (1/x);
						rowVectors[k][l] -= rowVectors[i][l];
					}
					detProduct *= x;
				}
			}
		}

		if(onlyCol) {
			++j;
		}
		else {
			++i;
			++j;
		}
	}
	for(var i=0; i<rowVectors.length; ++i) {
		var x = 0;
		var j = 0;
		while(x == 0 && j<rowVectors[i].length) {
			x = rowVectors[i][j];
			++j;
		}
		if(x != 0) {
			for(var j=0; j<rowVectors[i].length; ++j) {
				rowVectors[i][j] *= (1/x);
			}
			detProduct *= x;
		}
	}

	return rowVectors;
}
function matrixToImage(matrix) {
	if(matrix == "NOT_INVERTIBLE") {
		return "<p>Not invertible.</p>";
	}
	else {
		var url = "https://latex.codecogs.com/gif.latex?";
		url += "\\begin{bmatrix}";
		for(var i=0; i<matrix.length; ++i) {
			url += String(matrix[i][0]);
			for(var j=1; j<matrix[i].length; ++j) {
				url += "&"
				url += String(matrix[i][j]);
			}
			url += "\\\\";
		}
		url += "\\end{bmatrix}";
	}
	return "<img src='"+url+"'></img>";
}
function extractInverse(matrix) {
	var newMatrix = [];
	var invertible = true;

	for(var i=0; i<matrix.length; ++i) {
		newMatrix.push([]);
		for(var j=0; j<matrix[i].length/2; ++j) {
			newMatrix[i].push(matrix[i][j]);
			if(Math.abs(Number(i==j) - newMatrix[i][j]) > epsilon) {
				invertible = false;
			}
		}
	}
	newMatrix = [];
	if(invertible) {
		for(var i=0; i<matrix.length; ++i) {
			newMatrix.push([]);
			for(var j=matrix[i].length/2; j<matrix[i].length; ++j) {
				newMatrix[i].push(matrix[i][j]);
			}
		}
	}
	else {
		newMatrix = "NOT_INVERTIBLE";
	}
	return newMatrix;
}

setup();