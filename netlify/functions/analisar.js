exports.handler = async (event) => {

try{

return {

statusCode:200,

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

status:true,
score:87,
tipo:"IA / Deepfake",
msg:"Possível mídia gerada por IA"

})

};

}catch(err){

return {

statusCode:500,

body:JSON.stringify({

status:false,
erro:"Erro detector"

})

};

}

};
