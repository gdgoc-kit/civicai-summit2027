export default function FieldErrorMessage({
  error,
  id,
}: {
  error?: { message?: string };
  id: string;
}) {
  if (!error?.message) return null;
  return (
    <p id={id} role="alert" className="mt-1 text-sm text-g-red">
      {error.message}
    </p>
  );
}
