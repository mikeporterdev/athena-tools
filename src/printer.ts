import {Profile} from "./types";
import {createReadStream} from "fs";
import FormData from 'form-data';
import { basename } from "path";
import fetch from 'node-fetch';
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

export async function uploadCleanedFile(printerIp: string, path: string, profileId: number): Promise<void> {
    const url = `http://${printerIp}/${PRINTER_UPLOAD_PATH}`;

    const formData = new FormData();

    formData.append('ZipFile', createReadStream(path));
    formData.append('ProfileId', profileId);
    formData.append('Path', basename(path).replace(".nanodlp", ""));
    formData.append('AutoCenter', 0);
    formData.append('Offset', 0.00);
    formData.append('LowQualityLayerNumber', 0);
    formData.append('MaskEffect', 0.00);
    formData.append('ImageRotate', 0);

    await fetch(url, {
        method: 'POST',
        body: formData,  // The FormData instance
        headers: formData.getHeaders(),
    });

    console.log('Uploaded file to printer')
}