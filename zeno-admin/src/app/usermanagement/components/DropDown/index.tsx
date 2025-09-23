import React, { useState } from "react";

interface CustomDropdownProps {
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
}

const capitalize = (str: string) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

export default function CustomDropdown({
  options,
  selected,
  onSelect,
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative w-48 inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white border border-gray-400 rounded p-2 text-left flex justify-between items-center text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
        type="button"
      >
        {capitalize(selected)}
        <svg
          className={`w-5 h-5 ml-2 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <ul
          data-testid="dropdown-options"
          className="absolute mt-1 z-10 max-h-60 w-full overflow-auto rounded-md bg-[#091326] border border-gray-300 shadow-lg text-white"
        >
          <li
            onClick={() => {
              onSelect("all");
              setIsOpen(false);
            }}
            className={`cursor-pointer px-3 py-2 ${selected === "all" ? "bg-blue-800" : "hover:bg-blue-700"}`}
          >
            All Roles
          </li>
          {options.map((option) => (
            <li
              key={option}
              onClick={() => {
                onSelect(option);
                setIsOpen(false);
              }}
              className={`cursor-pointer px-3 py-2 ${selected === option ? "bg-blue-800" : "hover:bg-blue-700"}`}
            >
              {capitalize(option)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
