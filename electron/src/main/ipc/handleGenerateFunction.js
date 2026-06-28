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
import pandas as pd
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
plt.savefig('./outputs/another_plot.png', bbox_inches='tight', dpi=300)
plt.savefig('./outputs/and_another_one.png', bbox_inches='tight', dpi=300)

plt.close()

print("Graph successfully saved to /output/my_plot.png")
print("Other diagnostics and whatnot")

df = pd.read_csv("./inputs/ph175_data.csv")
df.to_csv("./outputs/mock_data.csv", index=False)

df = pd.read_csv("./inputs/ph176_data.csv")
df.to_csv("./outputs/more_mock_data.csv", index=False)
`
