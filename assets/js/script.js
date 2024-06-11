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
