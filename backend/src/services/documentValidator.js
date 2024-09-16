// src/services/documentValidator.js

class DocumentValidator {

    static validateCPF(cpf) {
        cpf = cpf.replace(/[^\d]+/g, '');

        if (
            cpf.length !== 11 ||
            cpf === '00000000000' ||
            cpf === '11111111111' ||
            cpf === '22222222222' ||
            cpf === '33333333333' ||
            cpf === '44444444444' ||
            cpf === '55555555555' ||
            cpf === '66666666666' ||
            cpf === '77777777777' ||
            cpf === '88888888888' ||
            cpf === '99999999999'
        ) {
            return false;
        }

        let sum = 0;
        for (let i = 0; i < 9; i++) {
            sum += parseInt(cpf.charAt(i)) * (10 - i);
        }
        let remainder = 11 - (sum % 11);
        if (remainder === 10 || remainder === 11) {
            remainder = 0;
        }
        if (remainder !== parseInt(cpf.charAt(9))) {
            return false;
        }

        sum = 0;
        for (let i = 0; i < 10; i++) {
            sum += parseInt(cpf.charAt(i)) * (11 - i);
        }
        remainder = 11 - (sum % 11);
        if (remainder === 10 || remainder === 11) {
            remainder = 0;
        }
        if (remainder !== parseInt(cpf.charAt(10))) {
            return false;
        }

        return true;
    }

    static validateCNPJ(cnpj) {
        cnpj = cnpj.replace(/[^\d]+/g, '');

        if (
            cnpj.length !== 14 ||
            cnpj === '00000000000000' ||
            cnpj === '11111111111111' ||
            cnpj === '22222222222222' ||
            cnpj === '33333333333333' ||
            cnpj === '44444444444444' ||
            cnpj === '55555555555555' ||
            cnpj === '66666666666666' ||
            cnpj === '77777777777777' ||
            cnpj === '88888888888888' ||
            cnpj === '99999999999999'
        ) {
            return false;
        }

        let size = cnpj.length - 2;
        let numbers = cnpj.substring(0, size);
        const digits = cnpj.substring(size);
        let sum = 0;
        let pos = size - 7;
        for (let i = size; i >= 1; i--) {
            sum += parseInt(numbers.charAt(size - i)) * pos--;
            if (pos < 2) {
                pos = 9;
            }
        }
        let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
        if (result !== parseInt(digits.charAt(0))) {
            return false;
        }

        size = size + 1;
        numbers = cnpj.substring(0, size);
        sum = 0;
        pos = size - 7;
        for (let i = size; i >= 1; i--) {
            sum += parseInt(numbers.charAt(size - i)) * pos--;
            if (pos < 2) {
                pos = 9;
            }
        }
        result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
        if (result !== parseInt(digits.charAt(1))) {
            return false;
        }

        return true;
    }

    static convertToReal(value) {
        return MonetaryValueFormatter.format(value);
    }

    static validateTotal(document) {
        return (document.vlTotal / document.qtPrestacoes) === document.vlPresta;
    }

    static validate(document) {
        const isCpfValid = DocumentValidator.validateCPF(document.nrCpfCnpj);
        const isCnpjValid = DocumentValidator.validateCNPJ(document.nrCpfCnpj);
        const isTotalValid = DocumentValidator.validateTotal(document);

        return (isCpfValid || isCnpjValid) && isTotalValid;
    }

    static convertDocumentValues(document) {
        document.vlTotal = DocumentValidator.convertToReal(document.vlTotal)
        document.vlPresta = DocumentValidator.convertToReal(document.vlPresta)
        document.vlMora = DocumentValidator.convertToReal(document.vlMora)
        document.vlMulta = DocumentValidator.convertToReal(document.vlMulta)
        document.vlOutAcr = DocumentValidator.convertToReal(document.vlOutAcr)
        document.vlIof = DocumentValidator.convertToReal(document.vlIof)
        document.vlDescon = DocumentValidator.convertToReal(document.vlDescon)
        document.vlAtual = DocumentValidator.convertToReal(document.vlAtual)

        return document;
    }
}

class MonetaryValueFormatter {

    static format(value) {
        const formatter = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
        return formatter.format(value);
    }
}

module.exports = DocumentValidator;
