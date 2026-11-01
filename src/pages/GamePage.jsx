import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Leaderboard from "../components/Leaderboard";

const SAMPLE_QUESTIONS = [
  { question: "Who built the ark?", options: ["Moses", "Noah", "Abraham", "David"], correct: 1 },
  { question: "How many days and nights did Jesus fast in the wilderness?", options: ["30", "40", "50", "7"], correct: 1 },
  { question: "What is the first book of the Bible?", options: ["Exodus", "Genesis", "Matthew", "Psalms"], correct: 1 },
  { question: "Who was the first king of Israel?", options: ["David", "Solomon", "Saul", "Samuel"], correct: 2 },
  { question: "In which city was Jesus born?", options: ["Nazareth", "Jerusalem", "Bethlehem", "Capernaum"], correct: 2 }
];

export default function GamePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("Practice");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [gameActive, setGameActive] = useState(false);
  const [eliminated, setEliminated] = useState(false);
  const [shuffledOptions, setShuffledOptions] = useState([]);

  const startGame = () => {
    if (activeTab === "Contests" && !user) {
      alert("Please login to join a contest");
      return;
    }
    setGameActive(true);
    setCurrentQuestion(0);
    setScore(0);
    setEliminated(false);
    setTimeLeft(10);
    shuffleCurrentQuestion(0);
  };

  const shuffleCurrentQuestion = (index) => {
    const q = SAMPLE_QUESTIONS[index];
    const options = [...q.options];
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }
    setShuffledOptions(options);
  };

  useEffect(() => {
    if (!gameActive || eliminated) return;
    if (timeLeft <= 0) {
      handleAnswer(-1);
      return;
    }
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, gameActive, eliminated]);

  const handleAnswer = (selectedIndex) => {
    if (eliminated) return;
    const q = SAMPLE_QUESTIONS[currentQuestion];
    const correctOption = q.options[q.correct];
    const isCorrect = selectedIndex >= 0 && shuffledOptions[selectedIndex] === correctOption;

    if (isCorrect) {
      setScore(score + 1);
      if (currentQuestion + 1 < SAMPLE_QUESTIONS.length) {
        setCurrentQuestion(currentQuestion + 1);
        const nextTime = currentQuestion >= 3 ? 5 : currentQuestion >= 1 ? 7 : 10;
        setTimeLeft(nextTime);
        shuffleCurrentQuestion(currentQuestion + 1);
      } else {
        setGameActive(false);
        alert(`Game finished! Score: ${score + 1}`);
      }
    } else {
      setEliminated(true);
      setGameActive(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="p-4 bg-white border-b">
        <h1 className="text-xl font-bold text-primary">Trivia Game</h1>
      </div>

      <div className="flex gap-2 p-3 bg-gray-50 border-b">
        {["Contests", "Practice", "Leaderboard"].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-1.5 rounded-full text-sm ${activeTab === tab ? "bg-primary text-white" : "bg-white border"}`}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Leaderboard" && <Leaderboard />}

      {(activeTab === "Practice" || activeTab === "Contests") && !gameActive && !eliminated && (
        <div className="p-6 text-center">
          <p className="mb-4 text-gray-600">
            {activeTab === "Practice" ? "Practice anytime (guests allowed)" : "Join official contest (login required)"}
          </p>
          <button onClick={startGame} className="bg-primary text-white px-8 py-3 rounded-full">Start Game</button>
        </div>
      )}

      {gameActive && !eliminated && (
        <div className="p-4">
          <div className="flex justify-between mb-4 text-sm">
            <span>Question {currentQuestion + 1}</span>
            <span className="font-bold text-primary">{timeLeft}s</span>
            <span>Score: {score}</span>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border mb-4">
            <p className="font-medium">{SAMPLE_QUESTIONS[currentQuestion].question}</p>
          </div>
          <div className="space-y-2">
            {shuffledOptions.map((opt, idx) => (
              <button key={idx} onClick={() => handleAnswer(idx)} className="w-full text-left p-3 bg-white border rounded-lg hover:bg-gray-50">{opt}</button>
            ))}
          </div>
        </div>
      )}

      {eliminated && (
        <div className="p-8 text-center">
          <p className="text-lg font-medium text-red-600 mb-2">End of the journey for this contest</p>
          <p className="text-gray-600 mb-4">Try again next time</p>
          <p className="text-sm">Your score: {score}</p>
          <button onClick={() => { setEliminated(false); setGameActive(false); }} className="mt-4 text-primary">Back</button>
        </div>
      )}
    </div>
  );
}