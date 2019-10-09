export const functions = {
    '/': (...args) => args.length === 1 ? 1 / args[0] : args.reduce((total, current) => (total / current)),
    '*': (...args) => args.reduce((total, current) => (total * current)),
    '+': (...args) => args.reduce((total, current) => (total + current)),
    '-': (...args) => args.length === 1 ? 0 - args[0] : args.reduce((total, current) => (total - current)),
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
