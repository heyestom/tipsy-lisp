export const castAtom = (atom) => {
    if (atom === 'false') {
        return false;
    } else if (atom === 'true') {
        return true;
    } else if (atom === '0') {
        return 0;
    }
    return Number(atom) || atom;
};

export const buildAST = (tokens) => {

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
            const first = buildAST(tokens);
            const rest = buildAST(tokens);
            return consCell(first, rest);
        }
        return consCell(castAtom(token), buildAST(tokens));
    } else {
        return null;
    }
}
