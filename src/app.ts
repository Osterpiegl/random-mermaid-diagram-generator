
import { stateDiagramVocab, diagramTypes } from "./vocabulary";
import * as utils from "./utils";

const outputDir: string = utils.createOutputDirs()
const mmdOutDir: string = outputDir + "/md"
const pngOutDir: string = outputDir + "/png"

const diagramType: string = diagramTypes.stateDiagram
const numDiagrams: number = 10
const numStates: number = 20
const numTransitions: number = numStates / 2
const usingStateDescriptions: Boolean = true                 // false => s1, true => s1 : s1-desc
const convertMMDtoPNG: Boolean = true

// ------------------------------- Generate State Diagrams -------------------------------

const mmdStringStateDiagrams: string[] = generateMmdStringDiagrams(diagramType, numDiagrams, numStates, numTransitions)
const mmdFileNames: string[] = utils.saveMMDstoFiles(mmdStringStateDiagrams, mmdOutDir)

if (convertMMDtoPNG) utils.convertMMDstoPNGs(mmdOutDir, pngOutDir, mmdFileNames)

// ---------------------------------------------------------------------------------------



function generateMmdStringDiagrams(diagramType: string, numDiagrams: number, numStates: number, numTransitions: number): string[] {
    console.log("Generating MMD-String-Diagrams . . .")

    let mmdStringDiagrams: string[]
    switch (diagramType) {
        case diagramTypes.stateDiagram:
            mmdStringDiagrams = generateMmdStringStateDiagrams(numDiagrams, numStates, numTransitions)
            break
        default:
            throw new Error("Invalid diagramType");
    }

    console.log("\tFinished");

    return mmdStringDiagrams
}

function generateMmdStringStateDiagrams(numDiagrams: number, numStates: number, numTransitions: number): DiagramTypes["stateDiagram"][] {
    let diagrams: DiagramTypes["stateDiagram"][] = []
    for (let i = 0; i < numDiagrams; i++) {
        diagrams.push(generateStateDiagram(numStates, numTransitions))
    }
    return diagrams
}

function generateStateDiagram(numStates: number, numTransitions: number): DiagramTypes["stateDiagram"] {
    let mmdString: string = ""
    mmdString += diagramTypes.stateDiagram + "\n"

    const stateVariables: StateDiagramVocab["state"][] = generateStateVariables(numStates)
    if (usingStateDescriptions) {
        const stateVariableDescriptions: StateVariableWithDescription[] = generateStateVariableDescriptions(stateVariables)
        mmdString += generateStateVarDescStr(stateVariableDescriptions)
    }

    mmdString += randomStateTransitions(stateVariables, numTransitions)
    return mmdString
}

function generateStateVariables(numStates: number, addStart: boolean = true, addEnd: boolean = true): StateDiagramVocab["state"][] {
    let states: StateDiagramVocab["state"][] = []
    if (addStart) {
        states.push(stateDiagramVocab.start)
    }
    if (addEnd) {
        states.push(stateDiagramVocab.end)
    }
    let missingStates = numStates - states.length
    for (let i = 0; i < missingStates; i++) {
        states.push(`${stateDiagramVocab.state}${i}`)
    }
    return states
}

function generateStateVariableDescriptions(stateVariables: StateDiagramVocab["state"][]): StateVariableWithDescription[] {
    let stateVariableDescriptions: StateVariableWithDescription[] = []
    stateVariables.forEach(stateVariable => {
        if (stateVariable != stateDiagramVocab.start && stateVariable != stateDiagramVocab.start) {
            const description = `${stateVariable}-desc`
            const stateVariableDescription: StateVariableWithDescription = {
                variable: stateVariable,
                description: description
            }
            stateVariableDescriptions.push(stateVariableDescription)
        }
    })
    return stateVariableDescriptions
}

function generateStateVarDescStr(stateVariableDescriptions: StateVariableWithDescription[]): string {
    let stateVarDescStr: string = ""
    stateVariableDescriptions.forEach(statevarDesc => {
        stateVarDescStr += `\t${statevarDesc.variable} ${stateDiagramVocab.description} ${statevarDesc.description}\n`
    })
    stateVarDescStr += "\n"
    return stateVarDescStr
}

function transitionStates(state1: StateDiagramVocab["state"], state2: StateDiagramVocab["state"], descriptionSign: StateDiagramVocab["description"] = "", description: string = ""): string {
    let t: string = state1 + " " + stateDiagramVocab.transition + " " + state2
    if (description !== "") {
        t += descriptionSign + " " + description
    }
    return t
}

function randomStateTransitions(states: StateDiagramVocab["state"][], numTransitions: number): string {
    let permutations = ""
    for (let i = 0; i < numTransitions; i++) {
        permutations += "\t"
        let randomstate1 = states[Math.floor(Math.random() * states.length)];
        let randomstate2 = states[Math.floor(Math.random() * states.length)];
        permutations += transitionStates(randomstate1, randomstate2)
        if (i != numTransitions - 1) {
            permutations += "\n"
        }
    }
    return permutations
}