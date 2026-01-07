interface Props {
  status: string;
}

export function StatusBar({ status }: Props) {
  return (
    <div style={{ marginBottom: 10 }}>
      <strong>Status:</strong> {status}
    </div>
  );
}
