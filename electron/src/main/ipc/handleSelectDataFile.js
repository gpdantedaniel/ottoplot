import { dialog } from 'electron';
import * as fs from 'node:fs'
import path from 'path'

export const handleSelectDataFile = async () => {
    const result = await dialog.showOpenDialog({
        title: "Select Data File",
        properties: ["openFile"],
        filters: [{
        name: "Data Files",
        extensions: ["csv", "json", "xlsx"]
        }]
    });

    if (result.canceled) { return null }

    const sourcePath = result.filePaths[0];
    const destination = path.join("../workspace", "inputs", path.basename(sourcePath));

    fs.copyFileSync(sourcePath, destination);

    return {
        fileName: path.basename(sourcePath),
        workspacePath: destination
    }; 
}