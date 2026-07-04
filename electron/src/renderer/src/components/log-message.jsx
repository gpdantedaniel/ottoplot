export function LogMessage({ children }) {
  return (
    <p>
      &gt; {children} &nbsp;
      <span className="terminal-cursor">_</span>
    </p>
  );
}