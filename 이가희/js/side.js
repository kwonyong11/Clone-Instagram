const followBtn = document.querySelectorAll(".follow_button");
let fb = false;

if (!fb){
  for(let x = 0; x < 5; x++){
    followBtn[x].addEventListener("click", () => {
    followBtn[x].innerHTML = '팔로잉';
    fb = true;
    console.log(fb);
    }   
  )}
} 

  

