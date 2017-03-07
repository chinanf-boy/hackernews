/*const userNames = { firstname: 'Robin', lastname: 'Wieruch' };
const age = 28;
const user = { userNames, age };
//console.log(user,a);
var a=2;
*

function local() {
	this.a = 7;
	var a = 2;
	this.a = 7;
	console.log(a);
	return this;
}
var local1 = local();
console.log(a);
local1 == this ? console.log(a) : console.log(0);
*/
var he = (function () {
	var a = 1 ;
	a = 3;
	return function () {
		return a;
	}

})();

console.log(he());

var b = {};

console.log(b.prototype);