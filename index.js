const firebaseConfig = {
  apiKey: "AIzaSyDEBp3z4y4dmL-IaBiRo-sfkYWs93XFz3Q",
  authDomain: "wedding-f5695.firebaseapp.com",
  databaseURL: "https://wedding-f5695-default-rtdb.firebaseio.com",
  projectId: "wedding-f5695",
  storageBucket: "wedding-f5695.appspot.com",
  messagingSenderId: "937114396901",
  appId: "1:937114396901:web:47c97727f378cc39df4c0c",
  measurementId: "G-V4BZ2H6Q2V",
};
firebase.initializeApp(firebaseConfig);

document.getElementById("rsvpForm").addEventListener("submit", submitForm);
emailjs.init("WeH-7t3pkwpv4SkRU");

document.body.style.visibility = "visible";

document.addEventListener("DOMContentLoaded", (event) => {
  // Function to change language and update the text content of translatable elements

  function changeLanguage(lang) {
    event.preventDefault();
    const translatableElements = document.querySelectorAll(".translatable");

    translatableElements.forEach((element) => {
      element.textContent = element.getAttribute(`data-${lang}`);
    });
    document.querySelectorAll(".translatable").forEach((element) => {
      if (
        element.tagName.toLowerCase() === "input" ||
        element.tagName.toLowerCase() === "textarea"
      ) {
        element.placeholder = element.dataset[lang]; // Use the correct data attribute for the language
      } else {
        element.innerText = element.dataset[lang]; // For other elements, change the inner text
      }
    });
    let cssLink = document.getElementById("language-style");
    cssLink.href = lang === "eng" ? "styles/english.css" : "styles/armenian.css";

    //submit button translation

    const submitButton = document.querySelector(
      '#rsvpForm input[type="submit"]'
    );
    if (submitButton) {
      submitButton.value = submitButton.getAttribute(`data-${selectedLang}`);
    }

    //textarea and input translation

    document.querySelectorAll("input.translatable, textarea.translatable").forEach((element) => {
        const currentPlaceholder = element.placeholder;
        const newPlaceholder = element.getAttribute(`data-${lang}`);
        element.placeholder = newPlaceholder; // Use the correct data attribute for the language

        // For textarea, clear the text content if it matches the old placeholder
        if (
          element.tagName.toLowerCase() === "textarea" &&
          element.value === currentPlaceholder
        ) {
          element.value = ""; // Clear the pre-written text if it's the same as the placeholder
        }
      });
  }

  // Toggle dropdown content

  document
    .querySelector(".dropbtn")
    .addEventListener("click", function (event) {
      event.preventDefault();

      let currentLang =
        document.getElementById("selected-flag").alt === "UK Flag"
          ? "eng"
          : "arm";
      let newLang = currentLang === "eng" ? "arm" : "eng";
      selectedLang = newLang;

      let newFlagSrc =
        newLang === "eng" ? "images/Langs/am.png" : "images/Langs/eng.png";
      let newFlagAlt = newLang === "eng" ? "UK Flag" : "Armenian Flag";
      let selectedFlag = document.getElementById("selected-flag");
      selectedFlag.src = newFlagSrc;
      selectedFlag.alt = newFlagAlt;

      changeLanguage(newLang);
    });
});

let selectedLang = "eng";

function submitForm(e) {
  e.preventDefault();
  console.log("Form submitted");
  console.log("Selected language:", selectedLang);

  // Get values from the form
  let name = getInputVal("name");
  let lastname = getInputVal("lastname");
  let email = getInputVal("email");
  let attendance = getInputVal("attendance");
  let comments = getInputVal("comments");

  // Save the data to Firestore
  saveData(name, lastname, email, attendance, comments);

  //Check if attendance yes

  let successMessageElement = document.getElementById("successMessage");
  let messageText =
    attendance === "yes"
      ? successMessageElement.dataset[`${selectedLang}-yes`]
      : successMessageElement.dataset[`${selectedLang}-no`];
  let messageYes = successMessageElement.getAttribute(
    `data-${selectedLang}-yes`
  );
  let messageNo = successMessageElement.getAttribute(`data-${selectedLang}-no`);

  if (attendance === "yes") {
    successMessageElement.textContent = messageYes;
    successMessageElement.style.color = "white";
    successMessageElement.style.backgroundColor = "#6C9032";

    emailjs
      .send("service_cj00cdg", "template_12q7snr", {
        to_name: name,
        to_email: email,
        to_lastname: lastname,
      })
      .then((response) => {
        console.log("Email successfully sent!", response);
      })
      .catch((error) => {
        console.error("There was an error sending the email:", error);
      });
  }

  //Check if attendance no
  else if (attendance === "no") {
    console.log("Message text:", messageText);

    successMessageElement.textContent = messageNo;
    successMessageElement.style.color = "white";
    successMessageElement.style.backgroundColor = "#E55858";

    emailjs
      .send("service_cj00cdg", "template_2xilwtl", {
        to_name: name,
        to_email: email,
        to_lastname: lastname,
        to_reason: comments,
      })
      .then((response) => {
        console.log("Email successfully sent!", response);
      })
      .catch((error) => {
        console.error("There was an error sending the email:", error);
      });
  }
  successMessageElement.style.display = "block";

  // Reset the form fields
  e.target.reset();
  document.getElementById("whySection").style.display = "none";
}

function getInputVal(id) {
  return document.getElementById(id).value;
}

function saveData(name, lastname, email, attendance, comments) {
  // Added lastname parameter here
  console.log("Saving data", name, lastname, email, attendance, comments); // Logged lastname

  // Reference to your Firestore database
  let dbRef = firebase.firestore().collection("rsvps");

  // Add data to Firestore
  dbRef.add({
    name: name,
    lastname: lastname, // Added lastname key-value pair
    email: email,
    attendance: attendance,
    comments: comments,
  });
}

let navbar = document.getElementById("navbar");

// Get the offset position of the navbar
let sticky = navbar.offsetTop;

// Add the scrolled class to the navbar when you reach its scroll position. Remove "scrolled" when you leave the scroll position
function handleScroll() {
  if (window.pageYOffset > sticky) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
}

// When the user scrolls the page, execute handleScroll
window.onscroll = function () {
  handleScroll();
};
let navLinks = document.getElementById("nav-links");
let mobileMenuButton = document.getElementById("mobile-menu-button");
let logo = document.querySelector("#logo img");
// Add the scrolled class to the navbar when you reach its scroll position. Remove "scrolled" when you leave the scroll position
function handleScroll() {
  if (window.matchMedia("(max-width: 768px)").matches) {
    if (window.pageYOffset > 800) {
      navbar.classList.add("scrolled2");
      navbar.classList.remove("scrolled"); // Remove the 'scrolled' class if it was added before
      logo.src = "images/logos/dark-logo.png"; // Replace with the path to your black logo
    } else if (window.pageYOffset > 200) {
      navbar.classList.add("scrolled");
      navbar.classList.remove("scrolled2"); // Remove the 'scrolled2' class if it was added before
      logo.src = "images/logos/white-logo.png";
    } else {
      navbar.classList.remove("scrolled");
      navbar.classList.remove("scrolled2");
    }
  } else {
    if (window.pageYOffset > 880) {
      navbar.classList.add("scrolled2");
      navbar.classList.remove("scrolled"); // Remove the 'scrolled' class if it was added before
      logo.src = "images/logos/dark-logo.png"; // Replace with the path to your black logo
    } else if (window.pageYOffset > 200) {
      navbar.classList.add("scrolled");
      navbar.classList.remove("scrolled2"); // Remove the 'scrolled2' class if it was added before
      logo.src = "images/logos/white-logo.png";
    } else {
      navbar.classList.remove("scrolled");
      navbar.classList.remove("scrolled2");
    }
  }
}
function toggleMenu() {
  document.getElementById("nav-links").classList.toggle("active");
}
const countdownDate = new Date("August 18, 2024 00:00:00").getTime();

function updateCountdown() {
  const now = new Date().getTime();
  const difference = countdownDate - now;

  if (difference < 0) {
    document.querySelector(".countdown").innerText = "Event has passed!";
    clearInterval(interval);
    return;
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  document.getElementById("days").textContent = days;
  document.getElementById("hours").textContent = hours;
  document.getElementById("minutes").textContent = minutes;
  document.getElementById("seconds").textContent = seconds;
}

const interval = setInterval(updateCountdown, 1000); // Update every second

document.getElementById("attendance").addEventListener("change", function () {
  let whySection = document.getElementById("whySection");
  if (this.value === "no") {
    whySection.style.display = "flex";
  } else {
    whySection.style.display = "none";
  }
});
document.addEventListener("DOMContentLoaded", function () {
  let audio = document.getElementById("myAudio");

  const playButton = document.getElementById("button-music");
  playButton.addEventListener("click", function (e) {
    audio.muted = false; // Unmute the audio
    audio.play();
    let wasPlaying = false;

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        wasPlaying = !audio.paused;
        audio.pause();
      } else {
        if (wasPlaying) {
          audio.play().catch((err) => {
            console.warn("Audio playback failed:", err);
          });
        }
      }
    });

    let dividerElement = document.querySelector(".divider");
    if (dividerElement) {
      e.preventDefault();

      // Default offset
      let offset = dividerElement.offsetTop - 150;

      // Adjust the offset for screens with max-width of 768px
      if (window.matchMedia("(max-width: 768px)").matches) {
        offset = dividerElement.offsetTop - 120; // Change this value as needed
      }

      window.scrollTo({
        top: offset,
        behavior: "smooth",
      });
    }
  });
});
document.addEventListener("DOMContentLoaded", function () {
  const storyLink = document.querySelector('a[href="#our-story"]');
  const storyElement = document.getElementById("our-story");
  const rsvpLink = document.querySelector('a[href="#rsvp"]');
  const rsvpElement = document.getElementById("rsvp");

  function smoothScrollWithOffset(event, element, defaultOffset, mobileOffset) {
    event.preventDefault();

    let offset = defaultOffset;

    // Adjust the offset for screens with max-width of 768px
    if (window.matchMedia("(max-width: 768px)").matches) {
      offset = mobileOffset;
    }

    window.scrollTo({
      top: element.offsetTop - offset,
      behavior: "smooth",
    });
  }

  if (storyLink && storyElement) {
    storyLink.addEventListener("click", function (e) {
      smoothScrollWithOffset(e, storyElement, 110, 80); // adjust offsets as needed
    });
  }

  if (rsvpLink && rsvpElement) {
    rsvpLink.addEventListener("click", function (e) {
      smoothScrollWithOffset(e, rsvpElement, 110, 80); // adjust offsets as needed
    });
  }
});

function toggleReadMore() {
  var content = document.getElementById("story-content");
  var btnText = document.getElementById("read-more-btn");

  if (btnText.innerHTML === "Read More") {
    btnText.innerHTML = "Read Less";
    content.classList.add("show-full-story");
  } else if (btnText.innerHTML === "ավելին") {
    btnText.innerHTML = "ավելի քիչ";
    content.classList.add("show-full-story");
  } else {
    if (selectedLang === "eng") {
      btnText.innerHTML = "Read More";
    } else if (selectedLang === "arm") {
      btnText.innerHTML = "ավելին";
    }
    content.classList.remove("show-full-story");
  }
}
