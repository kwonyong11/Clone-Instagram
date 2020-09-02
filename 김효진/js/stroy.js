const log = console.log;
//window DOM 객체
const rightBtn = document.querySelector(".slide-switch-right");
const leftBtn = document.querySelector(".slide-switch-left");
const storyBox = document.querySelector(".box");
let i = 0;
// log(rightBtn);
rightBtn.addEventListener("click", () => {
  i = 0;
  const time = setInterval(() => {
    storyBox.scrollLeft += 5;
    if (i === 20) clearInterval(time);
    i++;
  }, 5);
});

leftBtn.addEventListener("click", () => {
  i = 0;
  const time = setInterval(() => {
    storyBox.scrollLeft -= 5;
    if (i === 20) clearInterval(time);
    i++;
  }, 5);
});
