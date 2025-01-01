/* eslint-disable react/prop-types */
import { languageoptions } from "../constants/languageoptions";
import Select from "react-select";
const Language = ({ onSelectChange, defaultvalue }) => {
  return (
    <Select
      options={languageoptions}
      className="w-full rounded-lg border-zinc-300 sm:w-fit"
      defaultValue={defaultvalue}
      onChange={(selectedoptions) => onSelectChange(selectedoptions)}
    />
  );
};

export default Language;
