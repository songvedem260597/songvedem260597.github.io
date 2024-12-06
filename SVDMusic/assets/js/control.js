/*---------------Variable-----------------*/
const signUpBtnHeader = document.getElementById("signUpHeader");
const signInBtnHeader = document.getElementById("signInHeader");
const signUpButton = document.getElementById("signUp");
const signInButton = document.getElementById("signIn");
const overlay = document.getElementById("overlay");
const closePopLogin = document.getElementById("close_login_popup");
const container_login = document.getElementById("container_login");
const joinButton = document.getElementById("join-now");
const logoButton = document.querySelector(".logo-mobile");
const closeNav = document.querySelector(".close-logo");
const logoTablet = document.querySelector(".logo-tablet");
const isIndex = document.querySelector(".ms-nav-bar a");
const overlayNavBarMobile = document.querySelector(".overlay-nav-bar-mobile");
const btnLoginMobile = document.querySelector(".login-mobile");
let player;
let switchNavBar = true;

/*----------------Carousel----------------*/
function initializeCarousel(selector, items) {
  $(selector).owlCarousel({
    loop: false,
    margin: 20,
    nav: true,
    navText: [
      '<span class="material-icons-outlined">arrow_back_ios</span>',
      '<span class="material-icons-outlined">arrow_forward_ios</span>',
    ],
    responsive: {
      0: { items: 2 },
      600: { items: 3 },
      740: { items: 4 },
      1024: { items: items },
    },
  });
}

initializeCarousel(".carousel-suggestion-song", 8);
initializeCarousel(".carousel-favorite-artist", 8);
initializeCarousel(".carousel-mv-song", 4);
initializeCarousel(".carousel-area-song", 3);

/*---------------JS Navbar-------------*/
closeNav.addEventListener("click", () => {
  changeBgNavBar();
});

logoButton.addEventListener("click", () => {
  changeBgNavBar();
  overlayNavBarMobile.style.display = "block";
});

logoTablet.addEventListener("click", () => {
  changeBgNavBar();
  overlayNavBarMobile.style.display = "block";
});

function changeBgNavBar() {
  if (switchNavBar) {
    document.getElementById("nav-bar").style.width = "100%";
    document.getElementById("nav-bar").style.height = "auto";
    document.getElementById("nav-bar").style.background = "var(--blue-color)";
    document.getElementById("header").style.zIndex = "8";
    document.getElementById("close-id").style.display = "block";
    switchNavBar = false;
  } else {
    document.getElementById("nav-bar").style.width = "75px";
    document.getElementById("close-id").style.display = "none";
    document.getElementById("header").style.zIndex = "100";
    document.getElementById("nav-bar").style.height = "75px";
    document.getElementById("nav-bar").style.background = "transparent";
    switchNavBar = true;
  }
}

overlayNavBarMobile.addEventListener("click", () => {
  document.getElementById("nav-bar").style.height = "75px";
  document.getElementById("nav-bar").style.background = "transparent";
  document.getElementById("close-id").style.display = "none";
  overlayNavBarMobile.style.display = "none";
  switchNavBar = true;
});

/*---------------Scroll Navbar-------------*/
window.onscroll = function () {
  scrollFunction();
};

function scrollFunction() {
  if (document.body.scrollTop > 70 || document.documentElement.scrollTop > 70) {
    document.getElementById("header").style.backgroundColor =
      "var(--blue-color)";
    document.getElementById("search").style.backgroundColor = "var(--bg-color)";
    document.getElementById("input-search").style.color = "var(--white-color)";
    document.getElementById("logo").style.backgroundColor = "var(--blue-color)";
    document.getElementById("search-result").style.backgroundColor =
      "var(--blue-color)";
  } else {
    document.getElementById("header").style.backgroundColor = "transparent";
    document.getElementById("search").style.backgroundColor =
      "var(--bg-search)";
    document.getElementById("input-search").style.color = "var(--blue-color)";
    document.getElementById("logo").style.backgroundColor = "transparent";
    document.getElementById("search-result").style.backgroundColor =
      "var(--blue-color)";
  }
}

/*---------------Toast Message-------------*/
const main = document.getElementById("toast");
if (main) {
  const toast = document.querySelector(".toast");
  toast.onclick = function (e) {
    if (e.target.closest(".toast__close")) {
      main.removeChild(toast);
    }
  };
}
