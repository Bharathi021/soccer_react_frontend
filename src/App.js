import React from "react";
import MatchLIST from "./components/MatchList";


function App() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 p-6">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <MatchLIST />
      </div>
    </div>
  );
}

export default App;
