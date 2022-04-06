import './easy-toggler.min.js'
import Swiper from 'swiper/bundle'

document.addEventListener('DOMContentLoaded', () => {
	"use strict"

	const swiper = new Swiper('.swiper', {
		loop: true,
		slidesPerView: 1.2,
		spaceBetween: 30,

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
			768: {
				slidesPerView: 3,
				spaceBetween: 20
			},
		}
	});
})
