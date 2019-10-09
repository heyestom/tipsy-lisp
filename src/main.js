const {functions: functions} = require('./core-functions');
const {specialForms: specialForms} = require('./special-forms');
const {buildAST: buildAST} = require('./abstract-syntax-tree-builder');

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

            let specialFormResult = specialForm(this, inputAST.rest);

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
        const AST = buildAST(tokenisedExpresion);
        const output = this.eval(AST);
        return output;
    }
};

module.exports = parser;
