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

function setup() {
	rowInput = document.getElementById("rows");
	colInput = document.getElementById("cols");
	calcButton = document.getElementById("calc");
	inputArea = document.getElementById("inputArea");
	rrefAnswer = document.getElementById("rrefAnswerField");
	invAnswer = document.getElementById("inverseAnswerField");

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
	for(var i=0; i<rows; ++i) {
		for(var j=0; j<rows; ++j) {
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

	var matrix = rawMatrix.slice(0);
	var rrefMatrix = rref(matrix);
	var rrefMatrixImage = matrixToImage(rrefMatrix);
	rrefAnswer.innerHTML = rrefMatrixImage;

	if(rows == cols) {
		var invMatrix = augmentIdentity(rawMatrix.slice(0));
		var rrefInvMatrix = rref(invMatrix);
		var inverse = extractInverse(rrefInvMatrix);
		var inverseImage = matrixToImage(inverse);
	}
	else {
		var invMatrix = "NOT_SQUARE";
		var inverseImage = "<p>Not invertible.</p>";
	}
	invAnswer.innerHTML = inverseImage;
}
function rref(matrix) {
	return matrix; //Temporary
}
function matrixToImage(matrix) {
	if(matrix == "NOT_INVERTIBLE") {
		return "<p>Not invertible.</p>";
	}
	else {
		var url = "https://latex.codecogs.com/gif.latex?";
		url += "\\begin{bmatrix}";
		for(var i=0; i<rows; ++i) {
			url += String(matrix[i][0]);
			for(var j=1; j<cols; ++j) {
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

}

setup();