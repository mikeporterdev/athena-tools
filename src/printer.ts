import {Profile} from "./types";

const PRINTER_PROFILES_PATH = 'json/db/profiles.json'

export async function getPrinterProfiles(printerIp: string) {
    console.log('Fetching profiles from printer ');
    const profilesJson = await fetch(`http://${printerIp}/${PRINTER_PROFILES_PATH}`);

    const profiles: Profile[] = JSON.parse(await profilesJson.text());

    console.log(`Found ${profiles.length} profiles to choose from`)

    return profiles;
    
}