/* eslint-disable react/prop-types */
const Output = ({ outputdetails }) => {
  const getoutput = () => {
    let statid = outputdetails?.status?.id;
    if (statid === 6) {
      return (
        <pre className="px-2 py-1 font-normal text-xs text-red-500">
          {atob(outputdetails?.compile_output)}
        </pre>
      );
    } else if (statid === 3) {
      return (
        <pre className="px-2 py-1 font-normal text-xs ">
          {atob(outputdetails?.stdout) !== null
            ? `${atob(outputdetails.stdout)}`
            : null}
        </pre>
      );
    } else if (statid === 5) {
      return (
        <pre className="px-2 py-1 font-normal text-xs text-red-500">
          {"Time limit exceeded"}
        </pre>
      );
    } else {
      return (
        <pre className="px-2 py-1 font-normal text-xs text-red-500">
          {atob(outputdetails?.stderr)}
        </pre>
      );
    }
  };
  return (
    <div>
      <h1 className="text-xl font-mono">output</h1>
      <div className="w-full h-56 rounded-md font-normal text-sm overflow-y-auto border-2 bg-slate-100">
        {outputdetails ? <>{getoutput()}</> : null}
      </div>
    </div>
  );
};

export default Output;
