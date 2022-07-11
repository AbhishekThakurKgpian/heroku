const socket=io('http://localhost:8000/', { transports : ['websocket'] });
var temp=1;
document.getElementById('microphone').addEventListener('click',()=>{
if(((document.getElementById('microphone').src).toString()).includes("microphone-lines-solid.svg")) {
  document.getElementById('microphone').src="microphone-lines-slash-solid.svg";
  document.getElementById('microphone').classList.remove("animation");
}else{
  document.getElementById('microphone').src="microphone-lines-solid.svg";
  document.getElementById('microphone').classList.add("animation");
}

})

//console.log(socket);t
onload=()=>{
const peer = new Peer();
let peerId;
peer.on('open', (id2) => {
console.log(id2);
socket.emit('myIdIs',id2);
socket.on('myIdIs1',id=>{
  console.log("user with id:",id," joined");

  
  const call = (id) => {  console.log("114 wala bhi run hua");
    var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    getUserMedia({ audio: true }, (mediaStream) => {
   
     // currentUserVideoRef.current.srcObject = mediaStream;
     // currentUserVideoRef.current.play();

     document.getElementById("muteSpeak").addEventListener('click',()=>{
      if(temp==1){
      mediaStream.getAudioTracks()[0].enabled=false;temp=0;}
      else {
        mediaStream.getAudioTracks()[0].enabled=true;temp=1;
      }
      })
 
      const call = peer.call(id, mediaStream);

      call.on('stream', (remoteStream) => {
      console.log(remoteStream);
      let audio=new Audio();
      audio.srcObject=remoteStream;
      audio.play();
      });
    });
  }
  call(id);

})
});

peer.on('call', (call) => {  console.log("Call function runned");
var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

getUserMedia({audio: true }, (mediaStream) => {
 // currentUserVideoRef.current.srcObject = mediaStream;
//  currentUserVideoRef.current.play();
document.getElementById("muteSpeak").addEventListener('click',()=>{
  if(temp==1){
  mediaStream.getAudioTracks()[0].enabled=false;temp=0;}
  else {
    mediaStream.getAudioTracks()[0].enabled=true;temp=1;
  }
  })
  call.answer(mediaStream);
  call.on('stream', function(remoteStream) {
    console.log(remoteStream);
    let audio=new Audio();
    audio.srcObject=remoteStream;
    audio.play();
  });
});
})


}



const form=document.getElementById('send-container');
const messageInput=document.getElementById('messageInput');
const messageContainer=document.querySelector(".container");
var audio=new Audio('ting.mp3') ;
let  interval3;
const append=(message,position)=>{
    const messageElement=document.createElement('div');
    messageElement.innerText=message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
}
const appendAudio=(message,position)=>{
  let blob=new Blob(message.chunks,{type:'audio/webm'});
 const messageElement = document.createElement("AUDIO");
 messageElement.style.display='none';

   messageElement.classList.add('message');
    messageElement.classList.add(position);
    
    messageElement.src=URL.createObjectURL(blob);
    messageElement.controls = true;

    messageContainer.append(messageElement);
  //  document.getElementsByTagName('body').append(messageElement);
  if(message.name!='you'){
    //append(`👆 Sended ${message.name}  `,'left');
    messageElement.play();}
    setTimeout(() => {
      messageElement.remove();
    }, 2000);
   
}
var flag;
form.addEventListener('submit',(e)=>{ e.preventDefault();
    flag=0;
   for(var i=0;i<(messageInput.value).length;i++){
  
if (Array.from(messageInput.value)[i]!=' ') {
  flag=1  
}
   }
    if(flag==1)
    {
    const message=messageInput.value;
    append(`you: ${message}`,'right');
    socket.emit('send',message);
    messageInput.value='';}
})




const name=prompt("Enter Your Name");
//console.log(name);
socket.emit('new-user-joined',name);
socket.on('user-joined',data=>{
append(`${data} joined the chat`,'right');
socket.emit('IamOnline');
})
socket.on('receive',data=>{
append(`${data.name}: ${data.message}`,'left');

   audio.play(); 


})





socket.on('audioReceived',data=>{

 //console.log(data);
  appendAudio(data,'left');

})
let userNo=-1;
socket.on('left',name=>{
append(`${name} left the chat`,'left');
})
socket.on('set-zero',()=>{
userNo=0;
updateUser(userNo);
})
socket.on('IamOnline',()=>{
userNo++;
updateUser(userNo);
})
socket.on('IamOnline-2',()=>{
  socket.emit('IamOnline-1');
})
socket.on('ILeft',()=>{
userNo--;
updateUser(userNo);
})
// socket.on('Online',data=>{
// document.getElementById('Online').innerHTML=`${data+1} Users Online`;
// })
function updateUser(userNo) {
  document.getElementById('Online').innerHTML=`${userNo+2} Users Online`;
}
var dropCallOrCall=1;
var flag=1;var random=1;var interval1;var device=navigator.mediaDevices.getUserMedia({audio:true});
var chunks=[];
var recorder;var interval2;
// document.getElementById("audio").addEventListener("click",callOrDrop);
function callOrDrop() {
if((dropCallOrCall==1)){ dropCallOrCall=0;
  device.audio=true;
    calling();
 }
  else{ dropCallOrCall=1;
clearInterval(interval2);
if(flag==0){ calling();document.getElementById("audio").innerHTML="Call";
  }
}}
function calling (){ 



  if(flag==1){flag=0;
  interval1=setInterval(() => {let recorder;
    if(random==1){
      document.getElementById("audio").style.backgroundColor = "red";
      document.getElementById("audio").innerHTML="Drop";
      random=0;
    }
    else{
      document.getElementById("audio").style.backgroundColor = "green";random=1;
      document.getElementById("audio").innerHTML="Drop";
    }
  }, 500);

  device.then(
    stream=>{
      recorder=new MediaRecorder(stream);
      recorder.ondataavailable=e=>{
        chunks.push(e.data);
        if(recorder.state=='inactive'){
          socket.emit('sendingAudio',chunks);
         // let blob=new Blob(chunks,{type:'audio/webm'});
     
         // socket.emit('sendingAudio',blob);
        appendAudio({chunks:chunks,name:"you"},'right');
          chunks=[];      recorder.start(); 
        }
      }
      recorder.start(); 
 interval3=  setInterval(() => {
  recorder.stop();
}, 1000);
    }
  );


}
else{flag=1;
  clearInterval(interval1);
  document.getElementById("audio").style.backgroundColor = "green";
  document.getElementById("audio").innerHTML="Call";

  clearInterval(interval3);
 //  console.log(recorder);
 device.audio=false;
   
}







}
