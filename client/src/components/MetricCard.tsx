interface Props {
  title: string;
  value: string;
}

const MetricCard = ({ title, value }: Props) => {
  return (
    <div style={styles.card}>
      <h3>{title}</h3>
      <p style={styles.value}>{value}</p>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    width: "200px",
  },
  value: {
    fontSize: "24px",
    fontWeight: "bold",
  },
};

export default MetricCard;