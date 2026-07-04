export const FigurePreview = ({ src, alt = "Generated plot" }) => {
  return (
      <img
        src={src}
        alt={alt}
        className="block max-h-[70vh] w-lg object-contain mb-8"
      />
  );
}