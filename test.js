console.clear();
let input_list = [["oussema",122],["abx",33],["dhsdgsd",44],["dsdsd",10]]





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



sortedDisscussion(input_list);