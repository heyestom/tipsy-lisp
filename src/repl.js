const readline = require('readline');
const tipsy = require('./main');

const readlineInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const repl = () => {
    readlineInterface.question('tipsy: ~> ', (answer) => {
        if (answer === 'exit') {
            console.log('Goodbye!');
            readlineInterface.close();
        } else {
            const result = tipsy.interprit(answer);
            console.log(result);
            repl();
        }
    });
};
console.log('Welcome to tipsy!');
repl();
