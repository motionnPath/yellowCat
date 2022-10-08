### idea
----
just get the full conversation and map over it 

## how to do it 
----

contract.on("sended",()=>{

    full_conversation.map( u => {
        
        if(msg_from.includes(u)){
            document.getElementById('display_it').innerHTML +=`<div class="from"> ${u}</div>`
        }else{
            document.getElementById('display_it').innerHTML +=`<div class="to"> ${u}</div>`
        }
    })
})