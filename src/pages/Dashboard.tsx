import { ErrorBoundary } from "react-error-boundary";

export default function Dashboard() {
  return (
    <ErrorBoundary
      fallbackRender={({ error }) => (
        <div className="p-4 text-red-600 bg-red-100">
          <strong>Error in Dashboard:</strong>
          <pre>{error.message}</pre>
        </div>
      )}
    >
      <div className="p-6">
        <h1 className="text-2xl font-bold">Test Render Dashboard</h1>
        <p className="text-muted-foreground">Apakah ini muncul?</p>
      </div>
    </ErrorBoundary>
  );
}
