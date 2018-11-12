{
	'use strict';
	
/*	fetch('http://okslo.ru/works/seasons.json', {headers: {'Origin': 'http://okslo.ru', 'Access-Control-Allow-Origin': 'http://okslo.ru', 'Access-Control-Allow-Credentials': 'true'}})
		.then((response) => {
			console.log(response.headers.get('Content-Type')); // application/json; charset=utf-8
			console.log(response.status); // 200

			return response.json();
		})
		.catch((error) => {
			console.log(error);
		});*/

	const seasons = {

			"low" : {
			"date_from":"15.05",
			"date_to":"20.06",
			"econom":1000,
			"standart":1500,
			"lux":2000,
			"child_discount_perc":50
			},
			"high" : {
			"date_from":"21.06",
			"date_to":"20.08",
			"econom":1800,
			"standart":2800,
			"lux":4000,
			"child_discount_perc":25
			},
			"low2" : {
			"date_from":"21.08",
			"date_to":"15.09",
			"econom":1200,
			"standart":1800,
			"lux":2300,
			"child_discount_perc":25}
		};

	let valDateFrom, valDateTo;

	function addEvent (selector, eventType, handler) {

		var targetScope = [];

		selector.forEach( (selectorItem, index, array) => {


			selectorItem = (typeof selectorItem === 'string') ? document.querySelectorAll(selectorItem) : selectorItem;

			if (selectorItem instanceof  NodeList) {
				selectorItem = [].slice.call(selectorItem);
				targetScope = targetScope.concat(selectorItem);
			} else {
				targetScope.push(selectorItem);
			}
		});
		
		targetScope.forEach( (elem) => {

			elem.addEventListener(eventType, handler);
		});
	};

	function dateToFormat (date) {
		return `${date.getFullYear()}-${((date.getMonth() + 1) < 10 ? '0'+(date.getMonth() + 1) : (date.getMonth() + 1))}-${(date.getDate() < 10 ? '0'+date.getDate():date.getDate())}`;
	};

	function initInputDate (datesFrom, datesTo) {


		let today = new Date(),
			thisSeasonStart = new Date((new Date()).getFullYear(), +seasons.low.date_from.slice(3) -1, seasons.low.date_from.slice(0,2)),
			thisSeasonEnd = new Date((new Date()).getFullYear(), +seasons.low2.date_to.slice(3) -1, seasons.low2.date_to.slice(0,2));


		if (today > thisSeasonStart && today < thisSeasonEnd) {
			//datesFrom.min = datesFrom.defaultValue= dateToFormat(today);
			datesFrom.min = dateToFormat(today);
			today.setDate(today.getDate() + 1);
			//datesTo.min = datesTo.defaultValue= dateToFormat(today);
			datesTo.min = dateToFormat(today);
			datesTo.max = dateToFormat(thisSeasonEnd);
			thisSeasonEnd.setDate(thisSeasonEnd.getDate() - 1);
			datesFrom.max = dateToFormat(thisSeasonEnd);
		} else if (today > thisSeasonEnd) {
			thisSeasonStart.setFullYear(thisSeasonStart.getFullYear() + 1);
			thisSeasonEnd.setFullYear(thisSeasonEnd.getFullYear() + 1);
			datesFrom.min = dateToFormat(thisSeasonStart);
			thisSeasonStart.setDate(thisSeasonStart.getDate() + 1);
			datesTo.min = dateToFormat(thisSeasonStart);
			datesTo.max = dateToFormat(thisSeasonEnd);
			thisSeasonEnd.setDate(thisSeasonEnd.getDate() - 1);
			datesFrom.max = dateToFormat(thisSeasonEnd);
		} else {
			//datesFrom.min = datesFrom.defaultValue = dateToFormat(thisSeasonStart);
			datesFrom.min = dateToFormat(thisSeasonStart);
			thisSeasonStart.setDate(thisSeasonStart.getDate() + 1);
			//datesTo.min = datesTo.defaultValue = dateToFormat(thisSeasonStart);
			datesTo.min = dateToFormat(thisSeasonStart);
			datesTo.max = dateToFormat(thisSeasonEnd);
			thisSeasonEnd.setDate(thisSeasonEnd.getDate() - 1);
			datesFrom.max = dateToFormat(thisSeasonEnd);
		};
		datesFrom.defaultValue = datesFrom.value || datesFrom.min;
		datesTo.defaultValue = datesTo.value || datesTo.min;

	}

	function getBookDaysBySeasons(dateFrom, dateTo) {

		function makeDate(value) {
			return new Date(dateFrom.getFullYear(), +value.slice(3)-1, value.slice(0,2));
		};

		function getNumDays(ms) {
			return ms/(1000*60*60*24);
		}

		const bookDates = {'low': 0, 'high': 0, 'low2': 0};

		for (let period in bookDates) {
			let lastDayForToinSeason = makeDate(seasons[period].date_to);
			lastDayForToinSeason.setDate(lastDayForToinSeason.getDate()+1);
			if (dateTo > lastDayForToinSeason) {
				bookDates[period] = (dateFrom > makeDate(seasons[period].date_to) ) ? 0 : getNumDays(lastDayForToinSeason - dateFrom);
			} else {
				bookDates[period] = (dateFrom >= makeDate(seasons[period].date_from)) ? getNumDays(dateTo - dateFrom) : getNumDays(dateTo - makeDate(seasons[period].date_from));
				break;
			};
		};
		return bookDates;
	}

	window.addEventListener('load', (event) => {

		let activeForm = 0;

		let formCalculate = document.forms['form-calculate'],
			formClientInfo = document.forms['form-clientinfo'],
			resultCalculateField = formCalculate.querySelector('.result');

		try {
			activeForm = localStorage.getItem('activeForm') || 0;
		} catch (err) {
			console.log(err);
		};
		document.querySelectorAll('.form-booking-wrap form')[activeForm].classList.add('current');
		

		/* Init input date */
		initInputDate (formCalculate.dateFrom, formCalculate.dateTo);

		addEvent(document.querySelectorAll('.next, .back'), 'click', (event) => {
			event.preventDefault();
			
			if (event.target.classList.contains('next')) {

				for (let el of event.target.form.querySelectorAll('input:invalid, select:invalid')) {
					el.classList.add('invalid');
				};

				event.target.form.classList.remove('current');
				event.target.form.nextElementSibling.classList.add('current');
			} else {
				event.target.form.classList.remove('current');
				event.target.form.previousElementSibling.classList.add('current');
			}

		});

		addEvent(document.querySelectorAll('input'), 'keypress', (event) => {
    		if (event.keyCode == 13) {
    			event.target.blur();
    			event.preventDefault();
    		}
		});

		addEvent(formCalculate.querySelectorAll('input, select'), 'change', (event) => {

			resultCalculateField.innerHTML = 'Для расчета стоимости проживания заполните все поля корректно';
			event.target.form.querySelector('.next').disabled = true;

			function calculateCost (daysBySeasons, roomType, numAdult, numTeenager) {
				let resultCost = 0;

				for (let period in daysBySeasons) {
					resultCost += daysBySeasons[period]*seasons[period][roomType] * (numAdult + numTeenager * (1 - seasons[period]['child_discount_perc']/100));
				}

				return resultCost;
			}

			// check number of clients
			if (event.target === formCalculate.numAdult || event.target === formCalculate.numTeenager || event.target === formCalculate.numChild) {
				if ((+formCalculate.numTeenager.value + +formCalculate.numChild.value)/formCalculate.numAdult.value > 3 ) {
					event.target.setCustomValidity("на 1 взрослого не более 3х детей");
				} else {
					formCalculate.numAdult.setCustomValidity("");
					formCalculate.numTeenager.setCustomValidity("");
					formCalculate.numChild.setCustomValidity("");
					formCalculate.numAdult.classList.remove('invalid');
					formCalculate.numTeenager.classList.remove('invalid');
					formCalculate.numChild.classList.remove('invalid');
				};
			};

			valDateFrom = new Date(formCalculate.dateFrom.valueAsDate);
			valDateFrom.setHours(0);
			valDateTo = new Date(formCalculate.dateTo.valueAsDate);
			valDateTo.setHours(0);
			// check dates
			if (event.target === formCalculate.dateFrom || event.target === formCalculate.dateTo) {

				if (valDateFrom >= valDateTo && formCalculate.dateFrom.checkValidity() && formCalculate.dateTo.checkValidity()) {

					event.target.setCustomValidity("Дата начала не может быть больше даты конца");
					resultCalculateField.classList.add('warning');
					resultCalculateField.innerHTML = event.target.validationMessage;
					event.target.classList.add('invalid');
				}  else {
					formCalculate.dateFrom.setCustomValidity("");
					formCalculate.dateTo.setCustomValidity("");
					formCalculate.dateFrom.classList.remove('invalid');
					formCalculate.dateTo.classList.remove('invalid');
				};
			};

			if (event.target.checkValidity()) {
				event.target.classList.remove('invalid')
			} else {
				event.target.classList.add('invalid');
				resultCalculateField.classList.add('warning');
				resultCalculateField.innerHTML = event.target.validationMessage;
				event.target.reportValidity();
			};

			if (event.target.form.checkValidity()) {
				let totalCost = calculateCost (getBookDaysBySeasons(valDateFrom, valDateTo), formCalculate.roomType.selectedOptions[0].value, +formCalculate.numAdult.value, +formCalculate.numTeenager.value);

				let numPeople = +formCalculate.numAdult.value + +formCalculate.numTeenager.value + +formCalculate.numChild.value;
				if (((numPeople.toString())[numPeople.toString().length - 1] == 1) && numPeople != 11) {
					 numPeople += ' человека'
				} else {numPeople += ' человек'};

				event.target.form.querySelector('.next').disabled = false;
				resultCalculateField.classList.remove('warning');
				resultCalculateField.innerHTML = `Стоимость отдыха с ${formCalculate.dateFrom.valueAsDate.toLocaleDateString()} по ${formCalculate.dateTo.valueAsDate.toLocaleDateString()} для ${numPeople}: ${totalCost} руб.`;
			}
		});

		addEvent(formClientInfo.querySelectorAll('input'), 'change', (event) => {
			event.target.form.querySelector('.send').disabled = true;
			event.target.form.querySelector('.result').innerHTML = '';
			event.target.form.querySelector('.result').classList.remove('warning');

			if (event.target === event.target.form.tel ) {
				if (/\+7\s?\([0-9]{3}\)\s?[0-9]{3}-[0-9]{2}-[0-9]{2}/.test(event.target.value)) {
					event.target.setCustomValidity("");
				} else {
					event.target.setCustomValidity("Неверно введен номер телефона");
				};
			}

			if (event.target.checkValidity()) {
				event.target.classList.remove('invalid')
			} else {
				event.target.classList.add('invalid');
				event.target.form.querySelector('.result').classList.add('warning');
				event.target.form.querySelector('.result').innerHTML = event.target.validationMessage;
				event.target.reportValidity();
			};

			if (event.target.form.checkValidity()) {
				event.target.form.querySelector('.send').disabled = false;
			};
		});

		addEvent(formClientInfo.querySelectorAll('.send'), 'click', (event) => {
			event.preventDefault();
    		let xhr = new XMLHttpRequest();

			let body = 'numAdult=' + formCalculate.numAdult.value + '&numTeenager=' + formCalculate.numTeenager.value + '&numChild=' + formCalculate.numChild.value +
			  '&roomType=' + formCalculate.roomType.selectedOptions[0].value + '&dateFrom=' + formCalculate.dateFrom.valueAsDate + '&dateTo=' + formCalculate.dateTo.valueAsDate +
			  '&fio=' + formClientInfo.fio.value + '&email=' + formClientInfo.email.value + '&tel=' + formClientInfo.tel.value;

			xhr.open("POST", '/submit', true);
			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			xhr.send(body);

			event.target.form.querySelector('.result').classList.remove('warning');
			event.target.form.querySelector('.result').innerHTML = 'Спасибо. Ваши данные отправлены.';
			console.log(body);
		});

	});


}