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
  if (currentSlide = slideCount - 1) {
    $(".next").hide()
  }
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
  if (currentSlide < slideCount - 1) {
    $(".next").show()
  }
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
    const application = {
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
        file:document.getElementById('file').value.slice(12), // .slice() to remove path name (i.e. C:\fakepath\)
        userid:document.getElementById('userid').value
      }
      console.log(JSON.stringify(application));
      const settings = {
          method: 'POST',
          body: JSON.stringify(application), 
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


  /**
   * Updates the thumbnail on a drop zone element.
   *
   * @param {HTMLElement} dropZoneElement
   * @param {File} file
   */
   function updateThumbnail(dropZoneElement, file) {
    let thumbnailElement = dropZoneElement.querySelector(".drop-zone__thumb");
  
    // First time - remove the prompt
    if (dropZoneElement.querySelector(".drop-zone__prompt")) {
      dropZoneElement.querySelector(".drop-zone__prompt").remove();
    }
  
    // First time - there is no thumbnail element, so lets create it
    if (!thumbnailElement) {
      thumbnailElement = document.createElement("div");
      thumbnailElement.classList.add("drop-zone__thumb");
      dropZoneElement.appendChild(thumbnailElement);
    }
  
    thumbnailElement.dataset.label = file.name;
  
    // Show thumbnail for image files
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
  
      reader.readAsDataURL(file);
      reader.onload = () => {
        thumbnailElement.style.backgroundImage = `url('${reader.result}')`;
      };
    } else {
      thumbnailElement.style.backgroundImage = null;
    }
  }
  
  document.querySelectorAll(".drop-zone__input").forEach((inputElement) => {
    const dropZoneElement = inputElement.closest(".drop-zone");
  
    dropZoneElement.addEventListener("click", (e) => {
      inputElement.click();
    });
  
    inputElement.addEventListener("change", (e) => {
      if (inputElement.files.length) {
        updateThumbnail(dropZoneElement, inputElement.files[0]);
      }
    });
  
    dropZoneElement.addEventListener("dragover", (e) => {
      e.preventDefault();
      dropZoneElement.classList.add("drop-zone--over");
    });
  
    ["dragleave", "dragend"].forEach((type) => {
      dropZoneElement.addEventListener(type, (e) => {
        dropZoneElement.classList.remove("drop-zone--over");
      });
    });
  
    dropZoneElement.addEventListener("drop", (e) => {
      e.preventDefault();
  
      if (e.dataTransfer.files.length) {
        inputElement.files = e.dataTransfer.files;
        updateThumbnail(dropZoneElement, e.dataTransfer.files[0]);
      }
  
      dropZoneElement.classList.remove("drop-zone--over");
    });
  });
  
    