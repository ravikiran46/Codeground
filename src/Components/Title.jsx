/* eslint-disable react/prop-types */
import { useState } from "react";
import toast from "react-hot-toast";
import { Tooltip } from "react-tooltip";

const Title = ({ title, settitle }) => {
  const [inputval, setinputval] = useState(title);
  const [isediting, setisediting] = useState(false);
  const handleEditClick = () => {
    setisediting(true);
    toast(
      <div>
        Hit <b>Enter</b> to save title
      </div>,
      {
        icon: "👋",
      }
    );
    setinputval(title);
  };
  const handleInputChange = (e) => {
    setinputval(e.target.value);
  };

  const handleSave = () => {
    settitle(inputval);
    setisediting(false);
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSave();
    }
  };
  const handleblur = () => {
    handleSave();
  };
  return (
    <>
      <Tooltip
        id="editTooltip"
        place="right"
        opacity={1}
        style={{ padding: 4, backgroundColor: "white", color: "black" }}
        border="1px solid"
      />
      {isediting ? (
        <input
          type="text"
          value={inputval}
          onChange={handleInputChange}
          onKeyUp={handleKeyPress}
          onBlur={handleblur}
          className="p-1 border rounded"
          autoFocus // Focus on input when editing
        />
      ) : (
        <h1
          onClick={isediting ? handleSave : handleEditClick}
          data-tooltip-id="editTooltip"
          data-tooltip-content="Click to edit"
          className="p-2 pr-16 text-xl font-bold border border-gray-600 rounded-lg shadow"
        >
          {title}
        </h1>
      )}
    </>
  );
};

export default Title;
