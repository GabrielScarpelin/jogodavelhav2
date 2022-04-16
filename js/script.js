const inicialState = {
    X:0,
    O:0,
    EMPATE: 0
}
const placarObject = {...inicialState}
Object.freeze(inicialState) //OBJETOS DE PONTUACAO

function adicionarEventListener(){
    let eventFunctions = []
    this.adicionarEventos = function(){
        for (let i = 0; i < 9; i++){
            if (jogadas[i]){
                jogadas[i].addEventListener('mouseout', function(){
                    jogadas[i].classList.remove(`${verificarVez()}-hover`)
                })
                jogadas[i].addEventListener('mouseenter', function(){
                    if(jogadas[i].childElementCount === 0){
                        jogadas[i].classList.add(`${verificarVez()}-hover`) 
                    }
                })
                const newFunction = jogar.bind(null, i) /*Ajuda do stackoverflow para remover o evento e não poder jogar durante a tela de WINNER; 
                explicação: Aqui é criado uma nova funcão a partir do bind JÁ COM O PARAMETRO I porém sem invocar, pois toda vez que tentava passar o jogar(i) ele invocava a função, 
                desta maneira apenas deixei a função "no gatilho" para ser disparada a partir do newFunction ja com o parametro*/
                eventFunctions.push(newFunction)
                jogadas[i].addEventListener('click', newFunction)
            }
        }
        document.getElementById('btnRestart').addEventListener('click', reiniciarJogo);
    }
    this.removerEventListener = function (){
        for (let i = 0; i < eventFunctions.length; i++){
            if (jogadas[i]){
                jogadas[i].removeEventListener('click', eventFunctions[i])
            }
        }
        document.getElementById('btnRestart').removeEventListener('click', reiniciarJogo)
        eventFunctions = []
    }
}
const jogadas = document.getElementsByClassName('container-jogadas')
const addRemoveEventos = new adicionarEventListener
window.onload = function(){
    addRemoveEventos.adicionarEventos()
}
function velha(){ //Função que verifica se deu velha
    let contador = 0
    for (let i = 0; i < jogadas.length; i++){
        if(jogadas[i].childElementCount === 1){
            contador++
        }
    }
    if (contador === 9 && (winnerVerification()) === false){
        chamarTela(null, null)
    }
}
function jogar(celPlayed){
    const celula = document.getElementById(`cel${celPlayed}`)
    if (celula.childElementCount === 0){
        const vezJogador = verificarVez()
        celula.innerHTML = `<img src="img/${vezJogador}.svg" class="jogada" id="${vezJogador}">`
        celula.classList.remove(`${vezJogador}-hover`)
        winnerVerification(celPlayed)
        velha()
        atualizarVezPlacar()
    }
    else {
        alert('Jogue em um lugar vazio')
    }

}
function atualizarVezPlacar(){
    const vezJogador = verificarVez()
    document.getElementById('turn-image').setAttribute('src', `img/${vezJogador}.svg`)
    if ((placarObject.X != document.getElementById('pontos-x').innerText) || (placarObject.O != document.getElementById('pontos-o').innerText) || (placarObject.EMPATE != document.getElementById('pontos-emp').innerText) ){
        document.getElementById('pontos-x').innerText = placarObject.X
        document.getElementById('pontos-o').innerText = placarObject.O
        document.getElementById('pontos-emp').innerText = placarObject.EMPATE
    }

}

function verificarPossibilidades(arrayTotal, numCelAtual) {
    let arrayFinal = []
    let indiceArrayFinal = 0;
    arrayTotal.forEach(array => {
        const procurando = array.find(elements => elements === numCelAtual)
        if (procurando !== undefined) {
            arrayFinal[indiceArrayFinal] = array
            indiceArrayFinal++
        }
    })
    return arrayFinal
}

function winnerVerification(numCel){
    let vencedor = false
    let jogadorVencedor = ''
    const combinacoes = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,4,8],
        [2,4,6],
        [0,3,6],
        [1,4,7],
        [2,5,8]
    ]
    const possibilidadeFilter = verificarPossibilidades(combinacoes, numCel)
    let celulasVencedoras = []
    for (let i = 0; i < possibilidadeFilter.length; i++){
        const elements = possibilidadeFilter[i]
        let contadorX = 0
        let contadorO = 0
        for (let j = 0; j < 3; j++){
            const celulaAtual = document.getElementById(`cel${elements[j]}`).childNodes[0] == undefined ? null : document.getElementById(`cel${elements[j]}`).childNodes[0].id
            if(celulaAtual == 'x'){
                contadorX++
            }
            else if (celulaAtual == 'o'){
                contadorO++
            }
        }
        if (contadorX == 3){
            celulasVencedoras = elements
            jogadorVencedor = 'x'
            vencedor = true
            break;
        }
        else if (contadorO == 3){
            celulasVencedoras = elements
            jogadorVencedor = 'o'
            vencedor = true
            break;
        }
    }
    if (vencedor == true){
        chamarTela(jogadorVencedor, celulasVencedoras)
    }
    return vencedor
}
function verificarVez(){ //VERIFICA DE QUEM É A VEZ
    let vezJogador = ''
    let contadorVez = 0
    for (let i = 0; i < jogadas.length; i++){
        if (jogadas[i].childElementCount === 1){
            contadorVez++
        }
    }
    if((contadorVez%2) === 0){
        vezJogador = 'x'
    }
    else {
        vezJogador = 'o'
    }

    return vezJogador
}
function chamarTela(vencedor, arrayCelsWinner){
    if (vencedor === 'x' || vencedor === 'o'){
        arrayCelsWinner.forEach((elementCel)=>{
            const atualCel = document.getElementById(`cel${elementCel}`)
            atualCel.classList.add(`player-${vencedor}`)
            atualCel.childNodes[0].setAttribute('src', `img/${vencedor}WinnerState.svg`)
            
        })
        document.getElementById('ganhadorImg').classList.remove('hidden')
        document.getElementById('ganhadorImg').setAttribute('src', `img/${vencedor}.svg`)
        document.getElementsByClassName('ganhadorText')[0].classList.add(`${vencedor}-color`)
    }
    else{
        document.getElementById('ganhadorImg').classList.add('hidden')
        document.getElementsByClassName('ganhadorText')[0].innerText = 'VELHA'

    }
    document.getElementsByClassName('vencedorDiv')[0].classList.add('enter-animation-normal')
    document.getElementById('next-btn').addEventListener('click', ()=>{
        document.getElementsByClassName('vencedorDiv')[0].classList.remove('enter-animation-normal')
        document.getElementsByClassName('vencedorDiv')[0].classList.add('enter-animation-reverse')
        setTimeout(()=>{
            document.getElementsByClassName('vencedorDiv')[0].classList.remove('enter-animation-reverse') 
        }, 2000)
        if (vencedor == 'x'){
            placarObject.X += 1
            arrayCelsWinner.forEach((elementCel)=>{
                const atualCel = document.getElementById(`cel${elementCel}`)
                atualCel.classList.remove(`player-${vencedor}`)
            })
            document.getElementsByClassName('ganhadorText')[0].classList.remove(`${vencedor}-color`)
        }
        else if (vencedor == 'o'){
            placarObject.O += 1
            arrayCelsWinner.forEach((elementCel)=>{
                const atualCel = document.getElementById(`cel${elementCel}`)
                atualCel.classList.remove(`player-${vencedor}`)
            })
            document.getElementsByClassName('ganhadorText')[0].classList.remove(`${vencedor}-color`)
        }
        else {
            placarObject.EMPATE += 1
        }
        reiniciarJogo()
        atualizarVezPlacar()
    },{once:true})
}
function reiniciarJogo(){
    addRemoveEventos.removerEventListener()
    for (let i = 0; i < jogadas.length; i++){
        jogadas[i].childNodes[0] == undefined ? null : jogadas[i].childNodes[0].remove()
    }
    addRemoveEventos.adicionarEventos()
}
