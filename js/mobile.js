let STATE = {
	menu    : false,
	sidebar : false,
};

//ÁREAS
const sidebar = document.getElementById('sidebar');
const blackCurtain = document.getElementById('black-curtain');
const mainMenu = document.getElementById('main-menu');

//BOTÕES MOBILE
const menuBt = document.getElementById('menu-bt');
const sidebarBt = document.getElementById('sidebar-bt');
//Botões de fechamento
const closeMenuBt = document.getElementById('close-menu-bt');
const closeSidebarBt = document.getElementById('close-sidebar-bt');

const mobileMenuOpen = (e) => {
	if (!STATE.sidebar) {
		mainMenu.classList.toggle('mobile-hidden');
		return (STATE.menu = true);
	}
};

const mobileSidebarOpen = (e) => {
	if (!STATE.menu) {
		sidebar.classList.toggle('mobile-hidden');
		return (STATE.sidebar = true);
	}
};
const mobileMenuClose = (e) => {
	STATE.menu = false;
	mainMenu.classList.toggle('mobile-hidden');
};

const mobileSidebarClose = (e) => {
	STATE.sidebar = false;
	sidebar.classList.toggle('mobile-hidden');
};

//EVENT LISTENERS
menuBt.addEventListener('click', mobileMenuOpen);
closeMenuBt.addEventListener('click', mobileMenuClose);
sidebarBt.addEventListener('click', mobileSidebarOpen);
closeSidebarBt.addEventListener('click', mobileSidebarClose);
