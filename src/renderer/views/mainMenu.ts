document.addEventListener('keydown', event => {
	console.log(event.key);
	switch (event.key) {
		case '1':
			window.location.href = window.location.href.substring(0, window.location.href.lastIndexOf('/') + 1) + 'main.html';
			break;
	}
});
