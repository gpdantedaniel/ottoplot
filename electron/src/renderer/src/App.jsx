import { useState, useEffect} from 'react'

import { Button } from '@/components/ui/button'
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { SquareFunction } from "lucide-react"
import {Field, FieldDescription, FieldLabel} from "@/components/ui/field"

import { Input } from "@/components/ui/input"

import Plot from 'react-plotly.js';

function App() {

  console.log(window.api);

  const [generationPrompt, setGenerationPrompt] = useState("");

  const generate = async () => {
    const model_output = await window.electron.generate(generationPrompt)
    console.log('model_output:', model_output);
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="border-b border-l py-4 px-8 font-bold flex flex-row gap-2 items-center">
        <SquareFunction size={28}/>
        <h1 className="text-xl">
          PIPE DESIGN
        </h1>
      </div>
      <div className="flex-1 flex flex-row">
        <div className="flex-1 p-8 border-l flex flex-col items-start gap-3">
          <h2 className="text-lg">DESIGN AREA</h2>

          <Field>
            <FieldLabel htmlFor="picture">Upload Data</FieldLabel>
            <Input id="picture" type="file" />
            <FieldDescription>Select a file of data to upload</FieldDescription>
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

          <Button onClick={generate}>Generate</Button>
        </div>
        <div className="flex-2 p-8 border-l flex flex-col gap-3">

            <div className="flex-1 flex flex-col items-start gap-3">
              <h2 className="text-lg">MAIN OUTPUT</h2>
            </div>
            <Separator/>
            <div className="flex-1 flex flex-col items-start gap-3">
              <h2 className="text-lg">DEBUGGING</h2>
            </div>
      </div>
      </div>
    </div>
  )
}

export default App
