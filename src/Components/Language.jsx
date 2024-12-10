/* eslint-disable react/prop-types */
import { languageoptions } from "../constants/languageoptions";
import Select from "react-select";
const Language = ({ onSelectChange }) => {
  return (
    <Select
      options={languageoptions}
      className="border-zinc-300"
      defaultValue={languageoptions[0]}
      onChange={(selectedoptions) => onSelectChange(selectedoptions)}
    />
  );
};

export default Language;
