import * as fs from 'node:fs'
import path from 'path'
import { executeGeneration } from '../services/executeGeneration';
import { executePython } from '../services/executePython';

export const handleGenerateFunction= async(event, prompt) => {
  console.log('Received prompt:', prompt);
  console.log('Querying model...');

  // Keep this around for testing purposes
  const code = `import plotly.graph_objects as go

fig = go.Figure(
    data=[
        go.Scatter(
            x=[1, 2, 3],
            y=[10, 20, 15],
            mode="lines+markers"
        )
    ]
)

graph_json = fig.to_json()
print(graph_json)`

  console.log("code:", code)

  const inputDirectory = path.join("../workspace", "inputs");
  const inputFiles = await fs.promises.readdir(inputDirectory);

  console.log("inputFiles:", inputFiles)

  const result = await executePython(code)

  console.log("Execution result:", result);
  return result
}