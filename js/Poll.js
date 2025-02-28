class Poll {
    constructor(name, enabled = true) {
        this.name = name;
        this.parties = [];
        this.enabled = enabled;
    }

    createParties(pageData) {

        pageData.forEach((data) => {
            this.parties.push(new Party(data.Partij, data.Zetels));
        });
    }

    createPartiesFromJson(parties) {
        parties.forEach((party) => {
            this.parties.push(new Party(party.name, party.seats, party.enabled));
        });
    }

    createPartyHTML() {

        const wrapperCol = document.createElement('div');
        wrapperCol.classList.add('col-6');

        const titleRow = document.createElement('div');
        titleRow.classList.add('row');
        const titleCol = document.createElement('div');
        titleCol.classList.add('col');
        titleRow.appendChild(titleCol);
        const title = document.createElement('h5');
        title.textContent = 'partijen';
        titleCol.appendChild(title);
        wrapperCol.appendChild(titleRow);

        const dataRow = document.createElement('div');
        dataRow.classList.add('row');
        const dataCol = document.createElement('div');
        dataCol.classList.add('col');
        dataRow.appendChild(dataCol);

        this.parties.forEach((party) => {
            dataCol.appendChild(party.createCheckElement());
        });

        wrapperCol.appendChild(dataRow);
        return wrapperCol;
    }

    createPollHTML() {
        const checkWrapper = document.createElement('div');
        checkWrapper.classList.add('form-check');
        const input = document.createElement('input');
        input.setAttribute('type', 'checkbox');
        input.classList.add('form-check-input', 'poll');
        input.setAttribute('id', this.name);
        if (this.enabled) {
            input.setAttribute('checked', '');
        }
        const label = document.createElement('label');
        label.setAttribute('for', this.name);
        label.classList.add('form-check-label');
        label.textContent = this.name;
        checkWrapper.appendChild(input);
        checkWrapper.appendChild(label);
        return checkWrapper;
    }

    createResultHTML(governingParties, total) {

        const wrapperCol = document.createElement('div');
        wrapperCol.classList.add('col-3');
        const titleRow = document.createElement('div');
        titleRow.classList.add('row');
        wrapperCol.appendChild(titleRow);
        const titleCol = document.createElement('div');
        titleCol.classList.add('col');
        titleRow.appendChild(titleCol);
        const title = document.createElement('h5');
        title.textContent = this.name;
        if (total < 75) {
            const span = document.createElement('span');
            span.classList.add('text-danger');
            span.textContent = ' Niet haalbaar';
            title.appendChild(span);
        }
        titleCol.appendChild(title);

        const dataRow = document.createElement('div');
        dataRow.classList.add('row');
        wrapperCol.appendChild(dataRow);

        const dataCol = document.createElement('div');
        dataCol.classList.add('col');
        dataRow.appendChild(dataCol);

        const table = document.createElement('table');
        table.classList.add('table', 'table-striped');
        if (total >= 75) {
            table.classList.add('table-primary');
        } else {
            table.classList.add('table-danger');
        }
        dataCol.appendChild(table);
        const thead = document.createElement('thead');
        table.appendChild(thead);
        const tr = document.createElement('tr');
        thead.appendChild(tr);
        const thParty = document.createElement('th');
        thParty.textContent = 'Partij';
        tr.appendChild(thParty);
        const thSeats = document.createElement('th');
        thSeats.textContent = 'Zetels';
        tr.appendChild(thSeats);

        const tbody = document.createElement('tbody');
        table.appendChild(tbody);

        governingParties.forEach((party) => {
            tbody.appendChild(party.createResultHTML());
        });

        const trTotal = document.createElement("tr");
        tbody.appendChild(trTotal);
        const thTotal = document.createElement('th');
        thTotal.setAttribute('scope', 'row');
        thTotal.textContent = 'Totaal';
        trTotal.appendChild(thTotal);
        const td = document.createElement('td');
        td.textContent = total;
        trTotal.appendChild(td);


        return wrapperCol;
    }
}