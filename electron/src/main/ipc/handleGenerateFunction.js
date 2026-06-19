import * as fs from 'node:fs'
import path from 'path'
import { executeGeneration } from '../services/executeGeneration';
import { executePython } from '../services/executePython';

export const handleGenerateFunction= async(event, prompt) => {
  // Keep this around for testing purposes
  const code = await executeGeneration(prompt)

  console.log("Generated code: ", code)

  const inputDirectory = path.join("../workspace", "inputs");
  const inputFiles = await fs.promises.readdir(inputDirectory);

  console.log("inputFiles:", inputFiles)

  const result = await executePython(code)

  console.log("Execution result:", result);
  return result
}