const functions = {
    '/': (...args) => args.length === 1 ? 1 / args[0] : args.reduce((total, current) => (total / current)),
    '*': (...args) => args.reduce((total, current) => (total * current)),
    '+': (...args) => args.reduce((total, current) => (total + current)),
    '-': (...args) => {
        console.log(args);
        return args.length === 1 ? 0 - args[0] : args.reduce((total, current) => (total - current));
    },
    '>': (...args) => {
        let cond = true;
        args.reduce((x, y) => {
            if (!(x > y)) {
                cond = false;
            }
            return y;
        });
        return cond;
    }
};

const specialForms = {
    'if': (AST) => {
        console.log('IF:');
        console.log(AST);
        const check = typeof AST.first === 'object' ? parser.eval({
            first: AST.first
        }) : AST.first;
        console.log('check');
        console.log(check);
        if (check) {
            console.log('true case');
            return typeof AST.rest.first === 'object' ?
                parser.eval(AST.rest.first) :
                AST.rest.first;
        } else {
            console.log('false case');
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
        console.log('EVAL');
        console.log(inputAST);

        if (!inputAST) return null;
        // list - make a function call to the first element with the rest  
        if (typeof inputAST.first === 'object' && inputAST.first !== null) {
            console.log('Found list:');
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
            console.log('Found special form', inputAST.first);
            console.log(specialForm);

            let specialFormResult = specialForm(inputAST.rest);

            console.log('Returning special form value', specialFormResult);
            return specialFormResult;
        }

        // check functions
        if (functions[inputAST.first]) {
            const functionToCall = functions[inputAST.first];
            console.log('Found function ', inputAST.first);
            const restEvalueation = this.eval(inputAST.rest);

            let list;
            if (Array.isArray(restEvalueation)) {
                list = [functionToCall, ...restEvalueation];
            } else {
                list = [functionToCall, restEvalueation];
            }
            console.log('returning list :', list);
            return list;
        }

        if (inputAST.rest) {
            console.log('Found value: ', inputAST.first);
            const restEvalueation = this.eval(inputAST.rest);
            console.log(restEvalueation);

            let list;
            if (Array.isArray(restEvalueation)) {
                list = [inputAST.first, ...restEvalueation];
            } else {
                list = [inputAST.first, restEvalueation];
            }

            console.log('returning list', list);
            return list;
        }

        // constants
        console.log('Found constant ', inputAST.first);
        return inputAST.first;
    },
    interprit(tipsyExpression) {
        console.log(tipsyExpression);

        const tokenisedExpresion = this.tokenise(tipsyExpression);
        console.log('Tokens: ');
        console.log(tokenisedExpresion);

        const AST = this.buildAST(tokenisedExpresion);
        console.log('AST: ');
        console.log(AST);

        const output = this.eval(AST);
        console.log('Output: ');
        console.log(output);

        return output;
    }
};

module.exports = parser;
