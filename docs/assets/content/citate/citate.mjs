import meTexts from "../antologia-me/msj/texts.mjs";
import meCitate from "../antologia-me/citate/citate.mjs"
import meChapters from "../antologia-me/msj/chapters.mjs"

import lTexts from "../antologia-lenin/msj/texts.mjs"
import lCitate from "../antologia-lenin/citate/citate.mjs"
import lChapters from "../antologia-lenin/msj/chapters.mjs"

import antiDTexts from "../antiduhring/msj/texts.mjs"

import luxemburgTexts from "../luxemburg/msj/texts.mjs"

import debordTexts from "../debord/msj/texts.mjs"

import sfFamilieTexts from '../sf-familie/msj/texts.mjs'

import mizFizTexts from '../mizeria-filozofiei/msj/texts.mjs'
import vogtTexts from '../vogt/msj/texts.mjs'

import dietzgenTexts from '../dietzgen/msj/texts.mjs'

import pannekoekTexts from '../panneckoek/msj/texts.mjs'

import maoCit from '../mao-cit/citate/citate.mjs'
import maov1Texts from '../mao-v1/msj/texts.mjs'
import maov1Chapters from '../mao-v1/msj/chapters.mjs'
import maov2Texts from '../mao-v2/msj/texts.mjs'
import maov2Chapters from '../mao-v2/msj/chapters.mjs'

import castroTexts from '../castro/msj/texts.mjs'

let id = 0

const citat = {
    id: 0,
    idCit: 0,
    isText: false,
    autor: '',
    titlu: '',
    text: '',
    an: '',
    img: '',
    link: ''
};


let citate = []

let marxTexts = meTexts.filter(item => item.image.includes('marx') && !item.image.includes('engels'))
let engelsTexts = meTexts.filter(item => item.image.includes('engels') && !item.image.includes('marx'))
let maEnTexts = meTexts.filter(item => item.image.includes('engels') && item.image.includes('marx'))

function headReplacer(textContent) {
    for (let i = 0; i < textContent.length; i++) {
        if (textContent[i].includes('<h5') || textContent[i].includes('<h6')) {
            textContent[i] = textContent[i].replace(/<h5[^>]+>/g, `<p style="text-align: center;"><b>`)
            textContent[i] = textContent[i].replace(/<h6[^>]+>/g, `<p style="text-align: center;"><b>`)
            textContent[i] = textContent[i].replace('</h5>', `</b></p>`)
            textContent[i] = textContent[i].replace('</h6>', `</b></p>`)
        }
    }
    return textContent;
}


marxTexts.forEach(element => {
    let cit = Object.create(citat);
    cit.id = id
    id += 1
    cit.idCit = element.idChr
    cit.isText = true
    cit.autor = 'Karl Marx'

    let chapter = meChapters.filter(item => element.idChr.indexOf(item.idCh) == 0)[0]
    let title1 = element.title != '' ? element.title : element.info.substring(element.info.indexOf(':') + 1)
    let title2 = !chapter.title.includes('(') ? chapter.title : chapter.title.substring(0, chapter.title.indexOf("("))
    if (title1 == title2) {
        title2 = 'Antologia Marx-Engels'
    }

    cit.titlu = `${title1}<br/>(${title2})`

    let textContent = element.content.filter(item => !item.includes('h6') && !item.includes('img') && !item.includes('Marx către'))
    cit.text = textContent
    cit.an = element.info.substring(element.info.indexOf('(') + 1, element.info.indexOf(')'))
    cit.img = element.image
    cit.link = `./antologia-me/index.html?id=T${element.idChr}#${element.idChr}`
    citate.push(cit)
})

meCitate.filter(item => item.img.includes('marx') && !item.img.includes('engels')).forEach(element => {
    let cit = Object.create(citat);
    cit.id = id
    id += 1
    cit.idCit = element.id
    cit.isText = false
    cit.autor = 'Karl Marx'
    cit.titlu = element.titlu.replace(/<[^>]*>/g, '')

    cit.text = element.text
    cit.an = element.an
    cit.img = element.img
    cit.link = `./antologia-me/citate.html?cit=${element.id}`
    citate.push(cit)
})

mizFizTexts.forEach(element => {
    let cit = Object.create(citat);
    cit.id = id
    id += 1
    cit.idCit = element.idChr
    cit.isText = true
    cit.autor = 'Karl Marx'

    cit.titlu = `${element.title != '' ? element.title : element.info.substring(element.info.indexOf(':') + 1)}<br/>(Mizeria filozofiei)`

    let textContent = element.content.filter(item => !item.includes('h6') && !item.includes('img') && !item.includes('Marx către'))
    cit.text = textContent
    cit.an = '1847'
    cit.img = 'marxy'
    cit.link = `./mizeria-filozofiei/index.html?id=T${element.idChr}#${element.idChr}`
    citate.push(cit)
})

vogtTexts.forEach(element => {
    let cit = Object.create(citat);
    cit.id = id
    id += 1
    cit.idCit = element.idChr
    cit.isText = true
    cit.autor = 'Karl Marx'

    cit.titlu = `${element.title != '' ? element.title : element.info.substring(element.info.indexOf(':') + 1)}<br/>(Mizeria filozofiei)`

    let textContent = element.content.filter(item => !item.includes('h6') && !item.includes('img') && !item.includes('Marx către'))
    cit.text = textContent
    cit.an = '1860'
    cit.img = 'marx2'
    cit.link = `./vogt/index.html?id=T${element.idChr}#${element.idChr}`
    citate.push(cit)
})

engelsTexts.forEach(element => {
    let cit = Object.create(citat);
    cit.id = id
    id += 1
    cit.idCit = element.idChr
    cit.isText = true
    cit.autor = 'Friedrich Engels'

    let chapter = meChapters.filter(item => element.idChr.indexOf(item.idCh) == 0)[0]
    let title1 = element.title != '' ? element.title : element.info.substring(element.info.indexOf(':') + 1)
    let title2 = !chapter.title.includes('(') ? chapter.title : chapter.title.substring(0, chapter.title.indexOf("("))
    if (title1 == title2) {
        title2 = 'Antologia Marx-Engels'
    }

    cit.titlu = `${title1}<br/>(${title2})`

    let textContent = element.content.filter(item => !item.includes('h6') && !item.includes('img') && !item.includes('Engels către'))
    cit.text = textContent
    cit.an = element.info.substring(element.info.indexOf('(') + 1, element.info.indexOf(')'))
    cit.img = element.image
    cit.link = `./antologia-me/index.html?id=T${element.idChr}#${element.idChr}`
    citate.push(cit)
})

meCitate.filter(item => item.img.includes('engels') && !item.img.includes('marx')).forEach(element => {
    let cit = Object.create(citat);
    cit.id = id
    id += 1
    cit.idCit = element.id
    cit.isText = false
    cit.autor = 'Friedrich Engels'
    cit.titlu = element.titlu.replace(/<[^>]*>/g, '')

    cit.text = element.text
    cit.an = element.an
    cit.img = element.img
    cit.link = `./antologia-me/citate.html?cit=${element.id}`
    citate.push(cit)
})

antiDTexts.forEach(element => {
    let cit = Object.create(citat);
    cit.id = id
    id += 1
    cit.idCit = element.idChr
    cit.isText = true
    cit.autor = 'Friedrich Engels'

    cit.titlu = `${element.title != '' ? element.title : element.info.substring(element.info.indexOf(':') + 1)}<br/>(Anti-Dühring)`

    let textContent = element.content.filter(item => !item.includes('h6') && !item.includes('img'))
    cit.text = textContent
    cit.an = '1878'
    cit.img = 'engels'

    cit.link = `./antiduhring/index.html?id=T${element.idChr}#${element.idChr}`
    citate.push(cit)
})

maEnTexts.forEach(element => {
    let cit = Object.create(citat);
    cit.id = id
    id += 1
    cit.idCit = element.idChr
    cit.isText = true
    cit.autor = 'Karl Marx & Friedrich Engels'

    let chapter = meChapters.filter(item => element.idChr.indexOf(item.idCh) == 0)[0]
    let title1 = element.title != '' ? element.title : element.info.substring(element.info.indexOf(':') + 1)
    let title2 = !chapter.title.includes('(') ? chapter.title : chapter.title.substring(0, chapter.title.indexOf("("))
    if (title1 == title2) {
        title2 = 'Antologia Marx-Engels'
    }

    cit.titlu = `${title1}<br/>(${title2})`

    let textContent = element.content.filter(item => !item.includes('h6') && !item.includes('img') && !item.includes('Engels către'))
    cit.text = textContent
    cit.an = element.info.substring(element.info.indexOf('(') + 1, element.info.indexOf(')'))
    cit.img = element.image
    cit.link = `./antologia-me/index.html?id=T${element.idChr}#${element.idChr}`
    citate.push(cit)
})

meCitate.filter(item => item.img.includes('engels') && item.img.includes('marx')).forEach(element => {
    let cit = Object.create(citat);
    cit.id = id
    id += 1
    cit.idCit = element.id
    cit.isText = false
    cit.autor = 'Karl Marx & Friedrich Engels'
    cit.titlu = element.titlu.replace(/<[^>]*>/g, '')

    cit.text = element.text
    cit.an = element.an
    cit.img = element.img
    cit.link = `./antologia-me/citate.html?cit=${element.id}`
    citate.push(cit)
})

sfFamilieTexts.forEach(element => {
    let cit = Object.create(citat);
    cit.id = id
    id += 1
    cit.idCit = element.idChr
    cit.isText = true
    cit.autor = 'Karl Marx & Friedrich Engels'

    cit.titlu = `${element.title != '' ? element.title : element.info.substring(element.info.indexOf(':') + 1)}<br/>(Sfânta familie, sau critica criticii critice)`

    const chapterTitle = element.content.filter(item => item.includes('h3'))[0]
    const chapterTitleIndex = element.content.indexOf(chapterTitle)
    let textContent = element.content
    for (let i = 0; i <= chapterTitleIndex + 1; i++) {
        textContent.shift();
    }
    textContent = headReplacer(textContent)
    cit.text = textContent
    cit.an = '1844'
    cit.img = 'marxengels-sf'
    cit.link = `./sf-familie/index.html?id=T${element.idChr}#${element.idChr}`
    citate.push(cit)
})

dietzgenTexts.forEach(element => {
    let cit = Object.create(citat);
    cit.id = id
    id += 1
    cit.idCit = element.idChr
    cit.isText = true
    cit.autor = 'Josef Dietzgen'

    // let chapter = dietzgenTexts.filter(item => element.idChr.indexOf(item.idCh) == 0)[0]
    cit.titlu = `${element.title}<br/>(Esența muncii cerebrale a omului)`

    let textContent = element.content
    cit.text = headReplacer(textContent)
    cit.an = '1869'
    cit.img = 'dietzgen'
    cit.link = `./dietzgen/index.html?id=T${element.idChr}#${element.idChr}`
    citate.push(cit)
})

lTexts.forEach(element => {
    let cit = Object.create(citat);
    cit.id = id
    id += 1
    cit.idCit = element.idChr
    cit.isText = true
    cit.autor = 'V. I. Lenin'

    let chapter = lChapters.filter(item => element.idChr.indexOf(item.idCh) == 0)[0]
    let title1 = element.title != '' ? element.title : element.info.substring(element.info.indexOf(':') + 1, element.info.indexOf('(') - 1)
    let title2 = !chapter.title.includes('(') ? chapter.title : chapter.title.substring(0, chapter.title.indexOf("("))
    if (title1 == title2) {
        title2 = 'Antologia Lenin'
    }

    cit.titlu = `${title1}<br/>(${title2})`

    let textContent = element.content.filter(item => !item.includes('h6') && !item.includes('img') && !item.includes('Către'))
    cit.text = textContent
    cit.an = element.info.substring(element.info.indexOf('(') + 1, element.info.indexOf(')'))
    cit.img = element.image
    cit.link = `./antologia-lenin/index.html?id=T${element.idChr}#${element.idChr}`
    citate.push(cit)
})

lCitate.forEach(element => {
    let cit = Object.create(citat);
    cit.id = id
    id += 1
    cit.idCit = element.id
    cit.isText = false
    cit.autor = 'V. I. Lenin'
    cit.titlu = element.titlu.replace(/<[^>]*>/g, '')

    cit.text = element.text
    cit.an = element.an
    cit.img = element.img
    cit.link = `./antologia-lenin/citate.html?cit=${element.id}`
    citate.push(cit)
})

luxemburgTexts.forEach(element => {
    let cit = Object.create(citat);
    cit.id = id
    id += 1
    cit.idCit = element.idChr
    cit.isText = true
    cit.autor = 'Rosa Luxemburg'

    cit.titlu = `${element.title}<br/>(Cuvântări și articole alese)`

    let textContent = element.content.filter(item => !item.includes('h6') && !item.includes('img') && !item.includes('Către'))
    let removable = textContent[textContent.length - 1]
    textContent = textContent.filter(item => item != removable)
    
    cit.text = textContent
    let an = ''
    if (element.content[element.content.length - 1].includes('189')) { an = element.content[element.content.length - 1].substring(element.content[element.content.length - 1].indexOf('18'), element.content[element.content.length - 1].indexOf('18') + 4) }
    else { an = element.content[element.content.length - 1].substring(element.content[element.content.length - 1].indexOf('19'), element.content[element.content.length - 1].indexOf('19') + 4) }
    cit.an = an
    cit.img = 'luxemburg'
    cit.link = `./luxemburg/index.html?id=T${element.idChr}#${element.idChr}`
    citate.push(cit)
})

pannekoekTexts.forEach(element => {
    let cit = Object.create(citat);
    cit.id = id
    id += 1
    cit.idCit = element.idChr
    cit.isText = true
    cit.autor = 'Anton Panneckoek'

    cit.titlu = `${element.title != '' ? element.title : element.info.substring(element.info.indexOf(':') + 1)}<br/>(Lenin ca filozof)`

    let textContent = element.content.filter(item => !item.includes('h6') && !item.includes('img') && !item.includes('Marx către'))
    cit.text = headReplacer(textContent)
    cit.an = '1938'
    cit.img = 'panneckoek'
    cit.link = `./panneckoek/index.html?id=T${element.idChr}#${element.idChr}`
    citate.push(cit)
})

maov1Texts.forEach(element => {
    let cit = Object.create(citat);
    cit.id = id
    id += 1
    cit.idCit = element.idChr
    cit.isText = true
    cit.autor = 'Mao Țze-dun'

    cit.titlu = `${element.title}<br/>(Scrieri alese. Volumul 1)`

    let textContent = element.content
    cit.text = headReplacer(textContent)
    let chapter = maov1Chapters.filter(item => item.idCh == element.idChr)[0]
    cit.img = 'mao3'
    cit.an = chapter.subtitle
    cit.link = `./mao-v1/index.html?id=T${element.idChr}#${element.idChr}`
    citate.push(cit)
})

maov2Texts.forEach(element => {
    let cit = Object.create(citat);
    cit.id = id
    id += 1
    cit.idCit = element.idChr
    cit.isText = true
    cit.autor = 'Mao Țze-dun'

    cit.titlu = `${element.title}<br/>(Scrieri alese. Volumul 2)`

    let textContent = element.content
    cit.text = headReplacer(textContent)
    let chapter = maov2Chapters.filter(item => item.idCh == element.idChr)[0]
    cit.img = 'mao2'
    cit.an = chapter.subtitle
    cit.link = `./mao-v2/index.html?id=T${element.idChr}#${element.idChr}`
    citate.push(cit)
})

maoCit.forEach(element => {
    let cit = Object.create(citat);
    cit.id = id
    id += 1
    cit.idCit = element.id
    cit.isText = false
    cit.autor = 'Mao Țze-dun'
    cit.titlu = element.titlu.replace(/<[^>]*>/g, '')

    cit.text = element.text
    cit.an = element.an
    cit.img = element.img

    cit.link = `./mao-cit/index.html?id=T${element.idChr}#cit${cit.idCit}`
    citate.push(cit)
})

castroTexts.forEach(element => {
    let cit = Object.create(citat);
    cit.id = id
    id += 1
    cit.idCit = element.idChr
    cit.isText = true
    cit.autor = 'Fidel Castro'

    cit.titlu = `${element.title}<br/>(Cuvântări alese)`

    let textContent = element.content
    cit.text = textContent
    if (element.title.includes('19')) {
        cit.an = element.title.substring(element.title.search(/19\d\d/g), element.title.indexOf(' ', element.title.search(/19\d\d/g)))
    }
    else if (element.content[0].includes('19')) {
        cit.an = element.content[0]
    }
    cit.img = 'castro'
    cit.link = `./castro/index.html?id=T${element.idChr}#${element.idChr}`
    citate.push(cit)
})

debordTexts.forEach(element => {
    let noInds = element.content.filter(item => item.includes(`class="noind`))
    noInds.forEach(element2 => {
        let element2Index = element.content.indexOf(element2)
        let nextElement2 = noInds[noInds.indexOf(element2) + 1]
        let element2Index2 = element.content.indexOf(nextElement2)
        if (nextElement2 == undefined) {
            element2Index2 = element.content.length
        }

        let textContent = element.content.slice(element2Index, element2Index2)

        let cit = Object.create(citat);
        cit.id = id
        id += 1
        cit.idCit = element.idChr
        cit.isText = false
        cit.autor = 'Guy Debord'

        cit.titlu = `${element.title}<br/>(Societatea spectacolului)`
        cit.text = textContent.join('')

        cit.img = 'debord'
        cit.an = '1967'
        cit.link = `./debord/index.html?id=T${element.idChr}#${element.idChr}`
        citate.push(cit)
    })
})

export default citate