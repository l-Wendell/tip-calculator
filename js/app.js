import { html } from './getDomElements.js';

const numberOfPeopleInput = html.get('[data-js="numberOfPeopleInput"]');
const tipAmountParagrph = html.get('[data-js="tipAmountParagrph"]');
const totalValueParagraph = html.get('[data-js="totalValueParagraph"]');

const billInput = html.get('[data-js="billInput"]');
const erroDiv = html.get('[data-js="erroDiv"]');
const tipButtons = Array.from(html.getAll('[data-js="tipButton"]'));

const tipInput = html.get('[data-js="tipInput"]');
const resetButton = html.get('[data-js="resetButton"]');
const form = html.get('[data-js="form"]');

const main = html.get('.main');

let parametersToCaculateTip = {
	bill: 0,
	tipPercentage: 5,
	numberOfPeople: 1,
};

const resetParametersToCalculateTip = () => {
	parametersToCaculateTip = {
		bill: 0,
		tipPercentage: 5,
		numberOfPeople: 1,
	};
};

const resetInputs = () => {
	billInput.value = '';
	numberOfPeopleInput.value = '';
	tipInput.value = '';
};

const selectButton = () => {
	const [button] = tipButtons.filter(button => button.value === '5');
	button.setAttribute('checked', 'true');
};

const addCalculationValueInDOM = (tipAmount, total) => {
	tipAmountParagrph.textContent = `$${tipAmount}`;
	totalValueParagraph.textContent = `$${total}`;
};

const deselectButtons = () =>
	tipButtons.forEach(button => button.setAttribute('checked', 'false'));

const reset = () => {
	const zero = Number(0).toFixed(2);
	resetButton.setAttribute('disabled', 'true');
	resetInputs();

	deselectButtons();
	selectButton();

	resetParametersToCalculateTip();
	addCalculationValueInDOM(zero, zero);
};

const calculateTip = ({ bill, tipPercentage, numberOfPeople }) => {
	const tipAmount = (bill * tipPercentage) / 100;
	const total = tipAmount / numberOfPeople;

	addCalculationValueInDOM(tipAmount.toFixed(2), total.toFixed(2));
};

const actions = {
	getPropertyAndValue(target) {
		const property = target.getAttribute('property');
		const value = Number(target.value === '' ? 1 : target.value);

		return {
			property,
			value,
		};
	},

	closeBtn() {
		billInput.focus();
		erroDiv.style.zIndex = '-1';
		erroDiv.style.top = '0px';
	},

	showDivError(target) {
		erroDiv.style.top = '-80px';
		erroDiv.style.zIndex = '0';
		target.value = '';
	},

	throwError(target) {
		if (target.value < 0) {
			target.blur();
			this.showDivError(target);
			return true;
		}
	},

	updateCalculationParameters(property, value) {
		parametersToCaculateTip[property] = Number(value);
		calculateTip(parametersToCaculateTip);
	},

	tipButton(target) {
		const { property, value } = this.getPropertyAndValue(target);

		deselectButtons();
		tipInput.value = '';

		this.updateCalculationParameters(property, value);
		target.setAttribute('checked', 'true');
	},

	billInput(target) {
		if (this.throwError(target)) return;

		const property = target.getAttribute('property');
		const value = target.value;

		if (target.value !== '') {
			resetButton.removeAttribute('disabled');
		}

		this.updateCalculationParameters(property, value);
	},

	numberOfPeopleInput(target) {
		if (this.throwError(target)) return;

		const { property, value } = this.getPropertyAndValue(target);
		this.updateCalculationParameters(property, value);
	},

	tipCustom(target) {
		if (this.throwError(target)) return;
		const { property, value } = this.getPropertyAndValue(target);

		deselectButtons();
		this.updateCalculationParameters(property, value);
	},

	resetButton() {
		reset();
	},
};

const accessFunction = (target, funcitonName) => {
	const func = actions[funcitonName];
	func?.call(actions, target);
};

tipInput.addEventListener('input', ({ target }) =>
	accessFunction(target, target.name)
);

numberOfPeopleInput.addEventListener('input', ({ target }) =>
	accessFunction(target, target.name)
);

billInput.addEventListener('input', ({ target }) =>
	accessFunction(target, target.name)
);

form.addEventListener('submit', e => e.preventDefault());
main.addEventListener('click', ({ target }) =>
	accessFunction(target, target.name)
);
