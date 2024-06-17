const defaultOptions = {
  root: null,
  rootMargin: "0px",
  threshold: 0,
};

const initializeObserveAnimation = (targets, options = {}) => {
  const targetsLength = targets.length;

  if (targetsLength === 0) {
    console.error("initializeObserveAnimation: Target elements are not found.");
    return;
  }

  const mergedOptions = { ...defaultOptions, ...options };
  const observer = createObserver(mergedOptions, targetsLength);
  targets.forEach((target) => observer.observe(target));
};

const createObserver = (options, targetsLength) => {
  let observer;
  let activeCount = 0;

  const handleObserve = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // 要素が画面内に入ったら`data-animated`の値を`true`にする
        entry.target.setAttribute("data-animated", "true");
        // アニメーションした要素は監視をやめる
        observer.unobserve(entry.target);
        activeCount++;
      }
    });

    if (activeCount === targetsLength) {
      observer.disconnect();
    }
  };

  observer = new IntersectionObserver(handleObserve, options);
  return observer;
};

document.addEventListener("DOMContentLoaded", () => {
  const targetElements = document.querySelectorAll("[data-scroll-animation]");

  const options = {
    rootMargin: "10% 0px",
    threshold: 0.5,
  };

  initializeObserveAnimation(targetElements, options);
});
// slider
const sliderFrame = document.querySelector(".slider-frame");
const slider = document.querySelector(".slider");
const items = document.querySelectorAll("article");
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");

let itemCount = null;
const itemsDisplayed = () => {
  if (window.innerWidth > 900) {
    return (itemCount = 5);
  } else if (window.innerWidth > 600) {
    return (itemCount = 4);
  } else if (window.innerWidth <= 600) {
    return (itemCount = 3);
  }
};
itemsDisplayed();

const setWidth = () => {
  const itemWidth = sliderFrame.offsetWidth / itemCount;
  items.forEach((item) => {
    item.style.minWidth = `${itemWidth}px`;
  });
};
setWidth();

const detectScreenWidth = () => {
  window.addEventListener("resize", () => {
    itemsDisplayed();
    setWidth();
  });
};
detectScreenWidth();

let index = 0;
prevBtn.addEventListener("click", () => {
  if (index !== 0) {
    index--;
    slide();
    count = 0;
  }
});

nextBtn.addEventListener("click", () => {
  if (index !== items.length - itemCount) {
    index++;
    slide();
    count = 0;
  }
});

const slide = () => {
  const offset = (sliderFrame.offsetWidth / itemCount) * index;
  slider.style.transform = `translateX(-${offset}px)`;
};

let count = 0;
setInterval(() => {
  if (count > 3) {
    if (index < items.length - itemCount) {
      index++;
      slide();
    } else if (index >= items.length - itemCount) {
      index = 0;
      slide();
    }
    count = 0;
  } else {
    count++;
  }
}, 1000);
