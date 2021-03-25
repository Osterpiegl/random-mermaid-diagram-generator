import { v4 as uuidv4 } from "uuid";
const { execSync } = require("child_process");
const fs = require("fs")

// Save MMD strings to files

export function saveMMDtoFile(mmdString: string, mmdOutDir: string): string {
    const fileName: string = uuidv4()
    fs.writeFileSync(`${mmdOutDir}/${fileName}.mmd`, mmdString)
    return fileName
}

export function saveMMDstoFiles(diagrams: string[], mmdOutDir: string): string[] {
    console.log("Saving MMD-Strings to MMD files . . .")

    let mmdFileNames: string[] = []
    diagrams.forEach(diagram => {
        let filename: string = saveMMDtoFile(diagram, mmdOutDir)
        mmdFileNames.push(filename)
    });

    console.log("\tFinished")

    return mmdFileNames
}

// Convert MMD files to PNG files

export function convertMMDtoPNG(mmdFileName: string, mmdOutDir: string, pngOutDir: string) {
    execSync(`mmdc -i ${mmdOutDir}/${mmdFileName}.mmd -o ${pngOutDir}/${mmdFileName}.png`)
}

export function convertMMDstoPNGs(mmdOutDir: string, pngOutDir: string, mmdFileNames: string[] = []){
    console.log("Converting MMD files to PNG files . . .")

    if(mmdFileNames.length == 0){
        mmdFileNames = getMMDFilenames(mmdOutDir)   // Slower than if passed as arguments to the function
    }
    
    mmdFileNames.forEach(mmdFileName => {
        convertMMDtoPNG(mmdFileName, mmdOutDir, pngOutDir)
    })

    console.log("\tFinished")
}

// Utility
export function createOutputDirs(): string {
    console.log("Creating output directories . . .")

    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let hours = date.getHours()
    let minutes = date.getMinutes()
    let seconds = date.getSeconds()
    let dirname = "generated/" + day + "." + month + "." + year + "_" + hours + ":" + minutes + ":" + seconds

    fs.mkdirSync(dirname, (err: any) => { if (err) return console.error(err); });
    fs.mkdirSync(`${dirname}/md`, (err: any) => { if (err) return console.error(err); });
    fs.mkdirSync(`${dirname}/png`, (err: any) => { if (err) return console.error(err); });

    console.log("\tFinished")

    return dirname
}

export function getMMDFilenames(mmdOutDir: string): string[]{
    const mmdFileNames = fs.readdirSync(mmdOutDir);
    return mmdFileNames
}