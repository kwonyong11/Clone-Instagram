const log = console.log;
const container = document.querySelector(".container");
const slideList = document.querySelector(".slide-list");
const slideItem = document.querySelectorAll(".slide-item");
const LslideSwitch = document.querySelector('.slide-switch-left');
const RslideSwitch = document.querySelector('.slide-switch-right');
let slideLength = slideItem.length;
let i = 0;
slideList.style.left = `0px`;
let slideIndex = 0;
let containerWidth = 0;
const setLayout = () => {
    containerWidth = container.clientWidth;
    slideList.style.width = (containerWidth * slideLength) + 'px';
}
window.addEventListener('load', () => {
    setLayout();
})
window.addEventListener('resize', function () {
    setLayout();
    slideList.style.left = 0;
    slideIndex = 0;
});
LslideSwitch.addEventListener('click', () => {
    leftSlideHandler();
})
RslideSwitch.addEventListener('click', () => {
    rightSlideHandler();
})
function leftSlideHandler() {
    if (slideIndex === 0) return;
    slideIndex--;
    slideList.style.left = -(containerWidth * slideIndex) + 'px';
}
function rightSlideHandler() {
    if (slideIndex === slideLength - 1) return;
    slideList.style.left = -(containerWidth * (slideIndex + 1)) + 'px';
    slideIndex++;
}