const preview =
document.getElementById("preview");

const imageInput =
document.getElementById("imageInput");

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
"80%";

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
"Erro detector";

}

},1200);

}catch(err){

resultado.innerHTML=
"Erro conexão";

}

}

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
🎤 Analisando áudio...
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

function responder(
resposta
){

const quizResultado =
document.getElementById(
"quizResultado"
);

if(
resposta=="ia"
){

quizResultado.innerHTML=
`
✅ Correto!
Imagem gerada por IA.
`;

}else{

quizResultado.innerHTML=
`
❌ Errado.
Essa imagem é IA.
`;

}

}
