(async ()=>{
    const userId = await axios.post('/signup_get_id');
    const userIdData = await userId.data;
    console.log(userIdData);
    // const getTarget = (elem, name) => {
    //     while (!elem.name==name) {
    //         console.log(elem.name)
    //         elem = elem.parentNode;
    //         if (elem.nodeName == 'BODY') {
    //             elem = null;
    //             return;
    //         }
    //     }
    //     return elem;
    // }
    const signupBox = document.querySelector('.signup-box');
    const toastMessage = document.querySelector('.toast-message');
    signupBox.addEventListener('change', e=>{
        let id;
        let name;
        let nickname;
        let password;
        let idIsOverlap = false;
        let nicknameIsOverlap = false
        if(e.target.name=='id') id = e.target;
        if(e.target.name=='name') name = e.target;
        if(e.target.name=='nickname') nickname = e.target;
        if(e.target.name=='password') password = e.target;
        if(id) {
            console.log(id.value.length)
            for(let i=0; i<userIdData.length; i++){
                if(userIdData[i].id == id.value) idIsOverlap = true;
            }
            if(id.value.length < 8){
                id.style.backgroundColor = '#ff3333'
                id.style.color = '#ffffff'
                toastMessage.innerHTML = '8자 이상 입력해주세요.'
                toastMessage.style.opacity = '1'

            } else if(idIsOverlap){
                id.style.backgroundColor = '#ff3333'
                id.style.color = '#ffffff'
                toastMessage.style.opacity = '1'
                toastMessage.innerHTML = '아이디가 중복됩니다.'
            } 
            else {
                id.style.backgroundColor = '#66ff33'
                id.style.color = '#000'
                toastMessage.style.opacity = '0'
            }
        }
        if(nickname) {
            console.log(nickname.value.length)
            for(let i=0; i<userIdData.length; i++){
                if(userIdData[i].nickname == nickname.value) nicknameIsOverlap = true;
            }
            if(nickname.value.length < 4){
                nickname.style.backgroundColor = '#ff3333'
                nickname.style.color = '#ffffff'
                toastMessage.innerHTML = '4자 이상 입력해주세요.'
                toastMessage.style.opacity = '1'

            } else if(nicknameIsOverlap){
                nickname.style.backgroundColor = '#ff3333'
                nickname.style.color = '#ffffff'
                toastMessage.style.opacity = '1'
                toastMessage.innerHTML = '닉네임이 중복됩니다.'
            } 
            else {
                nickname.style.backgroundColor = '#66ff33'
                nickname.style.color = '#000'
                toastMessage.style.opacity = '0'
            }
        }
    })
})()