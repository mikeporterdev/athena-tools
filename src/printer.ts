import {Profile} from "./types";
import * as fs from "fs";
import FormData from 'form-data';
import {readFile} from "fs/promises";

const PRINTER_PROFILES_PATH = 'json/db/profiles.json'
const PRINTER_UPLOAD_PATH = 'plate/add'

export async function getPrinterProfiles(printerIp: string) {
    console.log('Fetching profiles from printer ');
    const url = `http://${printerIp}/${PRINTER_PROFILES_PATH}`;
    const profilesJson = await fetch(url);

    const profiles: Profile[] = JSON.parse(await profilesJson.text());

    console.log(`Found ${profiles.length} profiles to choose from`)

    return profiles;
    
}



export async function uploadCleanedFile(printerIp: string, path: string): Promise<void> {
    const url = `http://${printerIp}/${PRINTER_UPLOAD_PATH}`;

    const formData: any = new FormData();

    const fileBuffer = await readFile(path);
    formData.append('ZipFile', fileBuffer, { filename: 'test.nanodlp' });

    const headers = formData.getHeaders()

    await fetch(url, {
        method: 'POST',
        body: formData,
        headers: headers, // Convert headers to a plain object
    });

    console.log('Uploaded file to printer')
}