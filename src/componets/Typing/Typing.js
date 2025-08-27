import { useEffect, useState } from "react";
import { ref, get } from "firebase/database";
import { useParams, useNavigate } from "react-router-dom";
import database from "../../firebase";
import "./Typing.css";

const FIREBASE_SET_PATH = "sets";

function Typing() {
  const { setId } = useParams();
  const navigate = useNavigate();

  const [translations, setTranslations] = useState([]);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [termInput, setTermInput] = useState("");
  const [mismatchedTerm, setMismatchedTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await get(
        ref(database, `${FIREBASE_SET_PATH}/${setId}`)
      );

      if (snapshot.exists()) {
        const data = snapshot.val();
        const translations = data.translations;

        setTranslations(translations);
      } else {
        console.error("No data available");
      }
    };

    fetchData();
  }, []);

  const handleTermInput = (e) => {
    if (e.key !== "Enter") {
      return;
    }

    const currentTerm = translations[currentPosition].term
      .trimEnd()
      .toLowerCase();
    const incomingTerm = termInput.trimEnd().toLowerCase();

    if (currentTerm === incomingTerm) {
      setMismatchedTerm("");
      
      if (translations.length <= currentPosition + 1) {
        navigate(`/sets/${setId}`);
      } else {
        setCurrentPosition(currentPosition + 1);
      }
    } else {
      setMismatchedTerm(highlightMismatches(incomingTerm, currentTerm));
    }

    setTermInput("");
  };

  const highlightMismatches = (str1, str2) => {
    const minLength = Math.min(str1.length, str2.length);
    let result = "";

    for (let i = 0; i < minLength; i++) {
      if (str1[i] !== str2[i]) {
        result += `<span style="color: red">${str2[i]}</span>`;
      } else {
        result += str2[i];
      }
    }

    if (str2.length > minLength) {
      result += `<span style="color: red">${str2.slice(minLength)}</span>`;
    }

    return result;
  };

  return (
    <>
      <div className="position-fixed typing-container rounded-3">
        {(() => {
          if (translations.length) {
            return (
              <>
                <div className="text-center definition">
                  {translations[currentPosition].definition}
                </div>
                <div className="px-5 position-absolute w-100 typing-section">
                  <input
                    type="text"
                    className="form-control"
                    value={termInput}
                    onChange={(e) => setTermInput(e.target.value)}
                    onKeyPress={handleTermInput}
                    required
                  />
                  <div>
                    <span
                      dangerouslySetInnerHTML={{ __html: mismatchedTerm }}
                    />
                  </div>
                </div>
              </>
            );
          }

          return null;
        })()}
      </div>
    </>
  );
}

export default Typing;
