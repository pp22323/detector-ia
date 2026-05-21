exports.handler = async (event) => {

if(event.httpMethod !== "POST"){

return {
statusCode:405,
body:"Método não permitido"
};

}

try{

return {

statusCode:200,

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

status:"online",
msg:"Detector pronto"

})

};

}catch(err){

return {

statusCode:500,

body:JSON.stringify({

erro:"Erro function"

})

};

}

};