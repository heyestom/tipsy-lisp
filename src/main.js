const functions = {
    '/': (...args) => args.reduce((total, current) => (total / current)),
    '*': (...args) => args.reduce((total, current) => (total * current)),
    '+': (...args) => args.reduce((total, current) => (total + current)),
    '-': (...args) => args.reduce((total, current) => (total - current))
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
        console.log(inputAST);

        // nested lists 
        if (typeof inputAST.first === 'object' && inputAST.first !== null) {
            if (inputAST.rest !== null) {
                return [this.eval(inputAST.first), this.eval(inputAST.rest)];
            }
            return this.eval(inputAST.first);
        }

        // check functions
        if (functions[inputAST.first]) {
            const functionToCall = functions[inputAST.first];
            console.log('Found function ', inputAST.first);

            const restEvalueation = this.eval(inputAST.rest);
            console.log('Calling function:', inputAST.first, 'with args ', restEvalueation);

            const functionCallRestult = functionToCall(...restEvalueation);
            console.log('Returning value', functionCallRestult);

            return functionCallRestult;
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
