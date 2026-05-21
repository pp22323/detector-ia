const imageInput =
document.getElementById("imageInput");

const preview =
document.getElementById("preview");

const resultado =
document.getElementById("resultado");

const progressBar =
document.getElementById("progressBar");

const videoInput =
document.getElementById("videoInput");

const videoPreview =
document.getElementById("videoPreview");

const videoResultado =
document.getElementById("videoResultado");

const audioInput =
document.getElementById("audioInput");

const audioPreview =
document.getElementById("audioPreview");

const audioResultado =
document.getElementById("audioResultado");

let pontos = 0;

/* PREVIEW */

imageInput.addEventListener(
"change",
()=>{

const file =
imageInput.files[0];

if(file){

preview.src =
URL.createObjectURL(file);

preview.style.display =
"block";

}

}
);

videoInput.addEventListener(
"change",
()=>{

const file =
videoInput.files[0];

if(file){

videoPreview.src =
URL.createObjectURL(file);

}

}
);

audioInput.addEventListener(
"change",
()=>{

const file =
audioInput.files[0];

if(file){

audioPreview.src =
URL.createObjectURL(file);

}

}
);

/* IMAGEM */

async function analisarImagem(){

const file =
imageInput.files[0];

if(!file){

alert(
"Escolha uma imagem"
);

return;
}

resultado.innerHTML =
"🔍 IA analisando...";

progressBar.style.width =
"15%";

const formData =
new FormData();

formData.append(
"media",
file
);

const api_user =
"991318704";

const api_secret =
"YADmiVA4FB6vTkdTSBn9j5ZFpb2UEaCF";

try{

const response =
await fetch(

`https://api.sightengine.com/1.0/check.json?models=genai&api_user=${api_user}&api_secret=${api_secret}`,

{
method:"POST",
body:formData
}

);

progressBar.style.width =
"70%";

const data =
await response.json();

console.log(data);

progressBar.style.width =
"100%";

let score = 0;

if(
data.type &&
typeof data.type.ai_generated !==
"undefined"
){

score =
Math.round(
data.type.ai_generated
*100
);

}else if(
typeof data.ai_generated !==
"undefined"
){

score =
Math.round(
data.ai_generated
*100
);

}else{

resultado.innerHTML =
"❌ API não reconheceu";

return;
}

/* NIVEL */

let nivel = "";

if(score >= 90){

nivel =
"Muito Forte";

}else if(score >= 70){

nivel =
"Forte";

}else if(score >= 45){

nivel =
"Médio";

}else{

nivel =
"Baixo risco IA";
}

/* RESULTADO */

if(score >= 60){

resultado.innerHTML =
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

resultado.innerHTML =
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

}catch(error){

console.log(error);

resultado.innerHTML =
"❌ Erro na análise";

}

}

/* VIDEO */

function analisarVideo(){

const file =
videoInput.files[0];

if(!file){

alert(
"Escolha vídeo"
);

return;
}

let progresso =
0;

videoResultado.innerHTML =
"🎥 IA analisando vídeo...";

const anim =
setInterval(()=>{

progresso += 4;

videoResultado.innerHTML =
`
🎥 IA ANALISANDO

<br><br>

${progresso}%
`;

if(
progresso >= 100
){

clearInterval(
anim
);

videoResultado.innerHTML =
`
🎥 Vídeo processado

<br><br>

Detector vídeo em preparação
`;

}

},100);

}

/* AUDIO */

function analisarAudio(){

const file =
audioInput.files[0];

if(!file){

alert(
"Escolha áudio"
);

return;
}

let progresso =
0;

audioResultado.innerHTML =
"🎤 IA analisando áudio...";

const anim =
setInterval(()=>{

progresso += 5;

audioResultado.innerHTML =
`
🎤 IA ANALISANDO

<br><br>

${progresso}%
`;

if(
progresso >= 100
){

clearInterval(
anim
);

audioResultado.innerHTML =
`
🎤 Áudio processado

<br><br>

Detector áudio em preparação
`;

}

},100);

}

/* QUIZ */

const imagensQuiz = [

{
url:
"https://picsum.photos/400?1",
resposta:"real"
},

{
url:
"https://picsum.photos/400?2",
resposta:"real"
},

{
url:
"https://thispersondoesnotexist.com/image",
resposta:"ia"
}

];

let indiceAtual =
0;

function atualizarQuiz(){

document.getElementById(
"quizImage"
).src =
imagensQuiz[
indiceAtual
].url;

document.getElementById(
"quizResultado"
).innerHTML =
"";

}

function novaImagemQuiz(){

indiceAtual++;

if(
indiceAtual >=
imagensQuiz.length
){

indiceAtual = 0;

}

atualizarQuiz();

}

function responderQuiz(
resposta
){

const correta =
imagensQuiz[
indiceAtual
].resposta;

const resultadoQuiz =
document.getElementById(
"quizResultado"
);

if(
resposta === correta
){

resultadoQuiz.innerHTML =
"✅ Acertou";

pontos++;

document.getElementById(
"pontuacao"
).innerHTML =
pontos;

}else{

resultadoQuiz.innerHTML =
"❌ Errou";

}

}

window.onload =
atualizarQuiz;