export default function StepBackground({ data }) {
  if (!data) return null;
  return (
    <ul style={{ margin: 0, paddingLeft: 18 }}>
      {Object.entries(data).map(([title, value], idx) => (
        <li key={idx}><b>{title}:</b> {value}</li>
      ))}
    </ul>
  );
}
