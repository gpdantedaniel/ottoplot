export const FigurePreview = ({ src, alt = "Generated plot" }) => {
  return (
    <figure className="my-4 border border-white/10 bg-zinc-950/60 p-4 w-xl">
      <div className="bg-zinc-900/80 p-5 shadow-inner">
        <div className="mx-auto max-w-xl rounded-md bg-zinc-200 p-3 shadow-xl ring-1 ring-black/30">
          <img
            src={src}
            alt={alt}
            className="block max-h-[70vh] w-lg object-contain"
          />
        </div>
      </div>
    </figure>
  );
}