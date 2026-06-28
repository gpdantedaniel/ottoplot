import { useState, useEffect} from 'react'

import { Button } from '@/components/ui/button'
import { Textarea } from "@/components/ui/textarea"
import { FileSignature, SquareFunction, Upload } from "lucide-react"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"

import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

import { CsvTableViewer } from './components/csv-table-viewer'

function App() {
  const [generationPrompt, setGenerationPrompt] = useState("");
  const [executionOutput, setExecutionOutput] = useState(null)
  const [images, setImages] = useState([]);
  const [tablesRefreshKey, setTablesRefreshKey] = useState(0)

  const handleSelectFile = async () => {
    const result = await window.api.selectDataFile();
    if (!result) { return; }
    console.log(result);
  };

  const refreshGeneratedArtifacts = async () => {
    const currentImages = await window.api.listImages()
    setImages(currentImages ?? [])
    setTablesRefreshKey((value) => value + 1)
  }

  useEffect(() => {
    refreshGeneratedArtifacts()
  }, [])

  console.log(images)

  const generateFunction = async () => {

    const result = await window.api.generateFunction(generationPrompt)
    setExecutionOutput(result);

    console.log(result);
    console.log(result.stdout.split("\n"))

    result.stdout.split("\n").forEach((line, index) => {
      console.log(line, index)
    })

    await refreshGeneratedArtifacts()
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
                            <div key={image.id}>
                              <img
                                src={image.url}
                                alt={image.name}
                                width={"600px"}
                              />
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

                  <h2 className="text-lg">TABLES</h2>

                  <CsvTableViewer refreshKey={tablesRefreshKey} />

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
