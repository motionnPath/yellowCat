import {abi,contractAddress} from "../constants.js";
import { ethers } from "../ethers-5.6.esm.min.js";
import {getMembers} from "./room.js"


const connectButton = document.getElementById("connect");
const subscribeButton = document.getElementById("subscribe");
const subscriberInputName = document.getElementById("subscriberInputName");

connectButton.onclick = connect;
subscribeButton.onclick = subscribe;
subscriberInputName.onchange = getsubscriberName;


function getsubscriberName(){
    return document.getElementById("subscriberInputName").value;
}


export async function connect() {
    if (typeof window.ethereum !== "undefined") {
      try {
        await ethereum.request({ method: "eth_requestAccounts" })
      } catch (error) {
        console.log(error)
      }
      connectButton.innerHTML = "Connected"
      const accounts = await ethereum.request({ method: "eth_accounts" })
      console.log(accounts)
    } else {
      connectButton.innerHTML = "Please install MetaMask"
    }
}
export async function subscribe(){

  if (typeof window.ethereum !== "undefined") {

      console.log("a new member is joining yellowCat ...")

      const provider = new ethers.providers.Web3Provider(window.ethereum)
      await provider.send('eth_requestAccounts', [])
      const signer = provider.getSigner()
      const contract = new ethers.Contract(contractAddress, abi, signer)
      
  
  try {
      await contract.subscribe(getsubscriberName(),{value:0})
      document.getElementById("subscriberInputName").value = ""
      console.log("new yelloCat was added successfully")
      await getMembers(); // did not work
      
  } catch (error) {
      console.log(error)
    }
  } else {
      connectButton.innerHTML = "Please install MetaMask"
  }

}

