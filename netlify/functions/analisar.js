exports.handler = async (event) => {

try{

const apiKey =
process.env.HIVE_API_KEY;

if(!apiKey){

return{
statusCode:500,
body:JSON.stringify({
erro:"API Key não encontrada"
})
};

}

return{

statusCode:200,

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

status:true,
msg:"Hive conectada",
api:true

})

};

}catch(err){

return{

statusCode:500,

body:JSON.stringify({

status:false,
erro:err.message

})

};

}

};
