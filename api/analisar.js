module.exports = async (req,res)=>{

try{

if(req.method!=="POST"){

return res.status(405).json({
erro:"POST apenas"
});

}

const apiKey =
process.env.HIVE_API_KEY;

if(!apiKey){

return res.status(500).json({
erro:"Sem chave Hive"
});

}

const response =
await fetch(
"https://api.thehive.ai/api/v2/task/sync",
{
method:"POST",
headers:{
Authorization:`Token ${apiKey}`
},
body:req
}
);

const data =
await response.json();

return res.status(200).json(
data
);

}catch(err){

return res.status(500).json({
erro:err.message
});

}

};
