import * as fs from 'node:fs'
import path from 'path'
import { executeGeneration } from '../services/executeGeneration';
import { executePython } from '../services/executePython';

export const handleGenerateFunction= async(event, prompt) => {
  // const code = await executeGeneration(prompt)
  const code = testCode

  const inputDirectory = path.join("../workspace", "inputs");
  const inputFiles = await fs.promises.readdir(inputDirectory);

  console.log("inputFiles:", inputFiles)

  const result = await executePython(code)

  console.log("Execution result:", result);
  return result
}

const testCode = `
import os
import matplotlib.pyplot as plt

# 1. Ensure the output directory exists
os.makedirs('./outputs', exist_ok=True)

# 2. Create sample data
x = [1, 2, 3, 4, 5]
y = [2, 4, 6, 8, 10]

# 3. Build the plot
plt.figure()
plt.plot(x, y, marker='o', color='blue', label='Trend')
plt.title('Quick Sample Plot')
plt.xlabel('X Axis')
plt.ylabel('Y Axis')
plt.legend()
plt.grid(True)

plt.savefig('./outputs/my_plot.png', bbox_inches='tight', dpi=300)
plt.close()

print("Graph successfully saved to /output/my_plot.png")
print("Other diagnostics and whatnot")

`

/*
const testCode = `

import os
from pathlib import Path
import pandas as pd

workspace_dir = Path(os.getcwd())
inputs_dir = workspace_dir / "inputs"

emit("Loading CSV")

df = pd.read_csv(inputs_dir / "ph175_data.csv")

emit(f"Loaded {len(df)} rows")

import plotly.express as px

fig = px.scatter(df, x="[SA] (% w/v)", y="[CaCl2] (mM)")

emit_artifact("plotly", fig.to_json())

emit_artifact("table", {
  "columns": ["A", "B"],
  "rows": [[1, 2], [3, 4]]
})

print("Debug message")
`
*/