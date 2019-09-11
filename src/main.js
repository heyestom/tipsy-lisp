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
    eval(inputAST){
        return inputAST.first;

    },
    printAST(AST, depth) {
        const printDepth = (value, depth) => {
            const depthString = "==";
            if (depth > 0) {
                console.log(depthString.repeat(depth) + '> ' + value);
            }
        };

        depth = depth? depth : 0;

        if (AST === null || AST.first === null) {
            return;
        } else if (typeof(AST.first) === 'object') {
            depth++;
            this.printAST(AST.first, depth);
            this.printAST(AST.rest, depth);
        } else {
            printDepth(AST.first, depth);
            this.printAST(AST.rest, depth);
        }
    }
};

module.exports = parser;

