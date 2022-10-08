import {abi,contractAddress} from "../constants.js";
import { ethers } from "../ethers-5.6.esm.min.js";

let listOfmembers = [];
let latestMsg = "";

const sortedDisscussion = (input_list) =>{

    console.log("original list = ",input_list);

    // this part extracts the time stamps from the list
    let x = [];
    for(let i=0; i<input_list.length; i++){
        x.push(input_list[i][1])
    }
    // this part sorts the list of nums
    const func = (a,b) =>{
        return a-b;
    }
    let result = x.sort(func,[])

    // this part suppose to get list of index 

    let list_of_index = [];

    for(let j=0; j<result.length; j++){

        for(let k=0; k<input_list.length; k++){

            if(input_list[k][1] == result[j]){
                list_of_index.push(k)
            }
        }
    }
    console.log("--------------------")
    // this part suppose to sort the list 
    //according to time stamp klein to gross

    let final_list= [];

    for(let i=0; i< list_of_index.length; i++){
        final_list[i] = input_list[list_of_index[i]];
    }
    console.log("final list =", final_list)

    return final_list;

}




await getMembers();


let l = listOfmembers.length;

let currentDiscussionPartner = "";  
for(let i=0; i<l; i++){
    
    if(document.getElementById(listOfmembers[i]) != null){
        document.getElementById(listOfmembers[i]).onclick = (e)=>{

            currentDiscussionPartner = e.target.id;

            //console.log(currentDiscussionPartner)
            //testing this 

        }

    }
    
}


    
setInterval(async ()=>{
    
    for(let i=0; i<listOfmembers.length; i++){

        if(document.getElementById(listOfmembers[i]) != null){

            let element = document.getElementById(listOfmembers[i]);
    
                if(listOfmembers[i] == currentDiscussionPartner){
                    
                    element.style.height = "2.5em"
                    element.style.filter = "invert()"
                    element.style.border = 'blue 4px solid';
                    element.style.borderRadius = "50px";
                    
                }else{
                    element.style.color = 'black';
                    element.style.height = "2.5em"
                    element.style.filter = "invert()"
                    element.style.border = 'white 2px solid';
                    element.style.borderRadius = "50px";
                }

        }
        
    }
},100)

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

        //console.log("waiting for room member ...")

        const provider = new ethers.providers.Web3Provider(window.ethereum)
        await provider.send('eth_requestAccounts', [])
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        
    
    try {
        
        let members = await contract.getMembers();
        //console.log(members)
        let len = members.length;
        for(let i = 0; i< len; i++){

            listOfmembers.push(members[i])
            document.getElementById('members').innerHTML += `
            <button class="members" >
                    <img id=${members[i]} src="./avatar.png" id="avatar"> <h3> ${members[i]} </h3>
            </button>
            ` 
            
        }
        
       
    } catch (error) {
        //console.log(error)
      }
    } else {
        connectButton.innerHTML = "Please install MetaMask"
    }

}

function getMsg(){
    return document.getElementById("msg").value;
}

// this is working perfectly!!
async function sendMessage(/*_from,_to,_msg*/){

    //document.getElementById('display_it').innerHTML = ""

    if (typeof window.ethereum !== "undefined") {

        const provider = new ethers.providers.Web3Provider(window.ethereum)
        await provider.send('eth_requestAccounts', [])
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
    
    try {

        let signerAddr = await signer.getAddress()
        let signerName = await contract.addrToName(signerAddr)

        // set the last msg:
         

        let tx = await contract.sendMessage(signerName,currentDiscussionPartner,getMsg());
        await tx.wait();

        document.getElementById('msg').value = "";
         

        contract.once("sended", async(msg)=>{

            await updateUi(msg);
            

        })       
        
    } catch (error) {
  
    }
    
    } else {
        connectButton.innerHTML = "Please install MetaMask"
    }

}

async function updateUi(msg){

    console.log("update ui was triggered with msg = ", msg);

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    await provider.send('eth_requestAccounts', [])
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)

    let signerAddr = await signer.getAddress()
    let signerName = await contract.addrToName(signerAddr)

    let msg_from= await contract.getFullConversation(signerName,currentDiscussionPartner);
    let msg_to= await contract.getFullConversation(currentDiscussionPartner,signerName);

    



    msg_from[0].map(async(u,v) =>{


        if(parseInt(msg_from[1][v].toString()) >= await contract.getTime()){

            let result = new Date(parseInt(msg_from[1][v].toString()) * 1000).toISOString().slice(11, 19);
            
            document.getElementById("display_it").innerHTML += `<div class="from">${msg_from[0][v]}</div> <div id="timestampFrom">${result}</div>` 
        }
    })
    msg_to[0].map( async(u,v) =>{

        if(parseInt(msg_to[1][v].toString()) >= await contract.getTime()){

            let result = new Date(parseInt(msg_to[1][v].toString()) * 1000).toISOString().slice(11, 19);

            document.getElementById("display_it").innerHTML += `<div class="to">${msg_to[0][v]} </div> <div id="timestampTo">${result}</div>`
            
        }
    })


}





