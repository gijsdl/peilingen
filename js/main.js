const saveBtn = document.querySelector('.submit-btn');
const fileInput = document.querySelector('.file-input');
const partiesWrapper = document.querySelector('.parties-wrapper');
const partiesField = document.querySelector('.parties');
const calculateBtn = document.querySelector('.calculate');
const resultField = document.querySelector('.result');

let polls = [];

returnLocalStorage();

saveBtn.addEventListener('click', readFile);
fileInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        readFile();
    }
});
calculateBtn.addEventListener('click', calculateAndShow);


function readFile() {
    polls = [];
    const file = fileInput.files[0];

    const fileReader = new FileReader();
    fileReader.readAsBinaryString(file);
    fileReader.onload = async (e) => {
        const fileData = e.target.result;
        const workbook = XLSX.read(
            fileData,
            {type: "binary"},
            {dateNF: "dd/mm/yyyy"}
        );

        for await  (const sheet of workbook.SheetNames) {
            const pageData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet], {
                raw: false,
            });
            const poll = new Poll(sheet);
            polls.push(poll);
            poll.createParties(pageData);
        }
        showParties();
        updateLocalStorage();
    }

}

function showParties() {
    partiesWrapper.classList.remove('hidden');
    partiesField.removeChild(partiesField.firstChild);
    const wrapperRow = document.createElement('div');
    wrapperRow.classList.add('row');
    partiesField.appendChild(wrapperRow);
    wrapperRow.appendChild(polls[0].createPartyHTML());
    wrapperRow.appendChild(showPolls(wrapperRow));
    createEventListeners();
}

function showPolls() {
    const wrapperCol = document.createElement('div');
    wrapperCol.classList.add('col-6');

    const titleRow = document.createElement('div');
    titleRow.classList.add('row');
    const titleCol = document.createElement('div');
    titleCol.classList.add('col');
    titleRow.appendChild(titleCol);
    const title = document.createElement('h5');
    title.textContent = 'Pollen';
    titleCol.appendChild(title);
    wrapperCol.appendChild(titleRow);

    const dataRow = document.createElement('div');
    dataRow.classList.add('row');
    const dataCol = document.createElement('div');
    dataCol.classList.add('col');
    dataRow.appendChild(dataCol);
    polls.forEach((poll) => {
        dataCol.appendChild(poll.createPollHTML());
    });
    wrapperCol.appendChild(dataRow);

    return wrapperCol;
}

function createEventListeners() {
    const partiesCheckBox = document.querySelectorAll('.party');
    partiesCheckBox.forEach((checkbox) => {
        checkbox.addEventListener('change', changePartyEnabled);
    });
    const pollCheckBox = document.querySelectorAll('.poll');
    pollCheckBox.forEach((checkbox) => {
        checkbox.addEventListener('change', changePollEnabled);
    })
}

function changePartyEnabled(e) {
    const name = e.target.nextSibling.textContent;
    const enabled = e.target.checked;
    polls.forEach((poll) => {
        poll.parties.forEach((party) => {
            if (party.name === name) {
                party.enabled = enabled;
            }
        });
    });
    updateLocalStorage();
}

function changePollEnabled(e) {
    const name = e.target.nextSibling.textContent;
    const enabled = e.target.checked;
    polls.forEach((poll) => {
        if (poll.name === name) {
            poll.enabled = enabled;
        }
    });
    updateLocalStorage();
}

function updateLocalStorage() {
    localStorage.setItem('polls', JSON.stringify(polls));
}

function returnLocalStorage() {
    const pollsJson = localStorage.getItem('polls');
    if (pollsJson) {
        const tempPolls = JSON.parse(pollsJson);
        tempPolls.forEach((oldPoll) => {
            const poll = new Poll(oldPoll.name, oldPoll.enabled);
            polls.push(poll);
            poll.createPartiesFromJson(oldPoll.parties);
        });
        showParties()
    }
}

function calculateAndShow() {
    resultField.classList.remove('hidden');
    resultField.removeChild(resultField.firstChild);

    const wrapperRow = document.createElement('div');
    wrapperRow.classList.add('row');
    resultField.appendChild(wrapperRow);

    polls.forEach((poll) => {
        if (poll.enabled) {
            poll.parties.sort((a, b) => b.seats - a.seats);
            const governingParties = [];
            let seats = 0;
            let i = 0;
            while (seats < 75 && i < poll.parties.length) {
                const party = poll.parties[i];
                if (party.enabled) {
                    governingParties.push(party);
                    seats += parseInt(party.seats);
                }
                i++;
            }
            wrapperRow.appendChild(poll.createResultHTML(governingParties, seats));
        }
    });
}