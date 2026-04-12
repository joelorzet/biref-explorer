interface Props {
  id: string;
  label: string;
  value: string | number;
  type?: string;
  colSpan?: 1 | 2;
  autoComplete?: string;
  error?: string;
  onChange: (value: string) => void;
}

export function Field({
  id,
  label,
  value,
  type = 'text',
  colSpan = 1,
  autoComplete = 'off',
  error,
  onChange,
}: Props) {
  return (
    <div className={colSpan === 2 ? 'col-span-2' : undefined}>
      <label className="label" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className={`input ${
          error ? 'border-brand-rose/50 focus:ring-brand-rose/40' : ''
        }`}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        aria-invalid={error ? 'true' : undefined}
      />
      {error && (
        <div className="mt-1 font-mono text-[10px] text-brand-rose">
          {error}
        </div>
      )}
    </div>
  );
}
