import { useState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

import { Upload } from "lucide-react"

import { CsvTableViewer } from "@/components/csv-table-viewer"
import { PythonCodeBlock } from "@/components/python-code-block"
import { FigurePreview } from "@/components/figure-preview"
import { LogMessage } from "@/components/log-message"

export function WorkspacesScreen({ isActive }) {
  const [generationPrompt, setGenerationPrompt] = useState("")
  const [executionOutput, setExecutionOutput] = useState(null)
  const [images, setImages] = useState([])
  const [tablesRefreshKey, setTablesRefreshKey] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleSelectFile = async () => {
    const result = await window.api.selectDataFile()

    if (!result) {
      return
    }

    console.log(result)
  }

  const refreshGeneratedArtifacts = async () => {
    const currentImages = await window.api.listImages()

    setImages(currentImages ?? [])
    setTablesRefreshKey((value) => value + 1)
  }

  useEffect(() => {
    refreshGeneratedArtifacts()
  }, [])

  const generateFunction = async () => {
    try {
      setIsGenerating(true)

      const result = await window.api.generateFunction(generationPrompt)

      setExecutionOutput(result)

      console.log(result)

      await refreshGeneratedArtifacts()
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <section
      className={
        isActive
          ? "flex h-full min-w-0 flex-1 flex-row"
          : "hidden"
      }
    >
      <div className="flex border-r border-zinc-200 bg-zinc-50 px-8 py-8 text-zinc-800">
        <p>Workspaces</p>
      </div>

      <div className="flex min-w-0 flex-1 flex-row">
        <div className="flex flex-1 flex-col items-start gap-3 border-r border-zinc-200 bg-white p-8 text-zinc-900">
          <Field className="flex flex-col items-start">
            <FieldLabel>
              Upload Data
            </FieldLabel>

            <Button type="button" onClick={handleSelectFile}>
              <Upload />
              Select File
            </Button>

            <FieldDescription>
              Supported files endings: TO BE SPECIFIED
            </FieldDescription>
          </Field>

          <Field>
            <FieldLabel htmlFor="textarea-message">
              Function Generation
            </FieldLabel>

            <FieldDescription>
              Describe the inputs, operations and outputs of your function.
            </FieldDescription>

            <Textarea
              id="textarea-message"
              placeholder="Type your prompt here."
              value={generationPrompt}
              onChange={(event) => setGenerationPrompt(event.target.value)}
            />
          </Field>

          <Button
            onClick={generateFunction}
            disabled={isGenerating || !generationPrompt.trim()}
          >
            {isGenerating ? "Generating..." : "Generate"}
          </Button>
        </div>

        <div className="flex h-screen min-h-0 flex-[3] flex-col bg-zinc-900 p-8 text-zinc-100">
          <Tabs defaultValue="results" className="flex min-h-0 flex-col gap-4">
            <TabsList variant="line" className="shrink-0 px-0">
              <TabsTrigger value="results" className="text-lg">
                RESULTS
              </TabsTrigger>

              <TabsTrigger value="graphs" className="text-lg">
                GRAPHS
              </TabsTrigger>

              <TabsTrigger value="tables" className="text-lg">
                TABLES
              </TabsTrigger>

              <TabsTrigger value="code" className="text-lg">
                CODE
              </TabsTrigger>
            </TabsList>

            <div className="thin-white-scrollbar min-h-0 flex-1 overflow-hidden overflow-y-auto text-base">
              <TabsContent value="results" className="text-base">
                {executionOutput ? (
                  <div>
                    {executionOutput.stdout.split("\n").map((line, index) => (
                      <p key={index}>&gt; {line}</p>
                    ))}
                  </div>
                ) : (
                  <LogMessage>awaiting results</LogMessage>
                )}
              </TabsContent>

              <TabsContent value="graphs" className="text-base">
                {executionOutput ? (
                  <>
                    {images.map((image) => (
                      <div key={image.id}>
                        <div className="pb-2">
                          &gt; {image.name}
                        </div>

                        <FigurePreview
                          src={image.url}
                          alt={image.name}
                          width="500px"
                        />
                      </div>
                    ))}
                  </>
                ) : (
                  <LogMessage>awaiting graphs</LogMessage>
                )}
              </TabsContent>

              <TabsContent value="tables" className="text-base">
                <CsvTableViewer refreshKey={tablesRefreshKey} />
              </TabsContent>

              <TabsContent value="code" className="text-base">
                {executionOutput ? (
                  <PythonCodeBlock code={executionOutput.code} />
                ) : (
                  <LogMessage>awaiting code</LogMessage>
                )}
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </section>
  )
}