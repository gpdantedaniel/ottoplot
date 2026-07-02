import { useState, useEffect} from 'react'

import { Button } from '@/components/ui/button'
import { Textarea } from "@/components/ui/textarea"
import { Bot, FileSignature, Folder, Settings, SquareFunction, Upload } from "lucide-react"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

import { CsvTableViewer } from './components/csv-table-viewer'
import { PythonCodeBlock } from './components/python-code-block'
import { FigurePreview } from './components/figure-preview'

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
    <div className="w-full h-full flex flex-row">
      <div className="flex py-4 px-4 flex flex-col gap-4">
        <Folder size={28}/>
        <Separator/>
        <Bot size={28}/>
        <Separator/>
        <Settings size={28}/>
      </div>
      <div className="flex border-l py-8 px-8">
        <p>Workspaces</p>
      </div>
  
        <div className="flex-1 flex flex-row">
          <div className="flex-1 p-8 border-l flex flex-col items-start gap-3">
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
          <div className="flex-3 p-8 border-l flex flex-col gap-3 bg-zinc-900 text-white overflow-y-scroll overflow-hidden">
            <Tabs defaultValue="results" className="flex flex-col gap-4">
              
              <TabsList variant="line" className="shrink-0 px-0 border-white">
                <TabsTrigger value="results" className="text-lg">RESULTS</TabsTrigger>
                <TabsTrigger value="graphs" className="text-lg">GRAPHS</TabsTrigger>
                <TabsTrigger value="tables" className="text-lg">TABLES</TabsTrigger>
                <TabsTrigger value="code" className="text-lg">CODE</TabsTrigger>

            

              </TabsList>
                <TabsContent value="results" className="mt-0 flex-1 min-h-0 overflow-y-auto data-[state=inactive]:hidden">
                    <div>
                    { executionOutput ? (
                      <div className="text-base">
                        {executionOutput.stdout.split("\n").map((line, index) => (
                          <p key={index}>&gt; {line}</p>
                        ))}
                      </div>
                    ) : (
                      <p>&gt; Awaiting logs...</p>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="graphs" className="mt-0 h-fit">
                  { executionOutput ? (
                      <div>
                        {images.map((image) => (
                          <div key={image.id}>
                            <FigurePreview
                              src={image.url}
                              alt={image.name}
                              width={"500px"}
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div>
                        &gt; Awaiting plots...
                      </div>

                    )
                  }

                </TabsContent>

                <TabsContent value="tables">
                  <CsvTableViewer refreshKey={tablesRefreshKey} />
                </TabsContent>

                <TabsContent value="code">
                  { executionOutput ? (
                    <>
                    <PythonCodeBlock code={executionOutput.code} />
                    <PythonCodeBlock code={executionOutput.code} />
                    </>
                  ) : (
                    <></>
                  )}
                </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
  )
}

export default App
