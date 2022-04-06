import './easy-toggler.min.js'
import Swiper from 'swiper/bundle'

document.addEventListener('DOMContentLoaded', () => {
	"use strict"

	const swiper = new Swiper('.swiper', {
		loop: true,
		centeredSlides: true,
		// autoplay: {
		// 	delay: 2500,
		// 	disableOnInteraction: false,
		// },
		
		// If we need pagination
		pagination: {
			el: '.swiper-pagination',
		},

		// Navigation arrows
		navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev',
		},

		// Responsive breakpoints
		breakpoints: {
			// when window width is >= 768px
			1920: {
				slidesPerView: 1,
				spaceBetween: 0
			},
		}
	});
	
	/* begin begin Back to Top button  */
	(function() {
		let goTopBtn = document.querySelector('.back_to_top');
		if(goTopBtn){
			function trackScroll() {
				let scrolled = window.pageYOffset || document.documentElement.scrollTop;
				let coords = 80;
				if (scrolled > coords) {
					goTopBtn.classList.add('back_to_top-show');
				}
				if (scrolled < coords) {
					goTopBtn.classList.remove('back_to_top-show');
				}
			}
			window.addEventListener('scroll', trackScroll, true);
			goTopBtn.addEventListener('click', () => window.scrollBy(0, -100000000));
		}
	})();
	/* end begin Back to Top button  */
	
	/* изменение стилей меню на разных страницах */
	const navbar = document.querySelector('.navbar')
	if (document.location.pathname === '/privacy.html' || document.location.pathname === '/contact.html') {
		navbar.classList.add('navbarAddCSS')
	} else {
		navbar.classList.remove('navbarAddCSS')
	}
	
	/* изменение слайдов */
	setInterval( () => {
		
		const swiperSlides = document.querySelectorAll('.swiper-slide')
		if(swiperSlides){
			swiperSlides.forEach(el => {
				let str = el.style.background;
				if( window.innerWidth <= 768 ){
					let re = /lg/gi;
					el.style.background = str.replace(re, 'sm');
				} else {
					let re = /sm/gi;
					el.style.background = str.replace(re, 'lg');
				}
			})
		}
		
		const art = document.querySelector('.singleArticle__mainImg')
		if(art){
			if( window.innerWidth <= 768 ){
				let re = /_singl.jpg/gi;
				art.style.background = art.style.background.replace(re, '_600.png');
			}else{
				let re = /_600.png/gi;
				art.style.background = art.style.background.replace(re, '_singl.jpg');
			}
		}
		
	}, 0)
	
	/* работа с мобильным меню */
	const menuIcon = document.getElementById('menu-icon')
	menuIcon.addEventListener('click', () => {
		document.querySelector('body').classList.toggle('hiddenCont')
	})
})