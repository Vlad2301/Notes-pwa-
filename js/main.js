const inputTitle = document.querySelector('.edit__title');
const textareaContent = document.querySelector('.edit__content');
const arrowBack = document.querySelector('.arrow-back-icon');
const addNoteIcon = document.querySelector('.add-icon-block');
const mainContainer = document.querySelector('.main-container');
const editNoteContainer = document.querySelector('.edit-note');
const notesCount = document.querySelector('.notesCount');
const containerNotes = document.querySelector('.container__notes');
const installIcon = document.querySelector('.install-icon');

let noteList = [];
let noteId = -1;

const onLoad = () => {
    noteList = window.localStorage.getItem('noteList') ? JSON.parse(window.localStorage.getItem('noteList')) : [];

    notesCount.innerText = noteList.length;

    if (noteList) {
        noteList.map(el => containerNotes.appendChild(createNewNoteHTML(el.id, el.title, el.date)));
    }
}
const removeNoteFromList = (id) => {
    noteList.map((el, index) => {
        if (el.id === id) {
            noteList.splice(index, 1);
        }
    });

    window.localStorage.setItem('noteList', JSON.stringify(noteList));
    window.location.reload();
}

const createNewNoteHTML = (id, noteTitle, noteDate) => {
    const note = document.createElement('div');
    note.classList.add('container__note');
    note.innerHTML = `
        <h2 class="note__title">${noteTitle}</h2>
        <time class="note__date">${noteDate}</time>
        <div class="delete-icon">
            <span class="material-symbols-outlined">delete</span>
        </div>
    `;

    note.addEventListener('click', () => {
        noteId = id;
        goToEdit();
    })

    note.lastElementChild.addEventListener('click', () => {
        removeNoteFromList(id);
    })

    return note;
}

const goToEdit = () => {
    editNoteContainer.classList.toggle('active');
    mainContainer.classList.toggle('deactive');

    noteList.map(el => {
        if (el.id === noteId) {
            inputTitle.value = el.title;
            textareaContent.value = el.text;
        }
    })
    textareaContent.focus();
}


onLoad();

const createNewNote = () => {
    const date = moment(new Date());
    const note = {
        id: textareaContent.value.length + inputTitle.value.length,
        title: inputTitle.value,
        text: textareaContent.value,
        date: date.format('LL'),
    }
    noteList.push(note);
}

const arrowBackClick = () => {
    saveNote();

    editNoteContainer.classList.toggle('active');
    mainContainer.classList.toggle('deactive');

    noteId = -1;
    window.location.reload();
}

const updateNote = () => {
    const date = moment(new Date());
    noteList.map(el => {
        if (el.id === noteId) {
            el.title = inputTitle.value;
            el.text = textareaContent.value;
            el.date = date.format('LL');
        }
    })
}

const addNoteClick = () => {
    editNoteContainer.classList.toggle('active');
    mainContainer.classList.toggle('deactive');
}

const saveNote = () => {
    if (textareaContent.value) {
        if (noteId < 0) {
            createNewNote();
        } else {
            updateNote();
        }
        window.localStorage.setItem('noteList', JSON.stringify(noteList));
    }
}
arrowBack.addEventListener('click', arrowBackClick);

addNoteIcon.addEventListener('click', addNoteClick);


window.addEventListener('load', async () => {
    if (navigator.serviceWorker) {
        try {
            await navigator.serviceWorker.register('../sw.js');
            console.log('Service worker register success');
        } catch (e) {
            console.log('Service worker register fail');
        }
    }
});