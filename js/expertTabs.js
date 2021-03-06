class StudentQuestion{
  constructor(chatNode, chatId){
    this.chatNode = chatNode;
    this.chatId = chatId;
    this.unresponded = !!chatNode.querySelector('.image-frame__badge')
    allStudentQuestions.push(this);
  }

  studentName(){
    return this.chatNode.querySelector('.heading--level-4').textContent
  }

  question(){
    return this.chatNode.querySelector('.util--break-word').textContent
  }

  addTrackerElement(trackerElement){ 
    this.chatNode.querySelector('.media-block__content').innerHTML += trackerElement
  }

  // checkUnresponded(){
  //   if (this.chatNode.querySelector('image-frame__badge--color-blue')){
  //     return this.chatNode.querySelector('image-frame__badge--color-blue').textContent
  //   }  
  // }
}

var chatId = 0;
var allStudentQuestions = [];

function createTrackerElement(chatId){
  return '<div class="tracker" data-chatId="'+ chatId +'">Track</div>'
}


function createStudentQuestion(chatNode){
  let newStudentQuestion = new StudentQuestion(chatNode, chatId);
  chatId++;
  newStudentQuestion.addTrackerElement(createTrackerElement(newStudentQuestion.chatId));
  return newStudentQuestion;
}

function createStudentQuestionsFromDom(){
  var chatNodes = document.querySelectorAll('.fc--question-node');
  chatNodes.forEach(function(chatNode){
    createStudentQuestion(chatNode);
  });
}

// will probably put this in a function that returns the observer
// remove event listeners when nodes are removed
var chatNodeObserver = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    if(mutation.addedNodes[0] && mutation.addedNodes[0].classList[0] === 'fc--question-node'){
      let stuQue = reloadOrCreateStudentQuestion(mutation.addedNodes[0]);
      addUnrespondedObserverToChatNode(stuQue.chatNode)
    }
  });    
});

// This observer needs to be set when nodes are added/removed

var unrespondedObserver = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    if(mutation.addedNodes[0] || mutation.removedNodes[0]){
      let chatNode = getChatNodeFromUnrespondedObserver(mutation.target);
      let chatId = parseInt(getChatIdFromChatNode(chatNode));
      let studentQuestion = findStudentQuestionByChatId(chatId)
      studentQuestion.chatNode = chatNode;
      let tab = findTab(chatId);
      checkChatStatus(studentQuestion, tab);
    }
  });    
});

function addUnrespondedObserverToChatNode(chatNode){
  targetElem = chatNode.querySelector('.image-frame--fixed-size-large');
  config = { attributes: true, childList: true, characterData: true };
  unrespondedObserver.observe(targetElem, config)
}


function getChatNodeFromUnrespondedObserver(targetNode){
  return targetNode.parentNode.parentNode.parentNode.parentNode
}

function getChatIdFromChatNode(chatNode){
  return chatNode.querySelector('.tracker').dataset.chatid 
}

function getTabFromChatId(chatId){
  return document.querySelector('#chat_' + chatId + '_tab');
}

// When the unresponded observer triggers, check for matching tab.
// If matching tab exists, change it's unresponded status
// When a tab is created, check it's unresponded status

function reloadTracker(chatNode, studentQuestion){
  let trackerElement = createTrackerElement(studentQuestion.chatId);
  chatNode.querySelector('.media-block__content').innerHTML += trackerElement;
  studentQuestion.chatNode = chatNode;
  trackStudent(studentQuestion.chatNode);
}

function reloadOrCreateStudentQuestion(chatNode){
  let question = chatNode.querySelector('.util--break-word').textContent;
  let studentName = chatNode.querySelector('.heading--level-4').textContent;
  let found = false;
  let student = '';
  allStudentQuestions.forEach(function(studentQuestion){
    if (!found && studentQuestion.studentName() === studentName && studentQuestion.question() === question){
      reloadTracker(chatNode, studentQuestion);
      found = !found;
      student = studentQuestion
      if(findTab(studentQuestion.chatId)){
        checkChatStatus(studentQuestion, findTab(studentQuestion.chatId))
      }
    }
  });
  if (!found){
    student = createStudentQuestion(chatNode);
    trackStudent(student.chatNode);
  }
  return student;
}



// Tabs
function createTabBar(){
  let rightChat = document.querySelector('.util--anchor__frame > div'); 
  let tabBar = document.createElement("div");
  tabBar.id = "chat-tab-bar";
  rightChat.insertBefore(tabBar, rightChat.firstChild);
  return tabBar;
}

function createTab(studentQuestion){
  let chatTab = '<div class="chat-tab" id="chat_' + studentQuestion.chatId +'_tab" data-chatId="' + studentQuestion.chatId +'">'+ studentQuestion.studentName();
  chatTab += ' <span class="close-tab">X</span></div>';
  document.querySelector('#chat-tab-bar').innerHTML += chatTab;
  let tabs = document.querySelectorAll('#chat-tab-bar > .chat-tab')
  let tabElement = document.querySelector('#chat-tab-bar').lastChild;
  attachTabListener(tabs);
  checkChatStatus(studentQuestion, tabElement);
}

function checkChatStatus(studentQuestion, tab){
  if (studentQuestion.chatNode.querySelector('.image-frame__badge--color-blue')) {
    tab.classList.add('unresponded');
  } else {
    tab.classList.remove('unresponded');
  }
}

function findStudentQuestionByChatId(chatId){
  var studentQuestionMatch;
  allStudentQuestions.forEach(function(studentQuestion){
    if (studentQuestion.chatId === chatId){
      studentQuestionMatch = studentQuestion;
    }
  })
  return studentQuestionMatch;
}

function toggleUnresponded(tab){
  tab.classList.toggle('unresponded')
} 

function findTab(chatId){
  return document.querySelector('#chat_' + chatId + '_tab')
}

// Event Listeners

function attachTabListener(tabs){
  tabs.forEach(function(tab){
    tabClick(tab);
    closeTab(tab);
  });
}

function closeTab(tab){
  tab.querySelector('.close-tab').addEventListener('click', function(e){
    tab.parentNode.removeChild(tab);
  })
}

function tabClick(tab){
  tab.addEventListener('click', function(e){
    let chatId = parseInt(e.srcElement.dataset.chatid);
    let foundStudentQuestion = findStudentQuestionByChatId(chatId);
    foundStudentQuestion.chatNode.click();
  });
}

function attachTrackStudentListeners(){
  allStudentQuestions.forEach(function(studentQuestion){
    trackStudent(studentQuestion.chatNode);
  });
}

function attachTrackUnrespondedObservers(){
  allStudentQuestions.forEach(function(studentQuestion){
    addUnrespondedObserverToChatNode(studentQuestion.chatNode)
  });
}

function trackStudent(studentNode){
 studentNode.querySelector('.tracker').addEventListener('click', function(e){
  let chatId = parseInt(e.srcElement.dataset.chatid);
  let studentQuestionReturn = findStudentQuestionByChatId(chatId);
  if (!document.querySelector('#chat-tab-bar')){
    createTabBar();
    createTab(studentQuestionReturn);
  } else {
    createTab(studentQuestionReturn);
  }
 });
}

// To Run

createStudentQuestionsFromDom();
var foo = document.querySelector('.list--last-child-border');
var config = { attributes: true, childList: true, characterData: true };
chatNodeObserver.observe(foo, config);
attachTrackStudentListeners();
attachTrackUnrespondedObservers();


// Every Student should have a "Track Chat" buttton added to the sidebar
// On click of that button, a tab will open up over the full chat
// The track button will change to "untrack" which will remove that chat from tab bar
// The tab bar is created when the user is following at least one person, otherwise remove the bar
// Multiple clicks of track button must not create duplicate tabs
// When chats change status, they should be restored as a current chat, not made into a new chat

// Tabs should appear over full window
// Tabs contain a students name and an x button to close the chat
// The tab should know when a student has responded by looking at the blue circle element
// If that is triggered, the chat bar will change from gray to blue
// When the tab is clicked, it should open that student's chat


var chatNodes = document.querySelectorAll('.fc--question-node'); //grabs all questions from side

var fullQuestionList = document.querySelector('.fc--questions-list'); //give dom element of all the questions

chatNodes.forEach(function(chat){
  chat.querySelector()
})

chatNodes[0].querySelector('.heading--level-4').textContent //grabs name

chatNodes[0].querySelector('.media-block__media').innerHtml += '<div>Track Me</div>'; //adds button

chatNodes[0].querySelector('.image-frame__badge--color-blue') // gets unanswered response number if present

// Tab Functions 

rightChat = document.querySelector('.util--anchor__frame > div'); // grab right window

var tabBar = document.createElement("div"); //creates tab bar

tabBar.id = "chat-tab-bar";

tabBar.innerHTML += '<div class="chat-tab" id="chat_1_tab">Student Name - 2 <span class="close-tab">X</span></div>'; //creates tabs Html

rightChat.insertBefore(tabBar, rightChat.firstChild); //adds Tabs

chatNodes.forEach(function(chatNode){
 foo = chatNode.querySelector('.image-frame--fixed-size-large');
 config = { attributes: true, childList: true, characterData: true };
 unrespondedObserver.observe(foo,config)
})



