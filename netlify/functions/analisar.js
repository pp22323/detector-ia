const axios = require("axios");

exports.handler = async (event) => {

try{

return {

statusCode:200,

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

status:"online",
msg:"Detector backend ativo"

})

};

}catch(err){

return {

statusCode:500,

body:JSON.stringify({

erro:"Erro detector"

})

};

}

};
