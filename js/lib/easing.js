function easeInOutSin(t, b, c, d){
	return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
}

function easeInSin(t, b, c, d) {
	return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
}

function easeOutSin(t, b, c, d) {
	return c * Math.sin(t/d * (Math.PI/2)) + b;
}