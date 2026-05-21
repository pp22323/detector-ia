const axios = require("axios");

exports.handler = async (event) => {

return {

statusCode:200,

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

status:"online",
msg:"Detector Hive conectado"

})

};

};
