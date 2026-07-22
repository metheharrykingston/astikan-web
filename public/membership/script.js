function chatWithExpert() {
  window.open("https://wa.me/+918076257344", "_blank");
}
const EmergencyBtn = {
  init() {
    const btn = document.getElementById("almBtn");
    if (btn) {
      btn.addEventListener("click", () => {
        setTimeout(() => {
          window.location.href = "tel:911";
        }, 400);
      });
    }
  },
};

const originalTitle = document.title;
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    document.title = "💓 Stay Healthy!";
  } else {
    document.title = originalTitle;
  }
});

const emergencyBtn = document.getElementById("emergencyBtn");

window.addEventListener("scroll", () => {
  if (window.scrollY > 150) {
    emergencyBtn.classList.add("show");
  } else {
    emergencyBtn.classList.remove("show");
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const rewardBtn = document.querySelector(".reward-wobble");

  setInterval(() => {
    rewardBtn.classList.add("animate");
    setTimeout(() => {
      rewardBtn.classList.remove("animate");
    }, 1000); 
  }, 4000); 
});


document
  .getElementById("loginModal")
  .addEventListener("shown.bs.modal", function () {
    const block = document.getElementById("questionBlock");
    const coinsBurst = document.getElementById("coinsBurst");
    const loginButtons = document.getElementById("loginButtons");
    const stars = document.querySelector(".floating-stars");
    const rewardSound = document.getElementById("rewardSound");
    const cube = block.querySelector(".cube");

    
    block.classList.remove("open", "opening");
    coinsBurst.classList.add("d-none");
    loginButtons.classList.add("d-none");
    stars.classList.add("d-none");
    cube.style.animationPlayState = "running";

    
    const tapOverlay = document.createElement("div");
    tapOverlay.className =
      "tap-overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50 rounded";
    tapOverlay.innerHTML =
      '<span class="text-white small fw-bold">Tap to Redeem ⭐</span>'; 
    tapOverlay.style.zIndex = "10";
    block.style.position = "relative"; 
    block.appendChild(tapOverlay);

    
    tapOverlay.addEventListener(
      "click",
      function handleTap(e) {
        e.preventDefault();
        e.stopPropagation();

        
        tapOverlay.remove();

        
        rewardSound.currentTime = 0;
        rewardSound
          .play()
          .then(() => {
            console.log("Sound bursting! 🎵");
          })
          .catch((e) => {
            console.error("Sound still failed:", e);
            
            startSequence();
          });

        
        startSequence();
      },
      { once: true }
    ); 

    function startSequence() {
      
      setTimeout(() => {
        stars.classList.remove("d-none");
      }, 200);

      
      setTimeout(() => {
        block.classList.add("opening");
        cube.style.animationPlayState = "paused";
      }, 1500);

      setTimeout(() => {
        block.classList.add("open");
        block.classList.remove("opening");
      }, 2000);

      
      setTimeout(() => {
        coinsBurst.classList.remove("d-none");
      }, 2200);

      
      setTimeout(() => {
        loginButtons.classList.remove("d-none");
      }, 3000);

      
      setTimeout(() => {
        document.getElementById("googleLoginBtn").focus();
      }, 3200);
    }
  });


document
  .getElementById("loginModal")
  .addEventListener("hidden.bs.modal", function () {
    const block = document.getElementById("questionBlock");
    const stars = document.querySelector(".floating-stars");
    const overlay = block.querySelector(".tap-overlay");
    if (overlay) overlay.remove(); 
    block.classList.remove("open", "opening");
    stars.classList.add("d-none");
    block.querySelector(".cube").style.animationPlayState = "running";
  });


window.addEventListener("load", function () {
  if (window.location.hash === "#loginModal") {
    const modal = new bootstrap.Modal(document.getElementById("loginModal"));
    modal.show();
  }
});
  window.addEventListener("load", () => {
    const loader = document.getElementById("page-loader");

    loader.style.opacity = "0";
    loader.style.visibility = "hidden";

    setTimeout(() => {
      loader.remove();
    }, 600);
  });

