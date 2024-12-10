import { useEffect, useState } from "react";
import Counter from "./components/Counter/Counter";
import { BsXCircleFill } from "react-icons/bs";
import logo42 from "./assets/42.png";

import "./App.css";
import { onAnalyticsEvent, onFirestoreEvent } from "./firebase";

function App() {
  const [location, setLocation] = useState(undefined);
  const [teamOne, setTeamOne] = useState({
    name: "Nós",
    points: 0,
    victories: 0,
  });
  const [teamTwo, setTeamTwo] = useState({
    name: "Eles",
    points: 0,
    victories: 0,
  });

  const pointsChange = (teamName, change) => {
    if (teamName == teamOne.name) {
      let newPoints = Math.min(12, Math.max(0, teamOne.points + change));
      setTeamOne({ ...teamOne, points: newPoints });
    } else {
      let newPoints = Math.min(12, Math.max(0, teamTwo.points + change));
      setTeamTwo({ ...teamTwo, points: newPoints });
    }
  };

  const nameChange = (teamName, newName) => {
    if (teamName == teamOne.name) {
      setTeamOne({ ...teamOne, name: newName });
    } else {
      setTeamTwo({ ...teamTwo, name: newName });
    }
  };

  const clear = () => {
    onAnalyticsEvent("scoreCleared");
    onFirestoreEvent("scoreCleared", location || "unknown");
    console.log("score_cleared");
    setTeamOne({ ...teamOne, points: 0 });
    setTeamTwo({ ...teamTwo, points: 0 });
  };

  useEffect(() => {
    if (location === undefined) return;
    onAnalyticsEvent("gameStarted");
    onFirestoreEvent("gameStarted", location || "unknown");
  }, [location]);

  useEffect(() => {
    const fetchGeoData = async () => {
      fetch("https://ipapi.co/json/")
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          setLocation(data?.country_name);
        })
        .catch((error) => {
          setLocation(null);
          console.error("Error fetching IP and location:", error);
        });
    };

    fetchGeoData();
  }, []);

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="flex flex-col items-center justify-center">
        <div className="add">
          <span className="ml-6">um oferecimento...</span>
          <img src={logo42} alt="Imagem" className="image mt-1" />
        </div>
        <div className="principal items-center justify-center">
          <Counter
            team={teamOne}
            nameChange={nameChange}
            pointsChange={pointsChange}
            className={"teste"}
          />
          <div className="line"></div>
          <Counter
            team={teamTwo}
            nameChange={nameChange}
            pointsChange={pointsChange}
          />
        </div>
        <div
          className="cursor-pointer select-none flex gap-2 border-2 rounded-2xl p-3"
          onClick={clear}
        >
          <span style={{ marginTop: -1, fontWeight: 600 }}>zerar partida</span>
          <BsXCircleFill color="#ff6c64" className="bg-white rounded-full" />
        </div>
      </div>
    </div>
  );
}

export default App;
