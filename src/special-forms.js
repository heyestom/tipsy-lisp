export const specialForms = {
    'if': (parser, AST) => {
        const check = typeof AST.first === 'object' ? parser.eval({
            first: AST.first
        }) : AST.first;
        if (check) {
            return typeof AST.rest.first === 'object' ?
                parser.eval(AST.rest.first) :
                AST.rest.first;
        } else {
            if (AST.rest.rest === null) return null;
            return typeof AST.rest.rest.first === 'object' ?
                parser.eval(AST.rest.rest.first) :
                AST.rest.rest.first;
        };
    }
};
