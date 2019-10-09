const sinon = require('sinon');
const expect = require('chai').expect;
const {
    buildAST: buildAST,
    castAtom: castAtom,
    consCell: consCell
} = require('../src/abstract-syntax-tree-builder');

describe('Converting atomic tokens into appropriate types', () => {
    it('should turn a token representing a number into a number', () => {
        const numberToken = '123';
        const expectedNumber = 123;
        const result = castAtom(numberToken);

        expect(result).to.be.a('number');
        expect(result).to.be.eql(expectedNumber);
    });

    it('should handle negative numbers', () => {
        const numberToken = '-127';
        const expectedNumber = -127;
        const result = castAtom(numberToken);

        expect(result).to.be.a('number');
        expect(result).to.be.eql(expectedNumber);
    });

    it('should handle floating point numbers', () => {
        const numberToken = '123.456';
        const expectedNumber = 123.456;
        const result = castAtom(numberToken);

        expect(result).to.be.a('number');
        expect(result).to.be.eql(expectedNumber);
    });


    it('should return any non-number as a string representing a symbol', () => {
        const symbolToken = 'a-string';
        const expectedSymbol = 'a-string';
        const result = castAtom(symbolToken);

        expect(result).to.be.a('string');
        expect(result).to.be.eql(expectedSymbol);
    });
});

describe('Assembling an AST from tokens', () => {

    it('should build an AST of one number', () => {
        const tokens = ['4'];
        const resultAST = buildAST(tokens);

        expect(resultAST).to.eql(consCell(4, null));
    });

    it('should build an AST of one symbol', () => {
        const tokens = ['bob'];
        const resultAST = buildAST(tokens);

        expect(resultAST).to.eql(consCell('bob', null));
    });

    it('should build an AST (flat) with two nodes for two tokens', () => {
        const tokens = ['inc', '5'];
        const expectedAST = consCell('inc', consCell(5));

        const resultAST = buildAST(tokens);
        expect(expectedAST).to.be.eql(resultAST);
    });

    it('should lists in the first position and build down', () => {
        const tokens = ['(', '1', ')'];
        const expectedAST = consCell(consCell(1));

        const resultAST = buildAST(tokens);
        expect(expectedAST).to.be.eql(resultAST);
    });

    it('should terminate all consCell chains with nulls', () => {
        const tokens = ['(', '+', '1', '4', ')'];
        const expectedAST =
            consCell(
                consCell('+',
                    consCell(1,
                        consCell(4))));

        const resultAST = buildAST(tokens);
        expect(expectedAST).to.be.eql(resultAST);
    });


    it('should handle sub-lists', () => {
        const tokens = ['(', '+', '(', '+', '1', ')', ')'];
        const expectedAST =
            consCell(consCell('+',
                consCell(consCell('+',
                    consCell(1)))));
        const resultAST = buildAST(tokens);
        expect(expectedAST).to.be.eql(resultAST);
    });

    it('should handle sub-lists in an arbitrary position', () => {
        const tokens = ['(', '+', '(', '+', '1', ')', '4', ')'];
        const expectedAST =
            consCell(consCell('+',
                consCell(
                    consCell('+', consCell(1)),
                    consCell(4))));

        const resultAST = buildAST(tokens);
        expect(expectedAST).to.be.eql(resultAST);
    });


    it('should handle multiple adjacent sub-lists', () => {
        const tokens = ['(', '+', '(', '-', '10', '5', ')', '(', '+', '1', '4', ')', ')'];

        const expectedAST =
            consCell(consCell('+',
                consCell(
                    consCell('-', consCell(10, consCell(5))),
                    consCell(consCell('+', consCell(1, consCell(4)))))));

        const resultAST = buildAST(tokens);
        expect(expectedAST).to.be.eql(resultAST);
    });

    it('should handle multiple sub-lists', () => {
        const tokens = ['(', '+', '(', '-', '10', '5', ')', '(', '+', '1', '4', ')', '(', '+', '3', '4', ')', ')'];

        const expectedAST =
            consCell(consCell('+',
                consCell(
                    consCell('-', consCell(10, consCell(5))),
                    consCell(
                        consCell('+', consCell(1, consCell(4))),
                        consCell(consCell('+', consCell(3, consCell(4))))
                    )
                )));

        const resultAST = buildAST(tokens);
        expect(expectedAST).to.be.eql(resultAST);
    });
});
