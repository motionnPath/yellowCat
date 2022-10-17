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
    func();

},100)

const func = () =>{
    
    document.getElementById("disscussionPartner").innerText = ` transfer to ${currentDiscussionPartner} `
}


try {
    document.getElementById("send").onclick = async()=> {  
        await sendMessage()
    };
    document.getElementById("fund").onclick = async () =>{
        await fund();
    };
    document.getElementById("transfer").onclick = async()=> {
        await transferFunds();
    };
}catch(e){
    console.log(e)
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

 

    if (typeof window.ethereum !== "undefined") {

        const provider = new ethers.providers.Web3Provider(window.ethereum)
        await provider.send('eth_requestAccounts', [])
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
    
    try {

        let signerAddr = await signer.getAddress()
        let signerName = await contract.addrToName(signerAddr)

        // set the last msg:
         
        console.log(signerName," is sending msg to ", currentDiscussionPartner)
        let tx = await contract.sendMessage(signerName,currentDiscussionPartner,getMsg());
        await tx.wait(1);

        document.getElementById('msg').value = "";
         

        contract.on("sended", async()=>{

            await updateFrom();
            await updateTo();
            //contract.removeAllListeners("sended")
            

        })       
        
        
    } catch (error) {
  
    }
    
    } else {
        connectButton.innerHTML = "Please install MetaMask"
    }

}

async function updateFrom(){

    console.log("the update From was triggered.... ");

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    await provider.send('eth_requestAccounts', [])
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)

    let signerAddr = await signer.getAddress()
    let signerName = await contract.addrToName(signerAddr)

    let msg_from= await contract.getFullConversation(signerName,currentDiscussionPartner);


    
    msg_from[0].map(async(u,v) =>{


        if(parseInt(msg_from[1][v].toString()) >= await contract.getTime()){

            let result = new Date(parseInt(msg_from[1][v].toString()) * 1000).toISOString().slice(11, 19);
            let len = msg_from[0].length -1
            
            document.getElementById("display_it").innerHTML = `
                <div class="from">${msg_from[0][len]}</div>
                <div id="timestampFrom>${result}</div>`

        }
    })
    

}

async function updateTo(){

    console.log("the update To was triggered.... ");

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    await provider.send('eth_requestAccounts', [])
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)

    let signerAddr = await signer.getAddress()
    let signerName = await contract.addrToName(signerAddr)

  
    let msg_to = await contract.getFullConversation(currentDiscussionPartner,signerName);

    msg_to[0].map( async(u,v) =>{

        if(parseInt(msg_to[1][v].toString()) >= await contract.getTime()){

            let result = new Date(parseInt(msg_to[1][v].toString()) * 1000).toISOString().slice(11, 19);
            let len = msg_to[0].length -1
            
            document.getElementById("display_it").innerHTML = `
                <div class="to">${msg_to[0][len]}</div>
                <div id="timestampTo>${result}</div>`

        }
    })

}

async function fund(){

    

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    await provider.send('eth_requestAccounts', [])
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)

    let signerAddr = await signer.getAddress()
    let signerName = await contract.addrToName(signerAddr)


    console.log(signerName ," is funding the Cat... ");

    let fundAmount = document.getElementById("fundAmount").value;
    
    await contract.fund({value: fundAmount});

    

    contract.on("funded",async()=>{

        let amount = (await contract.getBalance(signerName)).toString();
        console.log("Congras ! ",signerName,"Transaction success .. you deposit =", amount )
        document.getElementById("fundAmount").value = "";
        document.getElementById("balance").innerHTML = `<div>  ${amount} </div>`
    })


}
async function transferFunds(){

    

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    await provider.send('eth_requestAccounts', [])
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)

    let signerAddr = await signer.getAddress()
    let signerName = await contract.addrToName(signerAddr)


    let fundAmount = document.getElementById("fundAmount").value;

    console.log(signerName ," is transfering",fundAmount,"Funds to ", currentDiscussionPartner);

    let addr = await contract.getAdrr(currentDiscussionPartner);
    
    await contract.transferFunds(addr,{value: fundAmount});

    contract.on("fundsTransfer", async(amountTransfered)=>{

        let amount = (await contract.getBalance(currentDiscussionPartner)).toString();
        let myAmount = (await contract.getBalance(signerName)).toString();

        console.log(
            "Congras ! ",currentDiscussionPartner,
            " you have received  ",amountTransfered.toString(),
            "from",signerName, 
            "your current balance =",amount 
        )

        document.getElementById("balance").innerHTML = `<div>${myAmount} </div>`
        document.getElementById("fundAmount").value = 0;
    })
    
    


}




