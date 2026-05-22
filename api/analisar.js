export const config = {
api:{
bodyParser:false
}
};

export default async function handler(req,res){

try{

if(req.method !== "POST"){

return res.status(405).json({
erro:"Use POST"
});

}

const apiKey =
process.env.HIVE_API_KEY;

const formData =
await req.formData();

const media =
formData.get("media");

if(!media){

return res.status(400).json({
erro:"Sem mídia"
});

}

const hiveForm =
new FormData();

hiveForm.append(
"media",
media
);

const hiveResponse =
await fetch(
"https://api.thehive.ai/api/v2/task/sync",
{
method:"POST",
headers:{
Authorization:`Token ${apiKey}`
},
body:hiveForm
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
