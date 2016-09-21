class StudentQuestion{
  constructor(chatNode, chatId){
    this.chatNode = chatNode;
    this.chatId = chatId++;
  }

  studentName(){
    return this.chatNode.querySelector('.heading--level-4').textContent
  }

  addTrackButton(){ //This function should take the argument of a button instead of hardcode
    return this.chatNode.querySelector('.media-block__media').innerHtml += '<div>Track Me</div>'
  }

  checkUnresponded(){
    if (this.chatNode.querySelector('image-frame__badge--color-blue')){
      return this.chatNode.querySelector('image-frame__badge--color-blue').textContent
    }  
  }


}




// Every Student should have a "Track Chat" buttton added to the sidebar
// On click of that button, a tab will open up over the full chat
// The track button will change to "untrack" which will remove that chat from tab bar
// The tab bar is created when the user is following at least one person, otherwise remove the bar

// Tabs should appear over full window
// Tabs contain a students name and an x button to close the chat
// The tab should know when a student has responded by looking at the blue circle element
// If that is triggered, the chat bar will change from gray to blue
// When the tab is clicked, it should open that student's chat

var chatNodes = document.querySelectorAll('.fc--question-node'); //grabs all questions from side

chatNodes.forEach(function(chat){
  chat.querySelector()
})

chatNodes[0].querySelector('.heading--level-4').textContent //grabs name

chatNodes[0].querySelector('.media-block__media').innerHtml += '<div>Track Me</div>'; //adds button

chatNodes[0].querySelector('image-frame__badge--color-blue') // gets unanswered response number if present

// Tab Functions 

rightChat = document.querySelector('.util--anchor__frame > div'); // grab right window

var tabBar = document.createElement("div"); //creates tab bar

tabBar.id = "chat-tab-bar";

tabBar.innerHTML += '<div class="chat-tab" id="chat_1">Student Name - 2 <span>X</span></div>'; //creates tabs Html

rightChat.insertBefore(tabBar, rightChat.firstChild); //adds Tabs



