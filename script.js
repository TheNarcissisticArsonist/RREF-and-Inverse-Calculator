var rows;
var cols;
var rowInput;
var colInput;
var calcButton;
var inputArea;
var givenMatrix;
var htmlMatrix;

function setup() {
	rowInput = document.getElementById("rows");
	colInput = document.getElementById("cols");
	calcButton = document.getElementById("calc");
	inputArea = document.getElementById("inputArea");

	rowInput.addEventListener("input", updateInputDimensions);
	colInput.addEventListener("input", updateInputDimensions);
	calcButton.addEventListener("click", calculate);
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
function calculate() {
	var rawMatrix = getRawInput();
	if(rawMatrix == "FAIL") {
		return;
	}

	rrefMatrix = rawMatrix.slice(0);
	if(rows == cols) {
		invMatrix = augmentIdentity(rawMatrix.slice(0));
		console.log(invMatrix);
	}
	else {
		invMatrix = "NOT_SQUARE";
	}
}

setup();