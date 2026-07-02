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
      customStyle={{
        margin: 0,
        borderRadius: "0",
        fontSize: "0.875rem",
        lineHeight: 1.5,
      }}
    >
      {code ?? ""}
    </SyntaxHighlighter>
  )
}