/*
*	Easing Functions found at gizma.com/easing
*	In Function speed up
* 	Out Function slow down
*	InOut functions accelerate halfway and then deccelerate
*	Sin - Sine Behavior | Quad - Quadratic Behavior | Qnt - Quintic Behavior | Exp - Exponential Behavior
*	@param t the frame
*	@param b the start position
*	@param c the distance changed by
*	@param d the duration of animation
*/

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

function easeInOutQnt(t, b, c, d) {
	t /= d/2;
	if (t < 1) return c/2*t*t*t*t*t + b;
	t -= 2;
	return c/2*(t*t*t*t*t + 2) + b;
}

function easeInOutExp(t, b, c, d) {
	t /= d/2;
	if (t < 1) return c/2 * Math.pow( 2, 10 * (t - 1) ) + b;
	t--;
	return c/2 * ( -Math.pow( 2, -10 * t) + 2 ) + b;
}