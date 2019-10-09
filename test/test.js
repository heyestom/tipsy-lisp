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

    describe('can handle single parameter arithmetic operations sensibly', () => {
        it('addition', () => {
            const tipsyExpression = '(+ 454)';
            const expectedOutput = 454;
            const result = main.interprit(tipsyExpression);
            expect(result).to.eql(expectedOutput);
        });

        it('subtraction', () => {
            const tipsyExpression = '(- 67)';
            const expectedOutput = -67;
            const result = main.interprit(tipsyExpression);
            expect(result).to.eql(expectedOutput);
        });

        it('division', () => {
            const tipsyExpression = '(/ 2)';
            const expectedOutput = 0.5;
            const result = main.interprit(tipsyExpression);
            expect(result).to.eql(expectedOutput);
        });

        it('multiplication', () => {
            const tipsyExpression = '(* 2)';
            const expectedOutput = 2;
            const result = main.interprit(tipsyExpression);
            expect(result).to.eql(expectedOutput);
        });
    });

    it('can work with sub lists', () => {
        const tipsyExpression = '(+ (- 1 2) (- 8 4))';
        const expectedOutput = 3;
        const result = main.interprit(tipsyExpression);
        expect(result).to.eql(expectedOutput);
    });

    describe('comparatives', () => {
        it('supports greater than comparison', () => {
            const tipsyExpression = '(> 3 4)';
            const expectedOutput = false;
            const result = main.interprit(tipsyExpression);
            expect(result).to.eql(expectedOutput);
        });

        it('supports greater than comparison for multiple numbers', () => {
            const tipsyExpression = '(> 6 5 4 2 1 0)';
            const expectedOutput = true;
            const result = main.interprit(tipsyExpression);
            expect(result).to.eql(expectedOutput);
        });
    });

    describe('conditionals! :)', () => {
        describe('if statements wich', () => {
            it('work for case with only true', () => {
                const tipsyExpression = '(if true 7)';
                const expectedOutput = 7;
                const result = main.interprit(tipsyExpression);
                expect(result).to.eql(expectedOutput);
            });
            it('work for true case', () => {
                const tipsyExpression = '(if true 7 9)';
                const expectedOutput = 7;
                const result = main.interprit(tipsyExpression);
                expect(result).to.eql(expectedOutput);
            });
            it('work for true evaluating comparison', () => {
                const tipsyExpression = '(if (> 6 1) 5 9)';
                const expectedOutput = 5;
                const result = main.interprit(tipsyExpression);
                expect(result).to.eql(expectedOutput);
            });
            it('work for true cases with conditional function calls', () => {
                const tipsyExpression = '(if (> 6 1) (+ 1 3 4) 9)';
                const expectedOutput = 8;
                const result = main.interprit(tipsyExpression);
                expect(result).to.eql(expectedOutput);
            });
            it('work for empty false case', () => {
                const tipsyExpression = '(if false 7)';
                const expectedOutput = null;
                const result = main.interprit(tipsyExpression);
                expect(result).to.eql(expectedOutput);
            });
            it('work for false case', () => {
                const tipsyExpression = '(if false 7 9)';
                const expectedOutput = 9;
                const result = main.interprit(tipsyExpression);
                expect(result).to.eql(expectedOutput);
            });
            it('work for false evaluating comparison', () => {
                const tipsyExpression = '(if (> 4 8) 7 10)';
                const expectedOutput = 10;
                const result = main.interprit(tipsyExpression);
                expect(result).to.eql(expectedOutput);
            });
            it('work for false cases with conditional function calls', () => {
                const tipsyExpression = '(if (> 4 8) 7 (- 100 10))';
                const expectedOutput = 90;
                const result = main.interprit(tipsyExpression);
                expect(result).to.eql(expectedOutput);
            });
            it('can be embeded in sub lists', () => {
                const tipsyExpression = '(+ 2 (if true 7) 10)';
                const expectedOutput = 19;
                const result = main.interprit(tipsyExpression);
                expect(result).to.eql(expectedOutput);
            });
            it('can be embeded in sub lists when false', () => {
                const tipsyExpression = '(+ 2 (if false 7 9) 10 10)';
                const expectedOutput = 31;
                const result = main.interprit(tipsyExpression);
                expect(result).to.eql(expectedOutput);
            });
            it('can be embeded in sub lists', () => {
                const tipsyExpression = '(+ 2 (if (if (> 2 8) (> 10 1) (> 24 90)) 100 0) 10 10)';
                const expectedOutput = 22;
                const result = main.interprit(tipsyExpression);
                expect(result).to.eql(expectedOutput);
            });
            it('can be nested in other ifs in sub lists', () => {
                const tipsyExpression = '(+ 2 (if (if true (> 10 1) false) 100 0) 10 10)';
                const expectedOutput = 122;
                const result = main.interprit(tipsyExpression);
                expect(result).to.eql(expectedOutput);
            });
        });
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
                consCell(
                    consCell('+',
                        consCell(firstNumber,
                            consCell(secondNumber))));

            const resultAST = main.eval(inputAST);

            expect(resultAST).to.be.eql(expectedNumber);
        });

        it('should be able to subtract one number from another', () => {
            const firstNumber = 190;
            const secondNumber = 23;
            const expectedNumber = firstNumber - secondNumber;

            const inputAST =
                consCell(
                    consCell('-',
                        consCell(firstNumber,
                            consCell(secondNumber))));

            const resultAST = main.eval(inputAST);
            expect(resultAST).to.be.eql(expectedNumber);
        });
    });
});
