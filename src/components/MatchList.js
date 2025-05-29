import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { CalendarDays, Clock, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function MatchLIST() {
  const [matches, setMatches] = useState([]);
  const [filterTeam, setFilterTeam] = useState("All");
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://soccer-api-backend-1.onrender.com/matches")
      .then((res) => {
        setMatches(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const toggleTheme = useCallback(() => {
    const html = document.documentElement;
    if (darkMode) {
      html.classList.remove("dark");
    } else {
      html.classList.add("dark");
    }
    setDarkMode(!darkMode);
  }, [darkMode]);

  const isLive = (time) => {
    const matchTime = new Date(time);
    const now = new Date();
    const diff = Math.abs(now - matchTime);
    return diff < 60 * 60 * 1000; // 1 hour
  };

  const filteredMatches =
    filterTeam === "All"
      ? matches
      : matches.filter(
          (match) => match.home === filterTeam || match.away === filterTeam
        );

  const uniqueTeams = Array.from(
    new Set(matches.flatMap((match) => [match.home, match.away]))
  );

  return (
    <div className={`container ${darkMode ? "dark" : "light"}`}>
      <div className="header">
        <h2>⚽ Upcoming Soccer Matches</h2>
        <button onClick={toggleTheme} aria-label="Toggle Dark Mode" className="theme-toggle-btn">
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      <select
        onChange={(e) => setFilterTeam(e.target.value)}
        className="team-select"
        value={filterTeam}
      >
        <option value="All">All Teams</option>
        {uniqueTeams.map((team, idx) => (
          <option key={idx} value={team}>
            {team}
          </option>
        ))}
      </select>

      {loading ? (
        <div className="loading">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="loading-text">
            Loading matches...
          </motion.div>
        </div>
      ) : (
        <AnimatePresence>
          {filteredMatches.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="no-matches"
            >
              No matches found.
            </motion.p>
          ) : (
            filteredMatches.map((match, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                layout
                className="match-card"
              >
                <div className="match-info">
                  <div>
                    <div className="teams">
                      {match.home} <span className="vs">vs</span> {match.away}
                    </div>
                    <div className="match-time">
                      <CalendarDays size={16} />
                      <span>{new Date(match.time).toLocaleDateString()}</span>
                      <Clock size={16} />
                      <span>
                        {new Date(match.time).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                  {isLive(match.time) && (
                    <div className="live-indicator">🔴 Live Now</div>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      )}
    </div>
  );
}

export default MatchLIST;
