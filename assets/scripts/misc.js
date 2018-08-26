function checkUMCN(string) {
	const a = string.split('');
	a.forEach((e, i) => {
		a[i] = parseInt(e);
	});
	const L =
		11 -
		((7 * (a[0] + a[6]) +
			6 * (a[1] + a[7]) +
			5 * (a[2] + a[8]) +
			4 * (a[3] + a[9]) +
			3 * (a[4] + a[10]) +
			2 * (a[5] + a[11])) %
			11);
	a[12] = L;
	return a.join('');
}
