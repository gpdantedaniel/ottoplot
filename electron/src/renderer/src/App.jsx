import { useState, useEffect} from 'react'

import { Button } from '@/components/ui/button'
import { Textarea } from "@/components/ui/textarea"
import { FileSignature, SquareFunction, Upload } from "lucide-react"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"

import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

function App() {
  const [generationPrompt, setGenerationPrompt] = useState("");
  const [executionOutput, setExecutionOutput] = useState(null)
  const [images, setImages] = useState([]);

  const handleSelectFile = async () => {
    const result = await window.api.selectDataFile();
    if (!result) { return; }
    console.log(result);
  };

  useEffect(() => {
    window.api.listImages().then(setImages);
  }, []);

  console.log(images)

  const generateFunction = async () => {

    const result = await window.api.generateFunction(generationPrompt)
    setExecutionOutput(result);

    console.log(result);
    console.log(result.stdout.split("\n"))

    result.stdout.split("\n").forEach((line, index) => {
      console.log(line, index)
    })

    // Assuming that it is well formatted..
    // setPlotData(JSON.parse(modelOutput.stdout))
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
              Supported files endings: TO BE SPECIFIED
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
              <ResizablePanel defaultSize="60%">

                <div className="flex-1 flex flex-col items-start gap-3 py-4">
                  <h2 className="text-lg">PLOTTING</h2>
                  { executionOutput ? (
                    <>
                      <p>
                        Execution successful!
                        
                      </p>

                      <div>
                          {images.map((image) => (
                            <div key={image.path}>
                              <img
                                src={`file://${image.path}`}
                                alt={image.name}
                                style={{
                                  width: "200px",
                                  height: "200px",
                                  objectFit: "cover",
                                }}
                              />
                              <p>{image.name}</p>
                            </div>
                          ))}
                        </div>
                        </>
                      /*
                      <Plot
                        data={JSON.parse(executionOutput.artifacts[0].payload)}
                        layout={{
                          ...JSON.parse(executionOutput.artifacts[0].payload).layout,
                          autosize: true,
                          responsive: true,

                        }}
                        useResizeHandler
                        style={{
                          width: "100%",
                          height: "100%",
                        }}
                        className="h-full flex-1 h-[800px]"
                      />
                      */
                    ) : (
                      <div>
                        &gt; Awaiting plots...
                      </div>

                    )
                  }

                </div>
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize="40%">

                <div className="flex-1 flex flex-col items-start gap-3 py-4">
                  <h2 className="text-lg">LOGS</h2>
                  
                  { executionOutput ? (
                    <div>
                      {executionOutput.stdout.split("\n").map((line, index) => (
                        <p key={index}>&gt; {line}</p>
                      ))}
                    </div>
                  ) : (
                    <p>&gt; Awaiting logs...</p>
                  )}
                  


                </div>
                
              </ResizablePanel>
            </ResizablePanelGroup>

      </div>
      </div>
    </div>
  )
}

export default App
