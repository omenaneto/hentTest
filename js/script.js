//ITENS DOCUMENTO ===========================================================
const clientTable = {
	titleMonth : document.getElementById('payment-month'),
	name       : document.getElementById('name-payer'),
	email      : document.getElementById('email-payer'),
	phone      : document.getElementById('phone-payer'),
	link       : document.getElementById('link-payer'),
	atributes  : {
		paid       : document.getElementById('payment-amount'),
		dueDate    : document.getElementById('due-date'),
		status     : document.getElementById('payment-status'),
		statusIcon : document.getElementById('status-icon'),
	},
};
const messages = document.getElementById('messages');
const messageFilter = document.getElementById('filter-messages');
const messageInput = document.getElementById('message-input');
const sendMessageBtn = document.getElementById('send-message-bt');
const messageForm = document.getElementById('message-form');
const modal = document.getElementById('modal');
const confirmSend = document.getElementById('confirm-send');

//FIM FOS ITENS DOCUMENTO ===================================================

//API =======================================================================
const apiURL = 'https://desolate-temple-06848.herokuapp.com/';
const GETclient = apiURL + 'payments/:id';
const GETnotifications = apiURL + 'payments/:id/notifications';
const POSTmessage = apiURL + 'payments/:id/message';

// FIM DA API================================================================

//FUNÇÕES GERAIS ============================================================

const dateFormater = (date) => {
	const myDate = new Date(date);
	const dateTimeFormat = new Intl.DateTimeFormat('pt-BR', { year: 'numeric', month: '2-digit', day: '2-digit' });
	const [
		{ value: day },
		,
		{ value: month },
		,
		{ value: year },
	] = dateTimeFormat.formatToParts(myDate);
	return day + '/' + month + '/' + year;
};

const timeFormater = (time) => {
	const myTime = new Date(time);
	const dateTimeFormat = new Intl.DateTimeFormat('pt-BR', { hour: 'numeric', minute: 'numeric', second: 'numeric' });
	const [
		{ value: hour },
		,
		{ value: minute },
		,
		{ value: second },
	] = dateTimeFormat.formatToParts(myTime);

	return hour + ':' + minute + ':' + second;
};

//FIM FUNÇÔES GERAIS ========================================================

//MAIN ======================================================================

//PREENCHER INFORMAÇÕES DO CLIENTE
const getClientData = async () => {
	const fetchOptions = {
		method : 'GET',
	};
	const response = await fetch('json/client.json'); //Mudar para await fetch(GETclient, fetchOptions);
	const data = await response.json();

	//  Converter Pagamento de centavos para Real
	let paid_in_reais;
	if (data.paid_amount_in_cents) paid_in_reais = data.paid_amount_in_cents / 100;
	else paid_in_reais = 0;
	const amount = paid_in_reais.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); //Formata em Reais
	clientTable.atributes.paid.textContent = amount;

	//  Adicionar data de vencimento
	const dateParts = data.due_at.split('-');
	const writeTitleDate = (month) => {
		switch (month) {
			case '01':
				return (clientTable.titleMonth.textContent = 'Janeiro');
				break;
			case '02':
				return (clientTable.titleMonth.textContent = 'Fevereiro');
				break;
			case '03':
				return (clientTable.titleMonth.textContent = 'Março');
				break;
			case '04':
				return (clientTable.titleMonth.textContent = 'Abril');
				break;
			case '05':
				return (clientTable.titleMonth.textContent = 'Maio');
				break;
			case '06':
				return (clientTable.titleMonth.textContent = 'Junho');
				break;
			case '07':
				return (clientTable.titleMonth.textContent = 'Julho');
				break;
			case '08':
				return (clientTable.titleMonth.textContent = 'Agosto');
				break;
			case '09':
				return (clientTable.titleMonth.textContent = 'Setembro');
				break;
			case '10':
				return (clientTable.titleMonth.textContent = 'Outubro');
				break;
			case '11':
				return (clientTable.titleMonth.textContent = 'Novembro');
				break;
			case '12':
				return (clientTable.titleMonth.textContent = 'Dezembro');
				break;
		}
	}; // Traduz Mês
	writeTitleDate(dateParts[1]);
	clientTable.atributes.dueDate.textContent = 'Vence ' + dateFormater(data.due_at);
	//clientTable.titleMonth.textContent = data.due_at.toLocaleDateString();

	//  Status do Pagamento
	let iconClass; // anterar classe do css
	let statusString; // descrever status
	switch (data.status) {
		case 'paid':
			iconClass = 'fa fa-check-circle';
			statusString = 'Pago';
		case 'overdue':
			iconClass = 'fa fa-times-circle';
			statusString = 'Vencido';
		case 'cancelled':
			iconClass = 'fa fa-times-circle';
			statusString = 'Cancelado';
		default:
			break;
	} //Formatação de texto
	clientTable.atributes.statusIcon.classList.value = iconClass;
	clientTable.atributes.status.textContent = statusString;

	//  Preencher Tabela de informações
	clientTable.name.textContent = data.payer.name;
	clientTable.email.textContent = data.payer.email;
	const phoneParts = data.payer.phone_number.split('.');
	const formatedPhone = '(' + phoneParts[0] + ') ' + phoneParts[1] + '-' + phoneParts[2]; //formatar telefone
	clientTable.phone.textContent = formatedPhone;
};

// FIM DO MAIN ==============================================================

// SIDEBAR (MENSAGENS) ======================================================

const addMessage = (body, id, kind, createdAt, openedAt, paymentId) => {
	//Estilização de ícones
	let icon;
	let boxStyle;

	if (kind == 'email_notification' && openedAt) {
		icon = 'img/icons/Vectorlida.svg';
		boxStyle = 'text';
	}
	else if (kind == 'email_notification' && !openedAt) {
		icon = 'img/icons/Vectornaolida.svg';
		boxStyle = 'text';
	}
	else if (kind == 'sms_notification') {
		icon = 'img/icons/Vectorsms.svg';
		boxStyle = 'text';
	}
	else if (kind == 'inbound_message') {
		icon = 'img/icons/Vectorrecebida.svg';
		boxStyle = 'box';
	}
	else if (kind == 'outbound_message') {
		icon = 'img/icons/Vectorenviada.svg';
		boxStyle = 'box';
	}

	//Estilização de checagem de ícone
	const openCheck =
		openedAt ? 'aberto em ' + dateFormater(openedAt) :
		'não aberto';
	const checkIcon =
		openedAt ? 'doublecheck' :
		'check';
	//Criar um padrão de HTML para instancia de mensagem
	const box = `
    <li class="message-item ${kind}">
        <img class="message-type" src="${icon}" alt="Mensagem">
        <div class="message-content">
            <span class="message-${boxStyle}">${body}</span>
            <span class="timestamp">Em ${dateFormater(createdAt)} às ${timeFormater(createdAt)}</span>
            <span class="read-check">${openCheck}<img src="img/icons/Vector${checkIcon}.svg" alt="doublecheck"></span>
        </div>
    </li>`;

	const position = 'beforeend';
	return messages.insertAdjacentHTML(position, box);
};

const loadBoxes = (array) => {
	messages.innerHTML = ''; //Limpar mensagens atuais

	array.map((message) => {
		return addMessage(
			message.body,
			message.id,
			message.kind,
			message.created_at,
			message.opened_at,
			message.payment_id
		);
	}); //carregar mensages do array de notificações
	const messagesOnDisplay = document.querySelectorAll('.box-item');
	//messagesOnDisplay.forEach((item) => item.addEventListener('click', selectBox));
};

const getNotificationData = async () => {
	const response = await fetch('json/notifications.json');
	const data = await response.json();

	//carregar mensagens da API
	loadBoxes(data.notifications);
};

const sendMessage = async (messagedata) => {
	const fetchOptions = {
		method  : 'POST',
		body    : JSON.stringify(messagedata),
		headers : { 'Content-Type': 'application/json' },
	};
	const response = await fetch('json/client.json'); //Mudar para await fetch(POSTmessage, fetchOptions);
	const data = await response.json();
};

// FIM DA SIDEBAR (MENSAGENS) ===============================================

// FUNCTION CALLS ===========================================================

getClientData()
	.then((response) => {
		console.log('Conseguiu carregar dados de cliente da API');
	})
	.catch((error) => {
		console.error(error);
	});

getNotificationData()
	.then((response) => {
		console.log('Consegiu carregar notificações e mensagens da API');
	})
	.catch((error) => {
		console.error(error);
	});

sendMessageBtn.addEventListener('click', (e) => {
	modal.classList.toggle('hidden');
});
confirmSend.addEventListener('click', (e) => {
	const data = {
		id         : 'a1b8fb2f-784c-461f-b2ad-520e2d0316f5',
		kind       : 'outbound_message',
		body       : messageInput.value,
		created_at : '2020-06-13T20:18:28-03:00',
		opened_at  : null,
		payment_id : '22345544-343455-332244',
	};

	sendMessage(messageInput)
		.then((response) => {
			console.log('Consegiu carregar notificações e mensagens da API');
		})
		.catch((error) => {
			console.error(error);
		});
});
messageFilter.addEventListener('click', (e) => {
	const emailNotifications = document.getElementsByClassName('email_notification');
	const smsNotifications = document.getElementsByClassName('sms_notification');

	for (let i = 0; i < emailNotifications.length; i++) {
		emailNotifications[i].classList.toggle('hidden');
	}
	for (let i = 0; i < smsNotifications.length; i++) {
		smsNotifications[i].classList.toggle('hidden');
	}
});
