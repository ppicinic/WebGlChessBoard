// ease out function found online
//t is time in frames (our ttl)
// b is start value either 178 or -142
// c is change in value always going to be 178 + 142 (negative from white to black, positive from black to white)
// d camera time constant

function easeInOutSin(t, b, c, d){
	return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
}

function easeInSin(t, b, c, d) {
	return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
}

function easeOutSin(t, b, c, d) {
	return c * Math.sin(t/d * (Math.PI/2)) + b;
}

function easeInOutQuad(t, b, c, d) {
	t /= d/2;
	if (t < 1) return c/2*t*t + b;
	t--;
	return -c/2 * (t*(t-2) - 1) + b;
}