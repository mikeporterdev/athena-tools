import { readFile, writeFile } from "fs/promises";
import JSZip from 'jszip'
import {Profile} from "./types";

export async function updateFile(path: string, newProfileContent: Profile): Promise<void> {
    const data = await readFile(path);
    const zip = await JSZip.loadAsync(data)

    if (zip.files['override.json']) {
        zip.remove('override.json')
    }


    zip.file('profile.json', JSON.stringify(newProfileContent));

    const modifiedZipData = await zip.generateAsync({ type: 'nodebuffer'})
    await writeFile(path, modifiedZipData)
}