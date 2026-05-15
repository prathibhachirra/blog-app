import { useRouteError } from "react-router";
import errorImage from "../assets/error.jpg";

function ErrorBoundary() {
  const { data, status, statusText } = useRouteError();
  return (
    <div className="text-center">
      <p>{data}</p>
      <p>{status} - {statusText}</p>
      <img src={errorImage} alt="Error" className="mx-auto" />
    </div>
  );
}
export default ErrorBoundary;