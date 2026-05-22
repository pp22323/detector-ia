export default async function handler(req, res){

try{

const apiKey =
process.env.HIVE_API_KEY;

if(!apiKey){

return res.status(500).json({

status:false,
erro:"Sem API Key"

});

}

return res.status(200).json({

status:true,
msg:"Hive conectada",
api:true

});

}catch(err){

return res.status(500).json({

status:false,
erro:err.message

});

}

}
