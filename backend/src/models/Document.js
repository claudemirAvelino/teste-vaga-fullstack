class Document {
    constructor(props) {
        this._nrCpfCnpj = props.nrCpfCnpj;
        this._vlTotal = props.vlTotal;
        this._vlPresta = props.vlPresta;
        this._vlMora = props.vlMora;
        this._vlMulta = props.vlMulta;
        this._vlOutAcr = props.vlOutAcr;
        this._vlIof = props.vlIof;
        this._vlDescon = props.vlDescon;
        this._vlAtual = props.vlAtual;
        this._qtPrestacoes = props.qtPrestacoes;
        this._documentIsValid = true;
    }

    get nrCpfCnpj() { return this._nrCpfCnpj; }
    get vlTotal() { return this._vlTotal; }
    get vlPresta() { return this._vlPresta; }
    get vlMora() { return this._vlMora; }
    get vlMulta() { return this._vlMulta; }
    get vlOutAcr() { return this._vlOutAcr; }
    get vlIof() { return this._vlIof; }
    get vlDescon() { return this._vlDescon; }
    get vlAtual() { return this._vlAtual; }
    get qtPrestacoes() { return this._qtPrestacoes; }

    set vlTotal(value) { this._vlTotal = value; }
    set vlPresta(value) { this._vlPresta = value; }
    set vlMora(value) { this._vlMora = value; }
    set vlMulta(value) { this._vlMulta = value; }
    set vlOutAcr(value) { this._vlOutAcr = value; }
    set vlIof(value) { this._vlIof = value; }
    set vlDescon(value) { this._vlDescon = value; }
    set vlAtual(value) { this._vlAtual = value; }
    set qtPrestacoes(value) { this._qtPrestacoes = value; }
}

module.exports = Document