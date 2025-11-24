import React from "react";

export default function Footer() {
  return (
    <p className="text-xs text-gray-500 text-center  ">
      {" "}
      Copyright &copy; {new Date().getFullYear()}, CRMC SmartVote System
    </p>
  );
}
