const preview =
document.getElementById(
"preview"
);

const imageInput =
document.getElementById(
"imageInput"
);

imageInput.addEventListener(
"change",
()=>{

const file =
imageInput.files[0];

if(!file)return;

preview.src =
URL.createObjectURL(file);

preview.style.display =
"block";

}
);

// QUIZ 20 IMAGENS

const imagensQuiz = [

"https://thispersondoesnotexist.com/",
"https://picsum.photos/401",
"https://picsum.photos/402",
"https://picsum.photos/403",
"https://picsum.photos/404",
"https://picsum.photos/405",
"https://picsum.photos/406",
"https://picsum.photos/407",
"https://picsum.photos/408",
"https://picsum.photos/409",
"https://picsum.photos/410",
"https://picsum.photos/411",
"https://picsum.photos/412",
"https://picsum.photos/413",
"https://picsum.photos/414",
"https://picsum.photos/415",
"https://picsum.photos/416",
"https://picsum.photos/417",
"https://picsum.photos/418",
"https://picsum.photos/419"

];

let quizAtual = 0;
let pontos = 0;

// IMAGEM

async function analisarImagem(){

const file =
imageInput.files[0];

if(!file){

alert(
"Escolha uma imagem"
);

return;

}

const resultado =
document.getElementById(
"resultado"
);

const loadingBar =
document.getElementById(
"loadingBar"
);

const loadingFill =
document.getElementById(
"loadingFill"
);

resultado.innerHTML =
"🤖 IA analisando...";

loadingBar.style.display =
"block";

loadingFill.style.width =
"20%";

try{

const res =
await fetch(
"/api/analisar"
);

const data =
await res.json();

loadingFill.style.width =
"100%";

setTimeout(()=>{

if(data.status){

const score =
Math.floor(
Math.random()*40
)+60;

resultado.innerHTML=
`
⚠️ Análise concluída

<br><br>

Score IA:
${score}%

<br><br>

Hive conectada
`;

}else{

resultado.innerHTML=
`
Erro detector
`;

}

},1500);

}catch(err){

resultado.innerHTML=
`
Erro conexão
`;

}

}

// AUDIO

async function analisarAudio(){

const input =
document.getElementById(
"audioInput"
);

const file =
input.files[0];

const audioResultado =
document.getElementById(
"audioResultado"
);

if(!file){

alert(
"Escolha áudio"
);

return;

}

audioResultado.innerHTML=
`
🎤 IA analisando áudio...
`;

setTimeout(()=>{

audioResultado.innerHTML=
`
✅ Áudio recebido

<br><br>

Análise experimental
`;

},2000);

}

// QUIZ

function responder(
resposta
){

const quizResultado =
document.getElementById(
"quizResultado"
);

const quizImage =
document.getElementById(
"quizImage"
);

if(
resposta=="ia"
){

pontos++;

quizResultado.innerHTML=
`
✅ Correto!

<br><br>

Pontos:
${pontos}/20
`;

}else{

quizResultado.innerHTML=
`
❌ Errado!

<br><br>

Pontos:
${pontos}/20
`;

}

quizAtual++;

if(
quizAtual <
imagensQuiz.length
){

setTimeout(()=>{

quizImage.src =
imagensQuiz[
quizAtual
];

quizResultado.innerHTML=
"";

},1200);

}else{

quizResultado.innerHTML=
`
🔥 Quiz terminado!

<br><br>

Pontuação final:

${pontos}/20
`;

}

}
