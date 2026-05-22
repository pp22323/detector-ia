module.exports = async function handler(req,res){

try{

if(req.method !== "POST"){

return res.status(405).json({
erro:"Use POST"
});

}

const apiKey =
process.env.HIVE_API_KEY;

if(!apiKey){

return res.status(500).json({
erro:"Sem chave Hive"
});

}

return res.status(200).json({
status:true,
msg:"API ok"
});

}catch(err){

return res.status(500).json({
erro:err.message
});

}

};
