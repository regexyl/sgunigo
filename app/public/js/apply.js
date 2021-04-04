// Enable animations for multi-part form
var currentSlide = 0,
    $slideContainer = $('.slide-container'),
    $slide = $('.slide'),
    slideCount = $slide.length,
    animationTime = 300;

function setSlideDimensions () {
  var windowWidth = $(window).width();
  $slideContainer.width(windowWidth * slideCount);
  $slide.width(windowWidth);
}

function generatePagination () {
  var $pagination = $('.pagination');
  for(var i = 0; i < slideCount; i ++){
    var $indicator = $('<div>').addClass('indicator'),
        $progressBarContainer = $('<div>').addClass('progress-bar-container'),
        $progressBar = $('<div>').addClass('progress-bar'),
        indicatorTagText = $slide.eq(i).attr('data-tag'),
        $tag = $('<div>').addClass('tag').text(indicatorTagText);
    $indicator.append($tag);
    $progressBarContainer.append($progressBar);
    $pagination.append($indicator).append($progressBarContainer);
  }
  $pagination.find('.indicator').eq(0).addClass('active');
}

function goToNextSlide (e) {
  e.preventDefault();
  window.scrollTo(0,0);
  if(currentSlide >= slideCount - 1) return; 
  var windowWidth = $(window).width();
  currentSlide++;
  $slideContainer.animate({
    left: -(windowWidth * currentSlide)
  });
  setActiveIndicator();
  $('.progress-bar').eq(currentSlide - 1).animate({
    width: '100%'
  }, animationTime);
}

function goToPreviousSlide (e) {
  e.preventDefault();
  window.scrollTo(0,0);
  if(currentSlide <= 0) return; 
  var windowWidth = $(window).width();
  currentSlide--;
  $slideContainer.animate({
    left: -(windowWidth * currentSlide)
  }, animationTime);
  setActiveIndicator();
  $('.progress-bar').eq(currentSlide).animate({
    width: '0%'
  }, animationTime);
}

function postitionSlides () {
  var windowWidth = $(window).width();
  setSlideDimensions();
  $slideContainer.css({
    left: -(windowWidth * currentSlide)
  }, animationTime);
}

function setActiveIndicator () {
  var $indicator = $('.indicator');
  $indicator.removeClass('active').removeClass('complete');
  $indicator.eq(currentSlide).addClass('active');
  for(var i = 0; i < currentSlide; i++){
    $indicator.eq(i).addClass('complete');
  }
}

setSlideDimensions();
generatePagination();
$(window).resize(postitionSlides);
$('.next').on('click', goToNextSlide);
$('.previous').on('click', goToPreviousSlide);

// Submit application form to Flask API
var submitButton=document.getElementById('submit');
submitButton.addEventListener('click',async function(){
    const data = {
        nric:document.getElementById('nric').value,
        applicant_name:document.getElementById('applicant_name').value,
        email:document.getElementById('email').value,
        mobile_no:document.getElementById('mobile_no').value,
        grades:document.getElementById('grades').value,
        university:document.getElementById('university').value,
        course1:document.getElementById('course1').value,
        course2:document.getElementById('course2').value,
        course3:document.getElementById('course3').value,
        statement:document.getElementById('statement').value,
        sex:document.getElementById('sex').value,
        dob:document.getElementById('dob').value,
        address:document.getElementById('address').value,
        nationality:document.getElementById('nationality').value,
        race:document.getElementById('race').value,
        userid:document.getElementById('userid').value
      }
      console.log(JSON.stringify(data));
      const settings = {
          method: 'POST',
          body: JSON.stringify(data), 
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
          }
      };
      try {
          const fetchResponse = await fetch(`http://localhost:5100/place_application`, settings);
          const data = await fetchResponse.json();
          window.location.href = "http://localhost:3001/applications";
      } catch (e) {
          console.log(e);
      }    
});