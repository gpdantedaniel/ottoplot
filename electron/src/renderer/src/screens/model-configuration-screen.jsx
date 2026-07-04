export function ModelConfigurationScreen({ isActive }) {
  return (
    <section
      className={
        isActive
          ? "flex h-full min-w-0 flex-1 flex-col gap-6 bg-white p-8 text-zinc-900"
          : "hidden"
      }
    >
      <div>
        <h1 className="text-2xl font-semibold">Model Configuration</h1>
        <p className="text-sm text-zinc-500">
          Configure the LLM provider, model name, endpoint, and runtime behavior.
        </p>
      </div>
    </section>
  )
}