function MacroData({
  value,
  label,
  ...props
}: {
  value: string | number;
  label: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <div
      {...rest}
      className={`flex flex-col rounded-lg shadow-lg items-center px-12 py-2 gap-1 bg-background ${className}`}
    >
      <div className="text-2xl font-medium text-primary-shade">{value}</div>
      <div className="text-xs tracking-widest uppercase text-text-minor-emphasis/80">
        {label}
      </div>
    </div>
  );
}

export default MacroData;
