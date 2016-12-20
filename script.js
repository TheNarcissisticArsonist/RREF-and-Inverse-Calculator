var rows;
var cols;
var rowInput;
var colInput;
var calcButton;
var givenMatrix;

function setup() {
	rowInput = document.getElementById("rows");
	colInput = document.getElementById("cols");
	calcButton = document.getElementById("calc");

	rowInput.addEventListener("input", updateInputDimensions);
	colInput.addEventListener("input", updateInputDimensions);
	calcButton.addEventListener("click", calculate);
}
function updateInputDimensions() {

}
function calculate() {
	
}

setup();