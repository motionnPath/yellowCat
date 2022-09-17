import {abi,contractAddress} from "../constants.js";
import { ethers } from "../ethers-5.6.esm.min.js";

let listOfmembers = [];

await getMembers();


    let l = listOfmembers.length;

    let currentDiscussionPartner = "";  
    for(let i=0; i<l; i++){
        
        if(document.getElementById(listOfmembers[i]) != null){
            document.getElementById(listOfmembers[i]).onclick = (e)=>{

                currentDiscussionPartner = e.target.id;
    
                console.log(currentDiscussionPartner)
                //testing this 
    
            }

        }
        
    }

    
setInterval(async ()=>{
    
    for(let i=0; i<listOfmembers.length; i++){

        if(document.getElementById(listOfmembers[i]) != null){

            let element = document.getElementById(listOfmembers[i]);
    
                if(listOfmembers[i] == currentDiscussionPartner){
                    element.style.color = 'red';
                }else{
                    element.style.color = 'black';
                }

        }
        
    }
},100)





await getDisscusionFrom();
await getDisscusionTo();







try{
    document.getElementById("send").onclick =async()=> {  
        //
        await sendMessage()
        
        
    };
}catch(e){

}






// working perfectly !! 
export async function getMembers(){

    if (typeof window.ethereum !== "undefined") {

        console.log("waiting for room member ...")

        const provider = new ethers.providers.Web3Provider(window.ethereum)
        await provider.send('eth_requestAccounts', [])
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        
    
    try {
        
        let members = await contract.getMembers();
        console.log(members)
        let len = members.length;
        for(let i = 0; i< len; i++){

            listOfmembers.push(members[i])
            document.getElementById('members').innerHTML += `
            <button class="members" >
                <div class="circle"></div> <h3 id=${members[i]}> ${members[i]} </h3>
            </button>` 
            
        }
        
       
    } catch (error) {
        console.log(error)
      }
    } else {
        connectButton.innerHTML = "Please install MetaMask"
    }

}



function getMsg(){
    
    return document.getElementById("msg").value;
}


async function sendMessage(/*_from,_to,_msg*/){

    if (typeof window.ethereum !== "undefined") {

        
        
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        await provider.send('eth_requestAccounts', [])
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
    
    try {

        let signerAddr = await signer.getAddress()
        let signerName = await contract.addrToName(signerAddr)

        // must be changed : 
        await contract.sendMessage(signerName,currentDiscussionPartner,getMsg());
        
        console.log(signerName,"sending a message to ",currentDiscussionPartner)
        document.getElementById('msg').value = "";
        
        
    } catch (error) {
        console.log('error =====',error)
    }
    await getDisscusionFrom();
    await getDisscusionTo();
    } else {
        connectButton.innerHTML = "Please install MetaMask"
    }

}

// solidity fct: getFullConversation(string memory _from,string memory _to)

async function getDisscusionFrom(){
    if (typeof window.ethereum !== "undefined") {

        console.log("getting discussion ...")

        const provider = new ethers.providers.Web3Provider(window.ethereum)
        await provider.send('eth_requestAccounts', [])
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
    
    try {
        let signerAddr = await signer.getAddress();
        let signerName = await contract.addrToName(signerAddr)
        let msg= await contract.getFullConversation(signerName,currentDiscussionPartner); 
        
        console.log("msg from =", await msg)
     
        // muss geandert werden
        let l= msg.length;
   
        let final_msg = msg[l-1];
        
        
        document.getElementById('display_it').innerHTML +=`<div class="from"> ${final_msg} </div>`
    
    } catch (error) {
        console.log('error =====',error)
      }
    } else {
        connectButton.innerHTML = "Please install MetaMask"
    }
}
async function getDisscusionTo(){
    if (typeof window.ethereum !== "undefined") {

        console.log("getting discussion ...")

        const provider = new ethers.providers.Web3Provider(window.ethereum)
        await provider.send('eth_requestAccounts', [])
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
    
    try {
        let signerAddr = await signer.getAddress();
        let signerName = await contract.addrToName(signerAddr)
        let msg= await contract.getFullConversation(currentDiscussionPartner,signerName); //reverted
        
        console.log("msg to =", await msg)
     
        // muss geandert werden
        let l= msg.length;
   
        let final_msg = msg[l-1];
        
        
        document.getElementById('display_it').innerHTML +=`<div class="to"> ${final_msg} </div>`
    
    } catch (error) {
        console.log('error =====',error)
      }
    } else {
        connectButton.innerHTML = "Please install MetaMask"
    }
}


