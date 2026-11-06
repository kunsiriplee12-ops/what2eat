export default function StateFeedback({ status, message }) {
  if (status === "loading") return <p role="status">{message}</p>;
  if (status === "empty") return <p role="status">{message}</p>;
  if (status === "error") return <p role="alert">{message}</p>;
  return null;
}
