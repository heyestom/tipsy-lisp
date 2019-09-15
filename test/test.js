const main = require('../src/main.js');
const sinon = require('sinon');
const expect = require('chai').expect;


describe('End to end parsing and evaluation', () => {
    it('will return numeric constants', () => {
        const tipsyExpression = '4';
        const expectedOutput = 4;
        const result = main.interprit(tipsyExpression);
        expect(result).to.eql(expectedOutput);
    });

    it('can add two numbers', () => {
        const tipsyExpression = '(+ 1 2)';
        const expectedOutput = 3;
        const result = main.interprit(tipsyExpression);
        expect(result).to.eql(expectedOutput);
    });

    it('can subtract an arbitrary number of numbers', () => {
        const tipsyExpression = '(- 9 3 3 2)';
        const expectedOutput = 1;
        const result = main.interprit(tipsyExpression);
        expect(result).to.eql(expectedOutput);
    });

    it('can multiply numbers', () => {
        const tipsyExpression = '(* 3 1 2)';
        const expectedOutput = 6;
        const result = main.interprit(tipsyExpression);
        expect(result).to.eql(expectedOutput);
    });

    it('can divide numbers', () => {
        const tipsyExpression = '(/ 4 2)';
        const expectedOutput = 2;
        const result = main.interprit(tipsyExpression);
        expect(result).to.eql(expectedOutput);
    });

    it('can work with sub lists', () => {
        const tipsyExpression = '(+ (- 1 2) (- 8 4))';
        const expectedOutput = 3;
        const result = main.interprit(tipsyExpression);
        expect(result).to.eql(expectedOutput);
    });
});

describe('Parsing: ', () => {
    describe('tokenise should break down input into individual parts', () => {
        it('should return an emppty list of toekns for the empty string', () => {
            const lispInput = "";
            const tokenisedOutput = main.tokenise(lispInput);
            const emptyList = [];
            expect(tokenisedOutput).to.eql(emptyList);
        });

        it('should return a token list of one item for a single number', () => {
            const lispInput = '3';
            const tokenisedOutput = main.tokenise(lispInput);
            const expectedOutput = ['3'];
            expect(tokenisedOutput).to.be.eql(expectedOutput);
        });

        it('should tokenise a floating numbers maintaining order', () => {
            const lispInput = '1.2 3.4';
            const tokenisedOutput = main.tokenise(lispInput);
            const expectedOutput = ['1.2', '3.4'];
            expect(tokenisedOutput).to.have.ordered.members(expectedOutput);
        });

        it('should tokenise a series of numbers maintaining order', () => {
            const lispInput = '1 2 3';
            const tokenisedOutput = main.tokenise(lispInput);
            const expectedOutput = ['1', '2', '3'];
            expect(tokenisedOutput).to.have.ordered.members(expectedOutput);
        });

        it('should be able to tokenise symbols maintaining order', () => {
            const lispInput = 'hello world if cdr';
            const tokenisedOutput = main.tokenise(lispInput);
            const expectedOutput = ['hello', 'world', 'if', 'cdr'];
            expect(tokenisedOutput).to.have.ordered.members(expectedOutput);
        });

        it('should be able to tokenise a mixture of numbers and symbols maintaining order', () => {
            const lispInput = '456 world 234.4 cdr';
            const tokenisedOutput = main.tokenise(lispInput);
            const expectedOutput = ['456', 'world', '234.4', 'cdr'];
            expect(tokenisedOutput).to.have.ordered.members(expectedOutput);
        });

        describe("tokenising lists", () => {
            it('should be able to tokenise the empty list', () => {
                const lispInput = '()';
                const tokenisedOutput = main.tokenise(lispInput);
                const expectedOutput = ['(', ')'];
                expect(tokenisedOutput).to.have.ordered.members(expectedOutput);
            });

            it('should be able to tokenise a list with a single item', () => {
                const lispInput = '(123)';
                const tokenisedOutput = main.tokenise(lispInput);
                const expectedOutput = ['(', '123', ')'];
                expect(tokenisedOutput).to.have.ordered.members(expectedOutput);
            });

            it('should be able to tokenise a list containg a sub list', () => {
                const lispInput = '((inc 123))';
                const tokenisedOutput = main.tokenise(lispInput);
                const expectedOutput = ['(', '(', 'inc', '123', ')', ')'];
                expect(tokenisedOutput).to.have.ordered.members(expectedOutput);
            });

            it('should be able to tokenise multiple sub lists', () => {
                const lispInput = '((inc)(bob))';
                const tokenisedOutput = main.tokenise(lispInput);
                const expectedOutput = ['(', '(', 'inc', ')', '(', 'bob', ')', ')'];
                expect(tokenisedOutput).to.have.ordered.members(expectedOutput);
            });
        });
    });


    describe('Converting atomic tokens into appropriate types', () => {
        it('should turn a token representing a number into a number', () => {
            const numberToken = '123';
            const expectedNumber = 123;

            const result = main.castAtom(numberToken);

            expect(result).to.be.a('number');
            expect(result).to.be.eql(expectedNumber);
        });

        it('should handle negative numbers', () => {
            const numberToken = '-127';
            const expectedNumber = -127;

            const result = main.castAtom(numberToken);

            expect(result).to.be.a('number');
            expect(result).to.be.eql(expectedNumber);
        });

        it('should handle floating point numbers', () => {
            const numberToken = '123.456';
            const expectedNumber = 123.456;

            const result = main.castAtom(numberToken);

            expect(result).to.be.a('number');
            expect(result).to.be.eql(expectedNumber);
        });


        it('should return any non-number as a string representing a symbol', () => {
            const symbolToken = 'a-string';
            const expectedSymbol = 'a-string';

            const result = main.castAtom(symbolToken);

            expect(result).to.be.a('string');
            expect(result).to.be.eql(expectedSymbol);
        });
    });

    describe('Assembling an AST from tokens', () => {

        const consCell = (first, rest) => {
            if (rest === undefined) rest = null;
            return {
                first: first,
                rest: rest
            };
        };

        it('should build an AST of one number', () => {
            const tokens = ['4'];
            const resultAST = main.buildAST(tokens);

            expect(resultAST).to.eql(consCell(4, null));
        });

        it('should build an AST of one symbol', () => {
            const tokens = ['bob'];
            const resultAST = main.buildAST(tokens);

            expect(resultAST).to.eql(consCell('bob', null));
        });

        it('should build an AST (flat) with two nodes for two tokens', () => {
            const tokens = ['inc', '5'];
            const expectedAST = consCell('inc', consCell(5));

            const resultAST = main.buildAST(tokens);
            expect(expectedAST).to.be.eql(resultAST);
        });

        it('should lists in the first position and build down', () => {
            const tokens = ['(', '1', ')'];
            const expectedAST = consCell(consCell(1));

            const resultAST = main.buildAST(tokens);
            expect(expectedAST).to.be.eql(resultAST);
        });

        it('should terminate all consCell chains with nulls', () => {
            const tokens = ['(', '+', '1', '4', ')'];
            const expectedAST =
                consCell(
                    consCell('+',
                        consCell(1,
                            consCell(4))));

            const resultAST = main.buildAST(tokens);
            expect(expectedAST).to.be.eql(resultAST);
        });


        it('should handle sub-lists', () => {
            const tokens = ['(', '+', '(', '+', '1', ')', ')'];
            const expectedAST =
                consCell(consCell('+',
                    consCell(consCell('+',
                        consCell(1)))));
            const resultAST = main.buildAST(tokens);
            expect(expectedAST).to.be.eql(resultAST);
        });

        it('should handle sub-lists in an arbitrary position', () => {
            const tokens = ['(', '+', '(', '+', '1', ')', '4', ')'];
            const expectedAST =
                consCell(consCell('+',
                    consCell(
                        consCell('+', consCell(1)),
                        consCell(4))));

            const resultAST = main.buildAST(tokens);
            expect(expectedAST).to.be.eql(resultAST);
        });


        it('should handle multiple adjacent sub-lists', () => {
            const tokens = ['(', '+', '(', '-', '10', '5', ')', '(', '+', '1', '4', ')', ')'];

            const expectedAST =
                consCell(consCell('+',
                    consCell(
                        consCell('-', consCell(10, consCell(5))),
                        consCell(consCell('+', consCell(1, consCell(4)))))));

            const resultAST = main.buildAST(tokens);
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

            const resultAST = main.buildAST(tokens);
            expect(expectedAST).to.be.eql(resultAST);
        });
    });

    describe('Evaluation: ', () => {

        const consCell = (first, rest) => {
            if (rest === undefined) rest = null;
            return {
                first: first,
                rest: rest
            };
        };

        it('should return numeric constants', () => {
            const input = 4;
            const resultAST = main.eval(consCell(input));
            expect(resultAST).to.be.eql(input);
        });

        it('should return string constants', () => {
            const input = 'b';
            const resultAST = main.eval(consCell(input));
            expect(resultAST).to.be.eql(input);
        });

        xit('should return the empty list', () => {
            const input = '';
            const resultAST = main.eval(consCell(input));
            expect(resultAST).to.be.eql(input);
        });

        it('should be able to add two numbers together using a function', () => {
            const firstNumber = 2;
            const secondNumber = 4;
            const expectedNumber = firstNumber + secondNumber;

            const inputAST =
                consCell('+',
                    consCell(firstNumber,
                        consCell(secondNumber)));

            const resultAST = main.eval(inputAST);

            expect(resultAST).to.be.eql(expectedNumber);
        });

        it('should be able to subtract one number from another', () => {
            const firstNumber = 190;
            const secondNumber = 23;
            const expectedNumber = firstNumber - secondNumber;

            const inputAST =
                consCell('-',
                    consCell(firstNumber,
                        consCell(secondNumber)));

            const resultAST = main.eval(inputAST);
            expect(resultAST).to.be.eql(expectedNumber);
        });
    });
});
