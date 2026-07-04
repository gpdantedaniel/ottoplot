import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter"
import python from "react-syntax-highlighter/dist/esm/languages/prism/python"
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism"

SyntaxHighlighter.registerLanguage("python", python)

export const PythonCodeBlock = ({ code }) => {
  return (
    <SyntaxHighlighter
      language="python"
      style={atomDark}
      showLineNumbers
      wrapLongLines={false}
      className="text-sm"
      customStyle={{
        background: "transparent"
      }}
    >
      {code ?? ""}
    </SyntaxHighlighter>
  )
}