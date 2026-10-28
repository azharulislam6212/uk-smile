$(window).on("load", function () {
  // AOS Js
  AOS.init({
    easing: "ease-in-out-sine",
    offset: 10,
    // disable: window.innerWidth <= 991
  });
});
$(document).ready(function () {

	$('#slick-partner').slick({
		dots: false,
		arrows: false,
		infinite: true,
		autoplay: true,
		autoplaySpeed: 0,
		speed: 6000,
		pauseOnHover: true,
		cssEase: 'linear',	
		slidesToShow: 6,
		slidesToScroll: 1,
		responsive: [
			{
				breakpoint: 1024,
				settings: {
					slidesToShow: 5,
					slidesToScroll: 1,
				}
			},
			{
				breakpoint: 992,
				settings: {
				  slidesToShow: 4,
				  slidesToScroll: 1,
				}
			},
			{
			breakpoint: 767,
			settings: {
			  slidesToShow: 3,
			  slidesToScroll: 1,
			}
		  },
		  {
			breakpoint: 480,
			settings: {
			  slidesToShow: 2,
			  slidesToScroll: 1,
			}
		  }]
	  });



	  $('#slick-products').slick({
		dots: false,
		arrows: true,
		infinite: false,
		autoplay: false,
		speed: 800,
		cssEase: 'linear',	
		prevArrow: '<button class="slide-arrow prev-arrow"><i class="fas fa-chevron-left"></i></button>',
        nextArrow: '<button class="slide-arrow next-arrow"><i class="fas fa-chevron-right"></i></button>',
		slidesToShow: 4,
		slidesToScroll: 1,
		responsive: [
			{
				breakpoint: 992,
				settings: {
					slidesToShow: 3,
				}
			},
		  {
			breakpoint: 767,
			settings: {
			  slidesToShow: 2,
			}
		  },
		  {
			breakpoint: 576,
			settings: {
			  slidesToShow: 1,
			}
		  }]
	  });

	  $('#slick-review').slick({
		dots: false,
		arrows: true,
		infinite: false,
		autoplay: true,
		speed: 700,
		fade: true,
		prevArrow: '<button class="slide-arrow prev-arrow"><i class="fal fa-arrow-left"></i></button>',
        nextArrow: '<button class="slide-arrow next-arrow"><i class="fal fa-arrow-right"></i></button>',
		slidesToShow: 1,
		slidesToScroll: 1,
	  });

	  $('#slick-blogs').slick({
		dots: false,
		arrows: true,
		infinite: false,
		autoplay: false,
		speed: 800,
		cssEase: 'linear',	
		prevArrow: '<button class="slide-arrow prev-arrow"><i class="fas fa-chevron-left"></i></button>',
        nextArrow: '<button class="slide-arrow next-arrow"><i class="fas fa-chevron-right"></i></button>',
		slidesToShow: 4,
		slidesToScroll: 1,
		responsive: [
			{
				breakpoint: 991,
				settings: {
					slidesToShow: 3,
				}
			},
		  {
			breakpoint: 767,
			settings: {
			  slidesToShow: 2,
			}
		  },
		  {
			breakpoint: 480,
			settings: {
			  slidesToShow: 1,
			}
		  }]
	  });



	// Product Details Tabs

	$('.tab-menu li a').on('click', function(){
		var target = $(this).attr('href');
		$('.tab-menu li a').removeClass('active');
		$(this).addClass('active');
		$(target).fadeIn('slow').siblings(".tab-box").hide();
		return false;
		
	});


	// FAQ's 

	$(document).on("click", ".faq_blk > h6", function () {
		$(".faq_blk").not($(this).parent().toggleClass("active")).removeClass("active");
		$(".faq_blk > .txt").not($(this).parent().children(".txt").slideToggle()).slideUp();
	});
	$(".faq_lst > .faq_blk:nth-child(1)").addClass("active");



	// function makeTimer() {
	// // var endTime = new Date("29 April 2018 9:56:00 GMT+01:00");
	// 	var date = $( ".date" ).html();
	// 	console.log(date);	
	// 	var endTime = new Date(date);			
	// 	endTime = (Date.parse(endTime) / 1000);

	// 	var now = new Date();
	// 	now = (Date.parse(now) / 1000);

	// 	var timeLeft = endTime - now;

	// 	var days = Math.floor(timeLeft / 86400); 
	// 	var hours = Math.floor((timeLeft - (days * 86400)) / 3600);
	// 	var minutes = Math.floor((timeLeft - (days * 86400) - (hours * 3600 )) / 60);
	// 	var seconds = Math.floor((timeLeft - (days * 86400) - (hours * 3600) - (minutes * 60)));

	// 	if (hours < "10") { hours = "0" + hours; }
	// 	if (minutes < "10") { minutes = "0" + minutes; }
	// 	if (seconds < "10") { seconds = "0" + seconds; }

	// 	$("#days").html(days + "<span>D &nbsp; : &nbsp;</span>");
	// 	$("#hours").html(hours + "<span>H &nbsp; : &nbsp;</span>");
	// 	$("#minutes").html(minutes + "<span>M &nbsp; : &nbsp;</span>");
	// 	$("#seconds").html(seconds + "<span>S</span>");		
	// }
	// setInterval(function() { makeTimer(); }, 1000);
});
