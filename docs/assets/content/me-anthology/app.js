/* eslint-disable no-useless-escape */
/* eslint-disable no-irregular-whitespace */
import chapters from './msj/chapters.mjs';
import texts from './msj/texts.mjs';
import parts from './msj/parts.mjs';
import notes from './msj/notes.mjs';
import citate from './citate/citate.mjs';

class ExpandedButton {
  constructor(title, idChr, index) {
    this.title = title;
    this.idChr = idChr;
    this.index = index;
    this.expanded = false;
  }
  toString() {
    return `<section class="container"> <button class="expand-btn" id="${this.idChr}">${this.title}</button> </section>\n<div id="content${this.idChr}"></div>`;
  }
}

function highlight(element) {
  let defaultBG = element.style.backgroundColor;
  let defaultTransition = element.style.transition;

  element.style.transition = "background 1s";
  element.style.backgroundColor = "#c41616";

  setTimeout(function () {
    element.style.backgroundColor = defaultBG;
    setTimeout(function () {
      element.style.transition = defaultTransition;
    }, 1000);
  }, 1000);
}


const synth = window.speechSynthesis;
// let utterThis = new SpeechSynthesisUtterance()
// setTimeout(() => {
//   console.log(window.speechSynthesis.getVoices().filter(item => item.lang.includes('ro'))[0]);
// }, 5000);
// utterThis.voice = synth.getVoices().filter(item => item.lang.includes('ro'))[0]

const author = document.getElementById('author');
const titlu = document.getElementById('titlu');
const info = document.getElementById('info');
const contents = document.getElementById('contents');
const part = document.getElementById('part');
const modal = document.getElementById('modal');
const modalBody = document.getElementById('modal-body');
// const modalClose = document.querySelector(".modal-close");

// const modalClose = document.querySelectorAll('.modal-close');
// const expandBtn = document.querySelector('.expand-btn');



let chTexts = [];
let btnList = [];
let currentItem = 2;

function findNearestAnchorId(node) {
  while (node && (node.nodeName !== 'A' || (node.id && !node.id.includes('p')))) {
    node = node.previousSibling;
  }
  return node && node.id || null;
}

document.addEventListener('copy', (event) => {
  if (event == null) {
    return;
  }
  let selection = document.getSelection();
  if (selection.toString() != '') {
    let anchorId = findNearestAnchorId(selection.anchorNode);
    if (anchorId) {
      console.log(anchorId);
    }
    if (anchorId != null) {
      let res = ''
      res = res + window.location.href.substring(0, window.location.href.indexOf('index.html'))
      let parentElementId = selection.anchorNode.parentNode.parentNode.id.split('content')[1];
      res = res + `index.html?id=T${parentElementId}#${anchorId}`
      event.clipboardData.setData('text/plain', `${selection.toString()}\n\n${res}`);
    }
    else {
      event.clipboardData.setData('text/plain', `${selection.toString()}\n\n${window.location.href}`);
    }
    event.preventDefault();
  }
});

window.addEventListener("DOMContentLoaded", function () {
  let myPromise = new Promise(function (myResolve, myReject) {
    let voices = window.speechSynthesis.getVoices();
    if (voices.length !== 0) {
      myResolve(voices);
    } else {
      window.speechSynthesis.addEventListener("voiceschanged", function () {
        voices = window.speechSynthesis.getVoices();
        myResolve(voices);
      });
    }
  });

  myPromise.then(
    function (value) {
      // console.log(value)
      let x = location.search.split('id=')[1];
      if (x != undefined) {
        document.querySelector('header').innerHTML = '<form id="form1" action="javascript:"></form>'
        const container = document.getElementById('container');
        container.innerHTML = `<div class="review"> <div class="button-container"> <button class="prev-btn"> <i class="fas fa-chevron-left"></i> </button> <button class="next-btn"> <i class="fas fa-chevron-right"></i> </button> </div> <button class="random-btn"><i class="fa fa-random"></i> Surprise Me</button> <div></div><button class="expand-btn" id="cuprins"><i class="fa fa-book"></i> Table of Contents</button> <div></div> <button class="expand-btn" id="citate"><i class="fa fa-quote-right"></i> Marx and Engels Quotes</button> <div></div> <button class="expand-btn" id="home"><i class="fa fa-home"></i> Levos Homepage</button>`

        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        const randomBtn = document.querySelector('.random-btn');
        const citateList = document.getElementById('citate');
        const home = document.getElementById('home');

        document.getElementById('cuprins').addEventListener('click', function () {
          window.location.href = './index.html'
        })

        home.addEventListener('click', function () {
          window.location.href = '../index.html'
        })

        prevBtn.addEventListener('click', function () {
          if (currentItem == 0) {
            currentItem = chapters.length - 1;
          }
          else {
            currentItem--;
          }
          const chapter = chapters[currentItem]
          window.location.href = `./index.html?id=C${chapter.idCh}`;
        });

        nextBtn.addEventListener('click', function () {
          if (currentItem == chapters.length - 1) {
            currentItem = 0;
          }
          else {
            currentItem++;
          }
          const chapter = chapters[currentItem]
          window.location.href = `./index.html?id=C${chapter.idCh}`;
          // changeChapter(currentItem);
        });

        randomBtn.addEventListener('click', function () {
          let x = currentItem
          currentItem = Math.floor(Math.random() * chapters.length);
          while (currentItem <= 2 && currentItem != x) {
            currentItem = Math.floor(Math.random() * chapters.length);
          }
          const chapter = chapters[currentItem]
          window.location.href = `./index.html?id=C${chapter.idCh}`;
        });

        citateList.addEventListener('click', function () {
          let citItem = Math.floor(Math.random() * citate.length);
          // console.log(citItem)
          window.location.href = `./quotes.html?cit=${citItem}`;
        })

        document.querySelector('#TOC').setAttribute('display', 'none')

        try {
          if (x.includes('P')) {
            let p = x.split('P')[1]
            let part = parts.filter(element => element.idPt == p)[0];
            let chapter = chapters.filter(element => element.idCh.indexOf(part.idPt) == 0)[0];
            currentItem = chapters.indexOf(chapter);
            changeChapter(currentItem);
            generateTOC();
          }
          else if (x.includes('C')) {
            let c = x.split('C')[1]
            let chapter = chapters.filter(element => element.idCh.indexOf(c) == 0)[0];
            currentItem = chapters.indexOf(chapter);
            changeChapter(currentItem);
            generateTOC();
          }
          else if (x.includes('T')) {
            let t = x.split('T')[1]
            let text = texts.filter(element => element.idChr == t)[0];
            let cSearch = t.substring(0, 4)
            let chapter = chapters.filter(element => element.idCh.includes(cSearch))[0];
            currentItem = chapters.indexOf(chapter);
            changeChapter(currentItem);
            generateTOC();
            let btnX = btnList.filter(element => element.idChr == t)[0]
            let k = btnList.indexOf(btnX)
            openButton(text, btnX, k);
            // Search2();
          }
          else if (x == '0.01') {
            currentItem = 0;
            changeChapter(currentItem);
            generateTOC();
          }
          else if (x == '0.02') {
            currentItem = 1;
            changeChapter(currentItem);
            generateTOC();
          }
          else {
            let x = currentItem
            currentItem = Math.floor(Math.random() * chapters.length);
            while (currentItem <= 2 && currentItem != x) {
              currentItem = Math.floor(Math.random() * chapters.length);
            }
            const chapter = chapters[currentItem]
            window.location.href = `./index.html?id=C${chapter.idCh}`;
          }
        } catch (TypeError) {
          let x = currentItem
          currentItem = Math.floor(Math.random() * chapters.length);
          while (currentItem <= 2 && currentItem != x) {
            currentItem = Math.floor(Math.random() * chapters.length);
          }
          const chapter = chapters[currentItem]
          window.location.href = `./index.html?id=C${chapter.idCh}`;
        }
        let target = window.location.href.split('#')[1];
        if (target != undefined) {
          let textElement = document.querySelector('.titlu')
          if (target.includes('cit') || target.includes('p')) { textElement = document.querySelector(`a#${target}`) }
          else {
            textElement = document.getElementById(target)
          }
          textElement.scrollIntoView()
          if (target.includes('cit') || target.includes('p')) {
            highlight(textElement.parentElement)
          }
        }
      }
      else {
        const bookContent = document.getElementById('bookContent');
        bookContent.setAttribute('display', 'none');
        let res = ''
        res = res + '<div id="searchTOC">';
        res = res + '<div></div> <center><button class="expand-btn" id="download"><i class="fa fa-file-download"></i> Download EPUB</button><div></div><button class="expand-btn" id="home"><i class="fa fa-home"></i> Levos Homepage</button> <div></div> <button class="expand-btn" id="citate"><i class="fa fa-quote-right"></i> Marx and Engels Quotes</button></center>';
        res = res + '<table style="width: 50%; margin-left: auto; margin-right: auto;"> <tbody> <tr> <td><div id="searchTextInput"><input type="text" id="textInput2" placeholder="Search"></div></td></tr></tbody></table><tbody><table style="width: 50%; margin-left: auto; margin-right: auto;">';

        for (let p = 0; p < texts.length; p++) {
          let text = texts[p];

          if (text.title != '') { res = res + `<tr><td><span style="text-align: center;"><div><a href="./index.html?id=T${text.idChr}#${text.idChr}" id="CHR${text.idChr}">${text.info}: <b>${text.title}</b></a></div><div id="chr${text.idChr}"></div><hr style="width:30%;"/></span></tr></td>`; }
          else {
            res = res + `<tr><td><span style="text-align: center;"><div><a href="./index.html?id=T${text.idChr}#${text.idChr}" id="CHR${text.idChr}">${text.info}</a></div><div id="chr${text.idChr}"></div><hr style="width:30%;"/></span></tr></td>`;
          }
        }
        for (let p = 0; p < citate.length; p++) {
          let citat = citate[p];
          res = res + `<tr><td><span style="text-align: center;"><div><a href="./quotes.html?cit=${citat.id}" id="CIT${citat.id}">${citat.autor}, ${citat.titlu.replace(/(<[a|A][^>]*>|)/g, '')}</a></div><div id="cit${citat.id}"></div><hr style="width:30%;"/></span> </tr></td>`;
        }
        res = res + '</tbody></table></div>'

        res = res + '<div id="tocMAIN">'
        res = res + '<table style="width: 50%; margin-left: auto; margin-right: auto;"> <tbody> <tr> <td>'

        res = res + `<div style="text-align: center;"><a href="./index.html?id=0.01">${chapters[0].title}</a></div>`;
        res = res + `<div style="text-align: center;"><a href="./index.html?id=0.02">${chapters[1].title}</a></div>`;

        for (let i = 0; i < parts.length; i++) {
          let part = parts[i];
          res = res + `<div style="text-align: center;" class="dt"><b><a href="./index.html?id=P${part.idPt}" id="a${part.idPt}">${part.title}</a></b></div>`;
          let listCh = []
          listCh = chapters.filter(item => item.idCh.indexOf(part.idPt.substring(0, 2)) == 0);
          res = res + `<ol class="partOl">`
          for (let j = 0; j < listCh.length; j++) {
            let chapter = listCh[j];
            res = res + `<li><a href="./index.html?id=C${chapter.idCh}" id="aC${chapter.idCh}">${chapter.title}</a></li>`;
            let listTx = [];
            listTx = texts.filter(item => item.idChr.indexOf(chapter.idCh) == 0)
            res = res + '<ul>'
            for (let p = 0; p < listTx.length; p++) {
              let text = listTx[p];
              if (text.title != '') { res = res + `<li><a href="./index.html?id=T${text.idChr}#${text.idChr}" id="aCh${text.idChr}">${text.title}</a></li>`; }
              else {
                res = res + `<li><a href="./index.html?id=T${text.idChr}#${text.idChr}" id="aCh${text.idChr}">${text.info}</a></li>`;
              }
            }
            res = res + '</ul>';

          }
          res = res + '</ol>';
        }
        res = res + `</td></tr></tbody></table>`;
        let TOC = document.getElementById('TOC');
        TOC.innerHTML = res;
        const home = document.getElementById('home');
        const citateList = document.getElementById('citate');

        function downloadFile(url, fileName) {
          fetch(url, { method: 'get', mode: 'no-cors', referrerPolicy: 'no-referrer' })
            .then(res => res.blob())
            .then(res => {
              const aElement = document.createElement('a');
              aElement.setAttribute('download', fileName);
              const href = URL.createObjectURL(res);
              aElement.href = href;
              // aElement.setAttribute('href', href);
              aElement.setAttribute('target', '_blank');
              aElement.click();
              URL.revokeObjectURL(href);
            });
        };


        document.getElementById('download').addEventListener('click', function () {
          downloadFile('./The Marx Engels Anthology.epub', 'The Marx Engels Anthology.epub')
        })

        home.addEventListener('click', function () {
          window.location.href = '../index.html'
        })

        citateList.addEventListener('click', function () {
          let citItem = Math.floor(Math.random() * citate.length);
          // console.log(citItem)
          window.location.href = `./quotes.html?cit=${citItem}`;
        })


        const search = document.getElementById("searchTOC");

        let textList = search.getElementsByTagName("tr");
        for (let i = 1; i < textList.length; i++) {
          textList[i].style.display = "none";

        }
        Search2('tr', 'searchTOC', 'textInput2', 1, 'tocMAIN')
      }
    });
});

window.onclick = function (event) {
  if (event.target == modal) {
    // console.log(modal)
    modal.style.display = "none";

  }
}

function changeChapter(index) {
  // utterThis = new SpeechSynthesisUtterance()
  // utterThis.voice = synth.getVoices().filter(item => item.lang.includes('ro'))[0]
  synth.cancel()
  const item = chapters[index];
  if (item.author == 'levos' || item.author == 'tucker') {
    author.innerHTML = '';
    titlu.innerHTML = item.title;
    document.title = item.title;
    let i = 0;
    var descriere = '';
    descriere = descriere + `<center><div id="synthZone"></div></center>`
    descriere = descriere + `<p>&nbsp;</p><center><img class="${item.author}" src="./profiles/${item.author}.svg"/><center><p>&nbsp;</p>`
    for (i = 1; i < item.description.length; i++) {
      descriere = descriere + item.description[i];
    }

    descriere = descriere + `<center><a href="#titlu">▲</a></center>`
    descriere = descriere + `<div style="color: gray;" id=notes></div>`
    info.innerHTML = descriere;
    let x = 0;
    let listA = []
    for (x = 1; x <= 320; x++) {
      if (info.querySelector(`#n${x}`)) { listA.push(x); }

    }
    let k = 0;
    let res = '';
    if (listA.length > 0) {
      for (k = 0; k < listA.length; k++) {
        let x = listA[k];
        let note = notes.filter(item => item.idNote == x)[0];
        res = res + note.content
      }
    }
    const noteZone = document.getElementById('notes');
    noteZone.innerHTML = res;
    if (synth.getVoices().filter(item => item.lang.includes('ro')).length > 0) {
      document.getElementById(`synthZone`).innerHTML = `<button class="expand-btn" id="play"><i class="fa fa-play"></i></button>&nbsp;<button class="expand-btn" id="stop"><i class="fa fa-stop"></i></button>`
      const readText = document.getElementById(`play`);
      readText.addEventListener('click', function () {
        synth.cancel()
        for (let i = 0; i < item.description.length; i++) {
          let ourText = item.description[i].replace(/<[^>]*>/g, '');
          let utterThis = new SpeechSynthesisUtterance();
          utterThis.voice = synth.getVoices().filter(item => item.lang.includes('ro'))[0]
          utterThis.text = ourText;
          synth.speak(utterThis)
        }
      })
      const stopText = document.getElementById(`stop`);
      stopText.addEventListener('click', function () {
        synth.cancel();
      })
    }
    part.innerHTML = '';
    contents.innerHTML = '';
    if (item.author == 'tucker') { anchorChanger(); }
  }
  else {
    contents.innerHTML = '';
    btnList = []
    let partX = '';
    let autor = '';
    let i = 0;
    for (i = 0; i < parts.length; i++) {
      if (parts[i].idPt.indexOf(item.idCh[0]) == 0) {
        partX = parts[i].title;
      }
    }
    part.innerHTML = partX;
    author.innerHTML = item.author;
    let descriere = '';
    titlu.innerHTML = item.title;
    document.title = item.title;
    for (i = 0; i < item.description.length; i++) {
      descriere = descriere + item.description[i];
      // console.log(item.description[i])
    }
    info.innerHTML = descriere;
    chTexts = ContentList(item.idCh);
    let contentString = ''
    for (i = 0; i < chTexts.length; i++) {
      let expBtn = new ExpandedButton('', '', i);
      if (chTexts[i].title != "") { expBtn = new ExpandedButton(chTexts[i].title, chTexts[i].idChr, i); }
      else { expBtn = new ExpandedButton(chTexts[i].info, chTexts[i].idChr, i); }

      contentString = contentString + expBtn.toString() + '\n';
      btnList.push(expBtn);
    }
    contents.innerHTML = contentString;
    addFunct(btnList);
    anchorChanger();
  }
}

function anchorChanger() {
  let x = 0;
  let notesList = []
  for (x = 1; x <= 320; x++) {
    if (document.getElementById(`n${x}`)) { notesList.push(x); }
  }
  let i = 0;
  if (notesList.length > 0) {
    for (i = 0; i < notesList.length; i++) {

      let x = notesList[i];

      let a = document.getElementById(`n${x}`);
      let note = notes.filter(item => item.idNote == x)[0];
      a.onclick = function () {
        // console.log(note);
        modalBody.innerHTML = note.content
        modal.style.display = "block";
      }
    }

  }
}

function makeContent(a, boolean) {
  let content = ''
  a = a.substring(3)
  let text = texts.filter(element => element.idChr == a)[0];
  let contentList = text.content.filter(element => !element.includes('<h'));
  if (boolean === true) {
    content = contentList.join(" ").normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/<(?!(a id="p\d+"))[^>]+>/g, "");
  }
  else {
    content = contentList.join(" ").normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/<[^>]*>/g, "");
  }
  let notesListX = [...text.content.join(" ").matchAll(/\>\[[\d]+\]\</g)];
  let notesList = []
  notesListX.forEach(function (item) {
    item = item[0];
    item = parseInt(item.substring(2, item.length - 2));
    notesList.push(notes[item - 1])
  })
  notesList.forEach(function (note) {
    if (boolean === true) {
      content = content + ` ${note.content.normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/<(?!(a id="p\d+"))[^>]+>/g, "")}`;
    }
    else {
      content = content + ` ${note.content.normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/<[^>]*>/g, "")}`;
    }
  })
  // console.log(content)
  return content
}

function debounce(func, wait) {
  let timeout;

  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

function Search2(inputX, searchX, textInputX, startI, tocX) {
  const input = document.getElementById(textInputX);
  const search = document.getElementById(searchX);
  const toc = document.getElementById(tocX);
  const textList = search.getElementsByTagName(inputX);

  const handleKeyUp = debounce(function () {
    let filter = input.value.toUpperCase();
    if (filter != "") {
      toc.style.display = "none";
    } else {
      toc.style.display = "";
    }
    for (let i = startI; i < textList.length; i++) {
      const aX = textList[i].getElementsByTagName("a")[0]
      let a = aX.getAttribute("id");
      let content = ''
      if (a.includes('CHR')) {
        content = makeContent(a, false)
      }
      else {
        let x = parseInt(a.substring(3))
        let citat = citate.filter(item => item.id == x)[0]
        content = content + citat.text.normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/<[^>]*>/g, '');
      }
      if (filter != '') {
        if (content.toUpperCase().indexOf(filter) > -1) {
          textList[i].style.display = "";
          const aX = textList[i].getElementsByTagName("a")[0]
          let a = aX.getAttribute("id");
          if (content.toUpperCase().indexOf(filter) >= 0) {
            let j = content.toUpperCase().indexOf(filter);
            let res = ''
            if (j > 20) { res = '<i>„...' + content.substring(j - 20, j) + `<b><u>${content.substring(j, j + filter.length)}</b></u>` + content.substring(j + filter.length, j + filter.length + 20) + '...“</i>'; }
            else if (j == 0) { res = '<i>„' + `<b><u>${content.substring(j, j + filter.length)}</b></u>` + content.substring(j + filter.length, j + filter.length + 25) + '...“</i>'; }
            else { res = '<i>„' + content.substring(0, j) + `<b><u>${content.substring(j, j + filter.length)}</b></u>` + content.substring(j + filter.length, j + filter.length + 20) + '...“</i>'; }

            if (a.includes('CHR')) {
              let text = texts.filter(element => element.idChr == a.substring(3))[0];
              const div = document.getElementById(`chr${text.idChr}`);
              div.innerHTML = res;
              const DIV = document.getElementById(`CHR${text.idChr}`);
              // console.log(DIV.attributes.href.value)
              const index = DIV.attributes.href.value.indexOf('#')
              let toLookFor = content.substring(j, j + filter.length)
              let content2 = makeContent(a, true)
              let k = content2.indexOf(toLookFor)
              let match;
              const regex = /<a id="p(\d+)">/g
              let indices = [];
              while ((match = regex.exec(content2)) !== null) {
                indices.push(match.index);
              }
              indices = indices.filter(item => item < k)
              let k2 = indices[indices.length - 1]
              content2 = content2.substring(k2, content2.indexOf('>', k2))
              const result = content2.match(/"([^"]*)"/);

              DIV.attributes.href.value = DIV.attributes.href.value.substring(0, index) + `#${result[1]}`
            } else {
              let citat = citate.filter(element => element.id == parseInt(a.substring(3)))[0];
              const div = document.getElementById(`cit${citat.id}`);
              div.innerHTML = res;
            }


          }
          else {

            let text = texts.filter(element => element.idChr == a.substring(3))[0];
            const div = document.getElementById(`chr${text.idChr}`);
            div.innerHTML = '';

          }
        } else {
          textList[i].style.display = "none";
          const aX = textList[i].getElementsByTagName("a")[0]
          let a = aX.getAttribute("id");
          if (a.includes('CHR')) {
            let text = texts.filter(element => element.idChr == a.substring(3))[0];
            const div = document.getElementById(`chr${text.idChr}`);
            div.innerHTML = '';
          } else {
            let citat = citate.filter(element => element.id == parseInt(a.substring(3)))[0];
            const div = document.getElementById(`cit${citat.id}`);
            div.innerHTML = '';
          }
        }
      }
      else {
        textList[i].style.display = "none";
      }
    }
  }, 300); // Adjust debounce time as needed

  input.addEventListener("keyup", handleKeyUp);
}



function generateTOC() {
  const form1 = document.getElementById("form1");
  // form2 = document.getElementById("form2");
  let res = ''
  res = res + '<input id="left-menu" type="checkbox"> <input id="left-menu-reset" type="reset"> <nav class="left-navigation"> <main> <label class="menu-toggle" for="left-menu"><span>&nbsp;</span></label> <label class="menu-close" for="left-menu-reset"><span>&nbsp;</span></label> <menu>';
  res = res + '<div id="search">';
  res = res + '<div id="searchTextInput"><input type="text" id="textInput" placeholder="Search"><i class="fa-solid fa-magnifying-glass"></i></div>';

  for (let p = 0; p < texts.length; p++) {
    let text = texts[p];
    // console.log(text)
    if (text.title != '') { res = res + `<menuitem> <span><a href="./index.html?id=T${text.idChr}#${text.idChr}" id="CHR${text.idChr}">${text.info}: <b>${text.title}</b></a><hr style="width:30%;"/><div id="chr${text.idChr}"></div></span> </menuitem>`; }
    else {
      res = res + `<menuitem> <span><a href="./index.html?id=T${text.idChr}#${text.idChr}" id="CHR${text.idChr}">${text.info}</a><hr style="width:30%;"/><div id="chr${text.idChr}"></div></span> </menuitem>`;
    }
  }
  for (let p = 0; p < citate.length; p++) {
    let citat = citate[p];
    res = res + `<menuitem> <span><a href="./quotes.html?cit=${citat.id}" id="CIT${citat.id}">${citat.autor}, ${citat.titlu.replace(/(<[a|A][^>]*>|)/g, '')}</a><hr style="width:30%;"/><div id="cit${citat.id}"></div></span> </menuitem>`;
  }
  res = res + '</div>'

  // res = res + '<nav class="left-navigation"> <main>'
  // res = res + '<menu><main><nav>'
  res = res + '<div id="toc">'
  let citItem = Math.floor(Math.random() * citate.length);
  // res = res + '<input id="left-menu" type="checkbox"> <input id="left-menu-reset" type="reset"> <nav class="left-navigation"> <main> <label class="menu-toggle" for="left-menu"><span>&nbsp;</span></label> <label class="menu-close" for="left-menu-reset"><span>&nbsp;</span></label> <menu>';
  res = res + `<menuitem><menuitem> <span class="heading"><a href="./quotes.html?cit=${citItem}" id="a0.0"><i class="fa fa-quote-right"></i> Marx and Engels Quotes</a></span> </menuitem>`;
  res = res + '<menuitem><menuitem> <span class="heading"><a href="./index.html" id="A0.0"><i class="fa fa-book"></i> The Marx Engels Anthology</a></span> </menuitem>';
  res = res + `<menuitem> <span><a href="./index.html?id=0.01">${chapters[0].title}</a></span> </menuitem>`;
  res = res + `<menuitem> <span><a href="./index.html?id=0.02">${chapters[1].title}</a></span> </menuitem>`;
  for (let i = 0; i < parts.length; i++) {
    let part = parts[i];
    res = res + `<menuitem> <label for="left-menu-item-${i + 1}"><a href="./index.html?id=P${part.idPt}" id="a${part.idPt}">${part.title}</a></label> <input id="left-menu-item-${i + 1}" type="checkbox"> <nav> <main> <label class="menu-toggle" for="left-menu-item-${i + 1}"><span>&nbsp;</span></label> <menu>`;
    res = res + `<menuitem> <span class="heading"><a href="./index.html?id=P${part.idPt}" id="A${part.idPt}">${part.title}</a></span> </menuitem>`;
    let listCh = []
    for (let j = 0; j < chapters.length; j++) {
      let chapter = chapters[j]
      if (part.idPt.indexOf(chapter.idCh[0]) == 0) {
        // console.log(chapter)
        listCh.push(chapter);
      }
    }
    // console.log(listCh)
    for (let j = 0; j < listCh.length; j++) {
      let chapter = listCh[j];
      res = res + `<menuitem> <label for="left-menu-item-${i + 1}-${j + 1}"><a href="./index.html?id=C${chapter.idCh}" id="aC${chapter.idCh}">${chapter.title}</a></label> <input id="left-menu-item-${i + 1}-${j + 1}" type="checkbox"> <nav> <main> <label class="menu-toggle" for="left-menu-item-${i + 1}-${j + 1}"><span>&nbsp;</span></label> <menu> <menuitem> <span class="heading"><a href="./index.html?id=C${chapter.idCh}" id="AC${chapter.idCh}">${chapter.title}</a></span> </menuitem>`;
      // res = res + `<menuitem> <span class="heading">${chapter.title}</span> </menuitem>`;
      let listTx = [];
      for (let p = 0; p < texts.length; p++) {
        let text = texts[p];
        if (text.idChr.indexOf(chapter.idCh) == 0) {
          listTx.push(text);
        }
      }
      // console.log(listTx)
      for (let p = 0; p < listTx.length; p++) {
        let text = listTx[p];
        // console.log(text)
        if (text.title != '') { res = res + `<menuitem> <span><a href="./index.html?id=T${text.idChr}#${text.idChr}" id="aCh${text.idChr}">${text.title}</a></span> </menuitem>`; }
        else {
          res = res + `<menuitem> <span><a href="./index.html?id=T${text.idChr}#${text.idChr}" id="aCh${text.idChr}">${text.info}</a></span> </menuitem>`;
        }
      }
      res = res + '</menu></main></nav></menuitem>';

    }
    res = res + '</menu></main></nav></menuitem>';
  }
  res = res + `</div></menu></main></nav>`;
  if (window.innerWidth > 350) {
    form1.innerHTML = res;
    const search = document.getElementById("search");

    let textList = search.getElementsByTagName("menuitem");
    for (let i = 0; i < textList.length; i++) {
      textList[i].style.display = "none";
    }
    Search2('menuitem', 'search', 'textInput', 0, 'toc');
  }
}

async function openButton(text, btnX, i) {
  // const btn = document.getElementById(`${text.idChr}`);
  // console.log(window.speechSynthesis.getVoices());
  const contentsX = document.getElementById(`content${text.idChr}`);
  let resString = "";
  resString = resString + `<div id="synthZone${text.idChr}"></div>`
  // resString = resString + `<center><a href="#notes${text.idChr}">▽</a></center>`
  // resString = resString + '<p>&nbsp;</p>';
  if (text.title == '') {
    resString = resString + `<p>&nbsp;</p><table style="width: 30%; margin-left: auto; margin-right: auto;"> <tbody> <tr> <td style="text-align: center; color: gray;">~</td> <td style="width: 75%; text-align: center; color: gray;">${text.info}</td> <td style="text-align: center; color: gray;">~</td> </tr> </tbody> </table>`;
  }
  else {
    // resString = resString + `<h6>${text.title}</h6>`
  }
  resString = resString + `<p>&nbsp;</p><center><img class="${text.image}" src="./profiles/${text.image}.svg"/></center><p>&nbsp;</p>`;
  for (let j = 0; j < text.content.length; j++) {
    if (!text.content[j].includes(['\"marx\"', '\"marxy\"', '\"marxo\"', '\"engelsy\"', '\"engels\"', '\"marxengels\"']))
      resString = resString + '\n' + text.content[j];
  }
  resString = resString + `<center><a href="#${text.idChr}">▲</a></center>`
  resString = resString + `<div style="color: gray;" id=notes${text.idChr}></div>`
  contentsX.innerHTML = resString;
  let x = 0;
  let listA = []
  for (x = 1; x <= 320; x++) {
    if (contentsX.querySelector(`#n${x}`)) { listA.push(x); }
  }
  let iX = 0;
  let res = '';
  if (listA.length > 0) {
    for (iX = 0; iX < listA.length; iX++) {
      let x = listA[iX];
      let note = notes.filter(item => item.idNote == x)[0];
      res = res + note.content
    }
  }
  const noteZone = document.getElementById(`notes${text.idChr}`);
  noteZone.innerHTML = res;
  if (window.speechSynthesis.getVoices().filter(item => item.lang.includes('en')).length > 0) {
    document.getElementById(`synthZone${text.idChr}`).innerHTML = `<button class="expand-btn" id="play${text.idChr}"><i class="fa fa-play"></i></button>&nbsp;<button class="expand-btn" id="stop${text.idChr}"><i class="fa fa-stop"></i></button><div style="display: none"></div>`
    const readText = document.getElementById(`play${text.idChr}`);
    if (navigator.userAgent.indexOf("Win") != -1) {
      readText.addEventListener('click', function () {
        synth.cancel()
        let textToRead = Array.prototype.slice.call(document.getElementById(`content${text.idChr}`).children)
        for (let i = 0; i < text.content.length; i++) {
          if (text.content[i] != '<p>&nbsp;</p>') {
            let utterThis = new SpeechSynthesisUtterance();
            utterThis.voice = synth.getVoices().filter(item => item.lang.includes('en'))[0]
            document.getElementById(`synthZone${text.idChr}`).lastChild.innerHTML = text.content[i]
            let node = textToRead.filter(item => document.getElementById(`synthZone${text.idChr}`).lastChild.innerHTML.replace(/<[^>]*>/g, '') == item.innerHTML.replace(/<[^>]*>/g, ''))[0]
            // console.log(node)
            utterThis.text = node.innerHTML;
            let saveNode1 = node.innerHTML
            let saveNode = node.innerHTML
            utterThis.onboundary = function (event) {
              if (event.charIndex >= 0) {
                let index = event.charIndex
                let indexSp = saveNode1.indexOf(' ', index)
                if (indexSp == -1) {
                  indexSp = saveNode1.length
                }
                let innerHTML = saveNode.substring(0, event.charIndex) + '<span class="highlight">' + saveNode.substring(event.charIndex, indexSp) + '</span>' + saveNode.substring(indexSp)
                node.innerHTML = innerHTML
                anchorChanger()
              }
            }
            utterThis.onend = function () {
              node.innerHTML = saveNode1
              anchorChanger()
            }
            synth.speak(utterThis)
          }

          // utterThis.onstart = () => console.log()
        }
      })
    }
    else {
      readText.addEventListener('click', function () {
        synth.cancel()
        for (let i = 0; i < text.content.length; i++) {
          let utterThis = new SpeechSynthesisUtterance();
          utterThis.voice = synth.getVoices().filter(item => item.lang.includes('ro'))[0]
          utterThis.text = text.content[i].replace(/<[^>]*>/g, '');
          synth.speak(utterThis)
        }
      })
    }
    const stopText = document.getElementById(`stop${text.idChr}`);
    stopText.addEventListener('click', function () {
      synth.cancel();
    })
  }
  btnX.expanded = true;
  btnList[i] = btnX;
  anchorChanger();
}


function addFunct(btnList) {
  let i = 0;
  for (i = 0; i < chTexts.length; i++) {
    let btnX = btnList[i];
    let text = chTexts[i];
    const btn = document.getElementById(`${text.idChr}`);
    let j = 0;
    const contentsX = document.getElementById(`content${text.idChr}`);
    btn.addEventListener('click', function () {
      if (!btnX.expanded) {
        let resString = "";
        resString = resString + `<div id="synthZone${text.idChr}"></div>`
        // resString = resString + `<center><a href="#notes${text.idChr}">▽</a></center>`
        // resString = resString + '<p>&nbsp;</p>';
        if (text.title == '') {
          resString = resString + `<p>&nbsp;</p><table style="width: 30%; margin-left: auto; margin-right: auto;"> <tbody> <tr> <td style="text-align: center; color: gray;">~</td> <td style="width: 75%; text-align: center; color: gray;">${text.info}</td> <td style="text-align: center; color: gray;">~</td> </tr> </tbody> </table>`;
        }
        else {
          // resString = resString + `<h6>${text.title}</h6>`
        }
        resString = resString + `<p>&nbsp;</p><center><img class="${text.image}" src="./profiles/${text.image}.svg"/></center><p>&nbsp;</p>`;
        for (j = 0; j < text.content.length; j++) {
          if (!text.content[j].includes(['\"marx\"', '\"marxy\"', '\"marxo\"', '\"engelsy\"', '\"engels\"', '\"marxengels\"']))
            resString = resString + '\n' + text.content[j];
        }
        resString = resString + `<center><a href="#${text.idChr}">▲</a></center>`
        resString = resString + `<div style="color: gray;" id=notes${text.idChr}></div>`
        contentsX.innerHTML = resString;
        let x = 0;
        let listA = []
        for (x = 1; x <= 320; x++) {
          if (contentsX.querySelector(`#n${x}`)) { listA.push(x); }

        }
        let i = 0;
        let res = '';
        if (listA.length > 0) {
          for (i = 0; i < listA.length; i++) {
            let x = listA[i];
            let note = notes.filter(item => item.idNote == x)[0];
            res = res + note.content
          }
        }
        const noteZone = document.getElementById(`notes${text.idChr}`);
        noteZone.innerHTML = res;
        if (synth.getVoices().filter(item => item.lang.includes('en')).length > 0) {
          document.getElementById(`synthZone${text.idChr}`).innerHTML = `<button class="expand-btn" id="play${text.idChr}"><i class="fa fa-play"></i></button>&nbsp;<button class="expand-btn" id="stop${text.idChr}"><i class="fa fa-stop"></i></button><div style="display: none"></div>`
          const readText = document.getElementById(`play${text.idChr}`);
          if (navigator.userAgent.indexOf("Win") != -1) {
            readText.addEventListener('click', function () {
              synth.cancel()
              let textToRead = Array.prototype.slice.call(document.getElementById(`content${text.idChr}`).children)
              for (let i = 0; i < text.content.length; i++) {
                if (text.content[i] != '<p>&nbsp;</p>') {
                  let utterThis = new SpeechSynthesisUtterance();
                  utterThis.voice = synth.getVoices().filter(item => item.lang.includes('en'))[0]
                  document.getElementById(`synthZone${text.idChr}`).lastChild.innerHTML = text.content[i]
                  let node = textToRead.filter(item => document.getElementById(`synthZone${text.idChr}`).lastChild.innerHTML.replace(/<[^>]*>/g, '') == item.innerHTML.replace(/<[^>]*>/g, ''))[0]
                  // console.log(node)
                  utterThis.text = node.innerHTML;
                  let saveNode1 = node.innerHTML
                  let saveNode = node.innerHTML
                  utterThis.onboundary = function (event) {
                    if (event.charIndex >= 0) {
                      let index = event.charIndex
                      let indexSp = saveNode1.indexOf(' ', index)
                      if (indexSp == -1) {
                        indexSp = saveNode1.length
                      }
                      let innerHTML = saveNode.substring(0, event.charIndex) + '<span class="highlight">' + saveNode.substring(event.charIndex, indexSp) + '</span>' + saveNode.substring(indexSp)
                      node.innerHTML = innerHTML
                      anchorChanger()
                    }
                  }
                  utterThis.onend = function () {
                    node.innerHTML = saveNode1
                    anchorChanger()
                  }
                  synth.speak(utterThis)
                }

                // utterThis.onstart = () => console.log()
              }
            })
          }
          else {
            readText.addEventListener('click', function () {
              synth.cancel()
              for (let i = 0; i < text.content.length; i++) {
                let utterThis = new SpeechSynthesisUtterance();
                utterThis.voice = synth.getVoices().filter(item => item.lang.includes('ro'))[0]
                utterThis.text = text.content[i].replace(/<[^>]*>/g, '');
                synth.speak(utterThis)
              }
            })
          }
          const stopText = document.getElementById(`stop${text.idChr}`);
          stopText.addEventListener('click', function () {
            synth.cancel();
          })
        }
        btnX.expanded = true;
        btnList[i] = btnX;
        anchorChanger();
      }
      else {
        synth.cancel()
        btnX.expanded = false;
        btnList[i] = btnX;
        contentsX.innerHTML = '';
        anchorChanger();
      }
    });

  }
}

function ContentList(idCh) {
  let i = 0;
  let res = [];
  for (i = 0; i < texts.length; i++) {
    if (texts[i].idChr.includes(idCh) && texts[i].idChr.indexOf(idCh) == 0) {
      res.push(texts[i])
      // console.log(texts[i]);
    }
  }
  return res;
}

window.onclick = function (event) {
  const modal = document.querySelector(".modal");
  if (event.target == modal) {
    modal.style.display = "none";
  }
}