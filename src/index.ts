import { program } from "commander";

program
    .version('1.0.0')
    .description('A script for fixing nanodlp files made with lychee');

program
    .command('fix <pathToLycheeNanoDlp>')
    .description('Fixes a lychee created nanodlp file to run on the athena')
    .action((pathToLycheeNanoDlp) => {
        console.log(pathToLycheeNanoDlp);
    });

program.parse(process.argv)