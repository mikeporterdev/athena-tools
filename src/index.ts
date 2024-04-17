import { program } from "commander";
import {getPrinterProfiles, uploadCleanedFile} from "./printer";
import select from "@inquirer/select";
import inquirer from "inquirer";
import { input } from "@inquirer/prompts";
import {updateFile} from "./zipper";

program
    .version('1.0.0')
    .description('A script for fixing nanodlp files made with lychee');

program
    .command('fix <pathToLycheeNanoDlp>')
    .description('Fixes a lychee created nanodlp file to run on the athena')
    .option('--profileId <profileId>', 'The ID of the Profile from NanoDLP')
    .option('--hostName <hostName>', 'The IP address or hostname of the printer, do not include http')
    .action(async (pathToLycheeNanoDlp, options) => {

        console.log(`Running fixer on ${pathToLycheeNanoDlp}`);

        const { profileId, hostName } = options;

        const selectedHostName = hostName ? hostName : await input({ message: 'Enter your printer IP address, eg. enterprising-senna.local or 192.168.0.1, (do not include http): '})

        let profiles = await getPrinterProfiles(selectedHostName);

        const selectedProfileId = profileId ? profileId : await select({
            message: 'Please choose a profile:',
            choices: profiles.map(profile => {
                return {
                    name: profile.Title,
                    value: profile.ProfileID
                }
            })
        })

        const selectedProfile = profiles.find(profile => profile.ProfileID == selectedProfileId);

        if (!selectedProfile) {
            throw new Error("Something went wrong with profile selection, @Kitari on Discord and ask wtf")
        }

        console.log(`Selected profile ${selectedProfile.Title}`)

        console.log(`Editing nanodlp ${pathToLycheeNanoDlp}`)
        await updateFile(pathToLycheeNanoDlp, selectedProfile)
        console.log(`NanoDLP successfully cleaned and ready for upload`)
        console.log('Uploading file')
        await uploadCleanedFile(selectedHostName, pathToLycheeNanoDlp, selectedProfile.ProfileID)
    });

program.parse(process.argv)