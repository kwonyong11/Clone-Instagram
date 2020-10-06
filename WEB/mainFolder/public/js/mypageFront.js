(async ()=>{
  const myPageAxios = await axios.post('/mypage');
  const myPageAxiosData = await myPageAxios.data;
  const mainAxios = await axios.get('/main_data');
  const mainAxiosData = await mainAxios.data;
  const followerAxios = await axios.get('/follower_length');
  const followerAxiosData = await followerAxios.data;
  const followAxios = await axios.get('/follow_length');
  const followAxiosData = await followAxios.data;

  console.log(myPageAxiosData);

  let feedSlideItems=[]
  const feedList = document.querySelector('.feed-list');
  const feedSlideList = document.querySelector('.feed-slide-list'); 
  const postLength = document.querySelector('.post-length');
  
  const userNickname = document.querySelector('.user-nickname');
  const followerLength = document.querySelector('.follower-length');
  const followLength = document.querySelector('.follow-length');
  const rightFeedNickname = document.querySelector('.right-feed-nickname');
  const rightFeedContents = document.querySelector('.right-feed-contents');
  const hidden = document.querySelector('.hidden');
  const rightFeedList = document.querySelector('.right-feed-list');
  const userNavImg = document.querySelector('.user_img');
  const profileImage = document.querySelector('.profileImage');
  const myPageHeader = document.querySelector('.my-page-header');
  userNavImg.style.backgroundImage =  `url('../data/${mainAxiosData.id}/1.jpg')`;
  profileImage.style.backgroundImage = `url('../data/${mainAxiosData.id}/1.jpg')`;
  
  userNickname.innerHTML = mainAxiosData.nick;
  postLength.innerHTML = myPageAxiosData.post.length;
  followerLength.innerHTML = followerAxiosData.length-1;
  followLength.innerHTML = followAxiosData.length-1;
  rightFeedNickname.innerHTML = mainAxiosData.nick;
  
  // 동적으로 게시글 li 생성
  for(let i=0; i<myPageAxiosData.post.length; i++) {
    const feedItems = document.createElement('li');
    feedItems.dataset.post_id = myPageAxiosData.post[i].post_id;
    feedItems.dataset.imageCount = myPageAxiosData.images[i].length;
    feedItems.dataset.content = myPageAxiosData.post[i].content;
    feedItems.dataset.upload_date = myPageAxiosData.post[i].upload_date.split('T')[0];
    feedItems.className = 'feed-items';
    feedItems.style.backgroundImage = `url('../data/${myPageAxiosData.post[i].post_id}/1.jpg')`
    feedList.appendChild(feedItems);
  }
  const feedSlideContainer = document.querySelector('.feed-slide-container');
  const feedPostModalContainer = document.querySelector('.feed-post-modal-container');
  const getTarget = (elem, className)=>{
    while(!elem.classList.contains(className)){
      elem = elem.parentNode;
      if(elem.nodeName == 'BODY'){
        elem = null;
        return;
      }
    }
    return elem;
  }
  myPageHeader.addEventListener('click', async(e)=>{
    const userSecession = getTarget(e.target, 'user-secession')
    if(userSecession) {
      const password = window.prompt('비밀번호를 입력해주세요(확인 시 바로 탈퇴됩니다.)');
      const isTrue = await axios.post('/is_user', {password})
      const isTrueData = await isTrue.data;
      if(isTrueData.startsWith('true')) {
        await axios.post('/delete_user');
        window.location.href = '/';
        alert('탈퇴 되었습니다. 그동안 감사합니다.')
      } else {
        alert('비밀번호가 틀렸습니다.')
      }
    }
  })
  feedList.addEventListener('click', async(e)=>{
    const feedItem = getTarget(e.target, 'feed-items');
    // 게시글 클릭시 동적으로 이미지 개수 만큼 li 생성
    if(feedItem){
      for(let i=0; i<feedItem.dataset.imageCount; i++){
        const feedSlideItems = document.createElement('li');
        feedSlideItems.className = 'feed-slide-items';
        feedSlideItems.style.backgroundImage = `url('../data/${feedItem.dataset.post_id}/${i+1}.jpg')`;
        feedSlideList.appendChild(feedSlideItems);
      }
      feedPostModalContainer.style.opacity = '1';
      feedPostModalContainer.style.zIndex = 20;
    }
    
    hidden.value = feedItem.dataset.post_id;
    feedSlideItems = document.querySelectorAll('.feed-slide-items');
    feedSlideListWidth = feedSlideContainer.clientWidth * feedSlideItems.length;
    feedSlideList.style.width = `${feedSlideListWidth}px`;
    rightFeedContents.children[0].innerHTML = feedItem.dataset.content;
    rightFeedContents.children[1].innerHTML = feedItem.dataset.upload_date;


    let commentAxios = await axios.post('/feed_comment_data', {postID : hidden.value});
    let commentAxiosData = commentAxios.data;
    let commentIndex = 0;

    let commentHTML = await fetch('../lib/mypagecomment');
    let commentText = await commentHTML.text();
    console.log(commentAxiosData);

    const rightFeedImage = document.querySelector('.right-feed-image');
    rightFeedImage.style.backgroundImage = `url('../data/${mainAxiosData.id}/1.jpg')`;

    for (let j = 0; j < commentAxiosData.length; j++) {
      if (feedItem.dataset.post_id == commentAxiosData[j].post_id) {
        rightFeedList.innerHTML += commentText;
        rightFeedList.children[commentIndex].children[0].style.backgroundImage = `url('../data/${commentAxiosData[j].id}/1.jpg')`;
        rightFeedList.children[commentIndex].children[1].innerHTML = commentAxiosData[j].nickname;
        rightFeedList.children[commentIndex].children[2].innerHTML = commentAxiosData[j].upload_date.split('T')[0];
        rightFeedList.children[commentIndex].children[3].innerHTML = commentAxiosData[j].comment;
        commentIndex++;
      };
    }
    
  })

    // <li class="right-feed-items">
    //     <a href="" class="right-feed-image"></a>
    //     <p class="right-feed-nickname">whdlsxo123</p>
    //     <p class="right-feed-date">whdlsxo123</p>
    //     <p class="right-feed-comment">안녕하세요</p>
    // </li> 

  feedSlideList.style.left = 0;
  let listIndex = 0;
  feedPostModalContainer.addEventListener('click',async (e)=>{
    let today = new Date();   
    let year = today.getFullYear(); // 년도
    let month = today.getMonth() + 1;  // 월
    let date = today.getDate();  // 날짜
    const leftButton = getTarget(e.target, 'feed-slide-switch-left');
    const rightButton = getTarget(e.target, 'feed-slide-switch-right');
    const modalBox = getTarget(e.target, 'feed-post-modal-container');
    const slideBox = getTarget(e.target, 'feed-slide-container');
    const rightBox = getTarget(e.target, 'feed-post-right-section');
    const submit = getTarget(e.target, 'right-feed-bottom-submit');
    
    if(submit){
      if(submit.previousElementSibling){

        await axios.post('/feed_insert_comment', {postID: hidden.value, comment_content: submit.previousElementSibling.value});
        const rightFeedItems = document.createElement('li');
        const rightFeedImage = document.createElement('a');
        const rightFeedNickname = document.createElement('p');
        const rightFeedDate = document.createElement('p');
        const rightFeedComment = document.createElement('p');
        rightFeedItems.className = 'right-feed-items';
        rightFeedImage.className = 'right-feed-image';
        rightFeedNickname.className = 'right-feed-nickname';
        rightFeedDate.className = 'right-feed-comment-date';
        rightFeedComment.className = 'right-feed-comment';
        rightFeedImage.style.backgroundImage = `url('../data/${myPageAxiosData.post[0].id}/1.jpg')`;
        rightFeedNickname.innerHTML = myPageAxiosData.post[0].nickname;
        rightFeedDate.innerHTML = `${year}-${month}-${date}`;
        rightFeedComment.innerHTML = submit.previousElementSibling.value;
        rightFeedItems.appendChild(rightFeedImage);
        rightFeedItems.appendChild(rightFeedNickname);
        rightFeedItems.appendChild(rightFeedDate);
        rightFeedItems.appendChild(rightFeedComment);
        rightFeedList.appendChild(rightFeedItems);
        submit.previousElementSibling.value = null;
      }
    }
    if(leftButton){
      if(listIndex === 0){
        return;
      }
      listIndex--;
      feedSlideList.style.left = `-${feedSlideContainer.clientWidth * listIndex}px`;
    } else if(rightButton) {
      if(listIndex === feedSlideItems.length-1){
        return;
      }
      listIndex++;
      feedSlideList.style.left = `-${feedSlideContainer.clientWidth * listIndex}px`;
    } else if(rightBox){
    } else if(slideBox){
    } else if(modalBox){
      modalBox.style.opacity = '0';
      feedPostModalContainer.style.zIndex = 0;
      feedSlideList.style.left = 0;
      listIndex = 0;

      for(let i=0; i<feedSlideItems.length; i++){
        feedSlideItems[i].remove();
      }
      const commentItems = document.querySelectorAll('.right-feed-items');
      for(let i=0; i<commentItems.length; i++){
        commentItems[i].remove();
      }
    }

  })

  const rightFeedHeader = document.querySelector('.right-feed-header');
  const userModal_container = document.querySelector('.userModal-container');
  const cancelModalHandler = (e) => {
    if (e.target.className === `userModal-container` || e.target.className === `userModal-menu cancle`) {
      userModal_container.style.display = `none`;
    }
  }
  rightFeedHeader.addEventListener('click', (e) => {
    const modalButton = getTarget(e.target, 'modal-button');
    if(modalButton) {
      userModal_container.style.display = 'flex';
      console.log(hidden.value);
    }
  })

  userModal_container.addEventListener('click', cancelModalHandler);

  const delfeedItems = document.querySelectorAll('.feed-items');
  const deletePost = document.querySelector('#delete-post');
  deletePost.addEventListener('click', async () => {
    console.log(hidden.value);
    const id = hidden.value;
    await axios.post('/new_delete' , {id} );
    userModal_container.style.display="none";
    feedPostModalContainer.style.zIndex = 0;
    feedPostModalContainer.style.opacity = '0';
    for(let i=0; i<delfeedItems.length; i++){
      if(delfeedItems[i].dataset.post_id == id){
        delfeedItems[i].remove();
      }
    }
  })
  
  
  window.addEventListener('resize',()=>{
    feedSlideListWidth = feedSlideContainer.clientWidth * feedSlideItems.length;
    feedSlideList.style.width = `${feedSlideListWidth}px`;
    feedSlideList.style.left = 0;
    listIndex = 0;
  })
})()