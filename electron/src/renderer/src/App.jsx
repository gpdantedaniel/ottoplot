import { useState, useEffect} from 'react'

import { Button } from '@/components/ui/button'
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { FileSignature, SquareFunction, Upload } from "lucide-react"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"

import { Input } from "@/components/ui/input"

import Plot from 'react-plotly.js';

function App() {
  const [generationPrompt, setGenerationPrompt] = useState("");
  const [plotData, setPlotData] = useState(null)

  /*
  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    console.log(file);
    if (!file) { return }

    // console.log("Name:", file.name);
    // console.log("Size:", file.size);
    // console.log("Type:", file.type);

    const arrayBuffer = await file.arrayBuffer();

    await window.api.uploadFile({
      name: file.name,
      buffer: Array.from(new Uint8Array(arrayBuffer))
    });
  };
  */

  const handleSelectFile = async () => {
    const result = await window.api.selectDataFile();
    if (!result) { return; }
    console.log(result);
  };


  const generateFunction = async () => {
    const modelOutput = await window.api.generateFunction(generationPrompt)
    console.log('model_output:', modelOutput);

    // Assuming that it is well formatted..
    setPlotData(JSON.parse(modelOutput.stdout))
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="border-b border-l py-4 px-8 font-bold flex flex-row gap-2 items-center">
        <SquareFunction size={28}/>
        <h1 className="text-xl">
          FUNCTION DESIGN
        </h1>
      </div>
      <div className="flex-1 flex flex-row">
        <div className="flex-1 p-8 border-l flex flex-col items-start gap-3">
          <h2 className="text-lg">DESIGN AREA</h2>

          <Field className="flex flex-col items-start">
            <FieldLabel>
              Upload Data
            </FieldLabel>

            <Button type="button" onClick={handleSelectFile}>
              <Upload/>
              Select File
            </Button>

            <FieldDescription>
              Select a CSV, JSON, or Excel file
            </FieldDescription>
          </Field>

          <Field>
            <FieldLabel htmlFor="textarea-message">Function Generation</FieldLabel>
            <FieldDescription>Described the inputs, operations and outputs of your function.</FieldDescription>
            <Textarea 
              id="textarea-message" 
              placeholder="Type your prompt here."
              onChange={(e) => setGenerationPrompt(e.target.value)}
            />
          </Field>

          <Button onClick={generateFunction}>Generate</Button>
        </div>
        <div className="flex-2 p-8 border-l flex flex-col gap-3">
            <ResizablePanelGroup orientation="vertical">
              <ResizablePanel defaultSize="75%">

                <div className="flex-1 flex flex-col items-start gap-3 py-4">
                  <h2 className="text-lg">OUTPUT</h2>
                  { plotData ? (
                      <Plot
                        data={plotData.data}
                        layout={{
                          ...plotData.layout,
                          autosize: true,
                          responsive: true,

                        }}
                        useResizeHandler
                        style={{
                          width: "100%",
                          height: "100%",
                        }}
                        config={FileSignature.config}
                        className="h-full flex-1 h-[800px]"
                      />
                    ) : (
                      <div>
                        Awaiting data...
                      </div>
                    )
                  }
                </div>


              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize="25%">

                <div className="flex-1 flex flex-col items-start gap-3 py-4">
                  <h2 className="text-lg">DEBUGGING</h2>
                </div>
                
              </ResizablePanel>
            </ResizablePanelGroup>

      </div>
      </div>
    </div>
  )
}

export default App
