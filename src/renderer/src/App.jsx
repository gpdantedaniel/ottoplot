import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

function App() {
  const ipcHandle = () => window.electron.ipcRenderer.send('ping')

  return (
    <div className="w-full h-full flex flex-col">
      <div className="border-b border-l py-4 px-8 font-bold">
        <h1 className="text-xl">
          PIPE DESIGN
        </h1>
      </div>
      <div className="flex-1 flex flex-row">
        <div className="flex-1 p-8 border-l flex flex-col items-start gap-3">
          <h2 className="text-lg">DATA UPLOAD</h2>
          <Separator/>
          <h2 className="text-lg">DESIGN AREA</h2>
          <Separator/>
          
          <p>Some regular Geist text</p>
          <Textarea placeholder="Type your message here."/>
          <Button>Generate</Button>
        </div>
        <div className="flex-2 p-8 border-l flex flex-col items-start">
          <h2 className="text-lg">OUTPUT</h2>
          <Separator/>
          <Button>Generic Button</Button>

          <Card className="relative w-sm  pt-0">
            <img
              src="https://avatar.vercel.sh/shadcn1"
              alt="Event cover"
              className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
            />
            <CardHeader>
              <CardAction>
                <Badge variant="secondary">Featured</Badge>
              </CardAction>
              <CardTitle>Design systems meetup</CardTitle>
              <CardDescription>
                A practical talk on component APIs, accessibility, and shipping
                faster.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button className="w-full">View Event</Button>
            </CardFooter>
          </Card>
        
        </div>
      </div>
      
      
    </div>
  )
}

export default App
