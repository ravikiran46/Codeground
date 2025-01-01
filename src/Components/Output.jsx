/* eslint-disable react/prop-types */
const Output = ({ outputdetails, loading }) => {
  const getoutput = () => {
    let statid = outputdetails?.status?.id;
    if (statid === 6) {
      return (
        <pre className="px-2 py-1 text-base font-normal text-red-500">
          {atob(outputdetails?.compile_output)}
        </pre>
      );
    } else if (statid === 3) {
      return (
        <pre className="px-2 py-1 text-base font-normal ">
          {atob(outputdetails?.stdout) !== null
            ? `${atob(outputdetails.stdout)}`
            : null}
        </pre>
      );
    } else if (statid === 5) {
      return (
        <pre className="px-2 py-1 text-base font-normal text-red-500">
          {"Time limit exceeded"}
        </pre>
      );
    } else {
      return (
        <pre className="px-2 py-1 text-base font-normal text-red-500">
          {atob(outputdetails?.stderr)}
        </pre>
      );
    }
  };
  return (
    <div>
      <h1 className="mb-1 font-mono text-xl">Output</h1>
      <div
        className={`w-full h-56 overflow-y-auto text-sm font-normal border-2  border-gray-500 rounded-md bg-slate-200
        ${loading ? "animate-pulse" : ""} `}
      >
        {outputdetails ? <>{getoutput()}</> : null}
      </div>
    </div>
  );
};

export default Output;
