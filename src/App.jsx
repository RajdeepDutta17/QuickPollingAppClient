import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function App() {
  const url = "https://quickpollingappapi.onrender.com/";
  const [polls, setPolls] = useState([]);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const res = await axios.get(`${url}/polls`);
        setPolls(res.data.reverse());
      } catch (err) {
        console.log(err);
        toast.error(err.response.data.message);
      }
    };
    fetchPolls();
  }, [polls]);

  const createPoll = async () => {
    try {
      if (!question || !options.length) {
        return toast.warn("Fields cannot be empty");
      }
      await axios.post(`${url}/polls`, {
        question,
        options,
      });
      setQuestion("");
      setOptions(["", ""]);
    } catch (err) {
      console.log(err);
      toast.error(err.response.data.message);
    }
  };

  const vote = async (pollId, optionIndex) => {
    try {
      await axios.post(`${url}/polls/${pollId}/vote`, {
        optionIndex,
      });
    } catch (err) {
      console.log(err);
      toast.error(err.response.data.message);
    }
  };

  const addOption = () => {
    setOptions([...options, ""]);
  };

  const removeOption = (index) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="container">
      <h1>Quick Polling App</h1>
      <div className="poll-form">
        <input
          className="poll-question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Poll Question"
        />
        {options.map((opt, index) => (
          <div key={index} className="option-container">
            <input
              value={opt}
              onChange={(e) => {
                const newOptions = [...options];
                newOptions[index] = e.target.value;
                setOptions(newOptions);
              }}
              placeholder={`Option ${index + 1}`}
            />
            {index >= 2 && (
              <button
                className="remove-btn"
                onClick={() => removeOption(index)}
              >
                ×
              </button>
            )}
          </div>
        ))}
        <button onClick={addOption}>Add Option</button>
        <button onClick={createPoll}>Create Poll</button>
      </div>
      <h2>Polls</h2>
      {polls.map((poll) => (
        <div key={poll._id} className="poll-card">
          <h3>{poll.question}</h3>
          {poll.options.map((opt, index) => (
            <div key={index} className="poll-option">
              <button onClick={() => vote(poll._id, index)}>
                {opt.text} ({opt.votes} votes)
              </button>
            </div>
          ))}
        </div>
      ))}
      {!polls.length && <p className="no-poll">Create a New Pole</p>}
    </div>
  );
}

export default App;
