const axios = require('axios');
function settingsSetHandler() {
	if (process) {
	} else {
		axios.default.get('localhost:3000/config').then(result => {
			const data = result.data;
			for (let key in data) {
				store.setState(key, data[key]);
			}
			setTimeout(() => {
				positionResizeBars();
			}, 100);
		});
	}
}
function settingsUpdateHandler() {
	if (process) {
		ipcRenderer.send('window:settings-update', {
			isAsideOut: store.getState('isAsideOut'),
			contentWidth: store.getState('contentWidth'),
			asideWidth: store.getState('asideWidth')
		});
	} else {
		axios.default
			.post('localhost:3000/config/update', {
				isAsideOut: store.getState('isAsideOut'),
				contentWidth: store.getState('contentWidth'),
				asideWidth: store.getState('asideWidth')
			})
			.then(result => console.log(result))
			.catch(err => console.log(data));
	}
}
function employeeDeleteHandler(save) {
	if (process) {
		ipcRenderer.send('employee:save', save);
	} else {
		axios.default
			.post('localhost:3000/delete', save)
			.then(response => {
				const array = [];
				if (response.data instanceof Array) {
					response.data.forEach(e => {
						array.push(new Employee(e));
					});
				}
				store.setState('currentEmployee', array[0]);
				store.setState('employeeArray', array);
				searchEmployeeArray();
			})
			.catch(err => console.log(err));
	}
}
function employeeSaveHandler(save) {
	if (process) {
		ipcRenderer.send('employee:save', save);
	} else {
		axios.default
			.post('localhost:3000/save', save)
			.then(response => {
				const array = [];
				if (response.data instanceof Array) {
					response.data.forEach(e => {
						array.push(new Employee(e));
					});
				}
				store.setState('currentEmployee', array[0]);
				store.setState('employeeArray', array);
				searchEmployeeArray();
			})
			.catch(err => console.log(err));
	}
}
