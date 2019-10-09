const {functions: functions} = require('./core-functions');

const specialForms = {
    'if': (AST) => {
        const check = typeof AST.first === 'object' ? parser.eval({
            first: AST.first
        }) : AST.first;
        if (check) {
            return typeof AST.rest.first === 'object' ?
                parser.eval(AST.rest.first) :
                AST.rest.first;
        } else {
            if(AST.rest.rest === null) return null;
            return typeof AST.rest.rest.first === 'object' ?
                parser.eval(AST.rest.rest.first) :
                AST.rest.rest.first;
        };
    }
};

const parser = {
    tokenise(lisp_string) {
        const openParenRegex = /\(/g;
        const closeParenRegex = /\)/g;
        return lisp_string
            .replace(openParenRegex, ' ( ')
            .replace(closeParenRegex, ' ) ')
            .split(" ")
            .filter(token => token.trim() !== "");
    },
    castAtom(atom) {
        if (atom === 'false') {
            return false;
        } else if (atom === 'true') {
            return true;
        } else if (atom === '0') {
            return 0;
        }
        return Number(atom) || atom;
    },
    buildAST(tokens) {
        const consCell = (first, rest) => {
            return {
                first: first,
                rest: rest
            };
        };

        if (tokens.length > 0) {
            //mutates array, yuck... SUPER YUCK
            const token = tokens.shift();

            if (token === ')') {
                return null;
            }
            if (token === '(') {
                // tokens is mutating between recursive calls and its icky :(
                const first = this.buildAST(tokens);
                const rest = this.buildAST(tokens);
                return consCell(first, rest);
            }
            return consCell(this.castAtom(token),
                this.buildAST(tokens));
        } else {
            return null;
        }
    },
    eval(inputAST) {
        if (!inputAST) return null;
        // list - make a function call to the first element with the rest  
        if (typeof inputAST.first === 'object' && inputAST.first !== null) {
            let evaluatedList = this.eval(inputAST.first);
            let restEvalueation;
            if (inputAST.rest !== null) {
                restEvalueation = this.eval(inputAST.rest);
                if (restEvalueation !== null && !Array.isArray(restEvalueation)) {
                    restEvalueation = [restEvalueation];
                }
            }
            // more mutation :/
            if (Array.isArray(evaluatedList)) {

                const functionToCall = evaluatedList.shift();
                return restEvalueation ? [functionToCall(...evaluatedList), ...restEvalueation] :
                    functionToCall(...evaluatedList);
            } else {
                return restEvalueation ? [evaluatedList, ...restEvalueation] : evaluatedList;
            }
        }

        if (specialForms[inputAST.first]) {
            const specialForm = specialForms[inputAST.first];

            let specialFormResult = specialForm(inputAST.rest);

            return specialFormResult;
        }

        // check functions
        if (functions[inputAST.first]) {
            const functionToCall = functions[inputAST.first];
            const restEvalueation = this.eval(inputAST.rest);

            let list;
            if (Array.isArray(restEvalueation)) {
                list = [functionToCall, ...restEvalueation];
            } else {
                list = [functionToCall, restEvalueation];
            }
            return list;
        }

        if (inputAST.rest) {
            const restEvalueation = this.eval(inputAST.rest);

            let list;
            if (Array.isArray(restEvalueation)) {
                list = [inputAST.first, ...restEvalueation];
            } else {
                list = [inputAST.first, restEvalueation];
            }

            return list;
        }

        // constants
        return inputAST.first;
    },
    interprit(tipsyExpression) {
        const tokenisedExpresion = this.tokenise(tipsyExpression);
        const AST = this.buildAST(tokenisedExpresion);
        const output = this.eval(AST);
        return output;
    }
};

module.exports = parser;
