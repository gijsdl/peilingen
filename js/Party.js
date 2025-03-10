class Party {
    constructor(name, seats, enabled = true) {
        this.name = name;
        this.seats = seats;
        this.enabled = enabled;
    }

    createCheckElement() {
        const checkWrapper = document.createElement('div');
        checkWrapper.classList.add('form-check');
        const input = document.createElement('input');
        input.setAttribute('type', 'checkbox');
        input.classList.add('form-check-input', 'party');
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

    createResultHTML() {
        const tr = document.createElement("tr");
        const th = document.createElement('th');
        th.setAttribute('scope', 'row');
        th.textContent = this.name;
        tr.appendChild(th);
        const td = document.createElement('td');
        td.textContent = this.seats;
        tr.appendChild(td);
        return tr;
    }

}