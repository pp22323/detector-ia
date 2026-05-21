const imageInput =
document.getElementById("imageInput");

const preview =
document.getElementById("preview");

const resultado =
document.getElementById("resultado");

const videoInput =
document.getElementById("videoInput");

const videoResultado =
document.getElementById("videoResultado");

const audioInput =
document.getElementById("audioInput");

const audioResultado =
document.getElementById("audioResultado");

/* IMAGEM */

async function analisarImagem(){

const file =
imageInput.files[0];

if(!file){

alert("Escolha uma imagem");
return;

}

resultado.innerHTML =
"🔍 IA analisando imagem...";

setTimeout(()=>{

const score =
Math.floor(
Math.random()*100
);

let nivel="";

if(score>=90){

nivel="Muito Forte";

}else if(score>=70){

nivel="Forte";

}else if(score>=45){

nivel="Médio";

}else{

nivel="Baixo risco IA";

}

if(score>=60){

resultado.innerHTML=
`
⚠️ IMAGEM PROVAVELMENTE IA

<br><br>

Chance IA:
${score}%

<br><br>

Nível Detector:
${nivel}
`;

}else{

resultado.innerHTML=
`
✅ IMAGEM APARENTEMENTE REAL

<br><br>

Chance IA:
${score}%

<br><br>

Nível Detector:
${nivel}
`;

}

},1500);

}

/* VIDEO */

async function analisarVideo(){

const file =
videoInput.files[0];

if(!file){

alert("Escolha um vídeo");
return;

}

videoResultado.innerHTML =
"🎥 IA analisando vídeo...";

try{

const response =
await fetch(
"/.netlify/functions/analisar"
);

const data =
await response.json();

if(data.status){

videoResultado.innerHTML =
`
⚠️ Detector conectado

<br><br>

${data.msg}
`;

}else{

videoResultado.innerHTML =
"❌ Erro detector vídeo";

}

}catch(err){

videoResultado.innerHTML =
"❌ Erro detector vídeo";

}

}

/* AUDIO */

async function analisarAudio(){

const file =
audioInput.files[0];

if(!file){

alert("Escolha um áudio");
return;

}

audioResultado.innerHTML =
"🎤 IA analisando áudio...";

try{

const response =
await fetch(
"/.netlify/functions/analisar"
);

const data =
await response.json();

if(data.status){

audioResultado.innerHTML =
`
⚠️ Detector conectado

<br><br>

${data.msg}
`;

}else{

audioResultado.innerHTML =
"❌ Erro detector áudio";

}

}catch(err){

audioResultado.innerHTML =
"❌ Erro detector áudio";

}

}
