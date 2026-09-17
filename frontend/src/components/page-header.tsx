export default function PageHeader({
  eyebrow,
  title,
  description,
  maxWidthClassName = "max-w-5xl",
  descriptionMaxWidthClassName = "max-w-2xl",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  maxWidthClassName?: string;
  descriptionMaxWidthClassName?: string;
}) {
  return (
    <div className={`mx-auto ${maxWidthClassName} px-6 pt-16`}>
      <p className="font-mono text-xs font-medium uppercase tracking-widest text-g-blue">
        {eyebrow}
      </p>
      <h1 className="mt-3 font-display text-3xl font-extrabold sm:text-4xl">
        {title}
      </h1>
      {description ? (
        <p
          className={`mt-4 ${descriptionMaxWidthClassName} text-sm text-foreground-soft`}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
