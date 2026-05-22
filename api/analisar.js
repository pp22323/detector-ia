export const config = {
  api: {
    bodyParser: {
      sizeLimit: '20mb'
    }
  }
};

export default async function handler(req, res){

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

const hiveResponse =
await fetch(
"https://api.thehive.ai/api/v2/task/sync",
{
method:"POST",
headers:{
Authorization:`Token ${apiKey}`
},
body:req.body
}
);

const data =
await hiveResponse.json();

return res.status(200).json(
data
);

}catch(err){

return res.status(500).json({
erro:err.message
});

}

}
