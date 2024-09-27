export default function DashTitle() {
  return (
    <div className="shadow-lg rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900">Dashboard</h2>
      <p className="mt-2 text-gray-600">
        Welcome to the Administrator&apos;s Panel
      </p>
      <div className="mt-4 p-4 bg-sky-800 text-white rounded-lg shadow-md">
        <h3 className="text-lg font-semibold">Hello, Liam Moore</h3>
        <p>
          This information is for administrators or staff to run the data within
          the system.
        </p>
      </div>
    </div>
  );
}
