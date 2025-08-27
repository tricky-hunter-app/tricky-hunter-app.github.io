import { useState, useRef, useEffect } from "react";
import "./ImportTranslationSet.css";
import { useNavigate } from "react-router-dom";
import database from "../../firebase";
import { get, ref, push } from "firebase/database";

const FIREBASE_SET_PATH = "sets";
const FIREBASE_FOLDER_PATH = "folders";

function ImportTranslationSet() {
  const [titleInput, setTitleInput] = useState("");
  const [translationList, setTranslationList] = useState("");
  const [folders, setFolders] = useState([]);
  const textareaRef = useRef(null);
  const [folderId, setFolderId] = useState(null);

  const isSaveDisabled = !titleInput || !translationList;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await get(ref(database, FIREBASE_FOLDER_PATH));
      if (snapshot.exists()) {
        const data = snapshot.val();

        setFolders(data);
        setFolderId(Object.keys(data)[0]);
      } else {
        console.error("No data available");
      }
    };

    fetchData();
  }, []);

  const save = () => {
    const translations = translationList.split("\n").map((translationStr) => {
      var translationValues = translationStr.split(";");

      return {
        term: translationValues[0],
        definition: translationValues[1],
      };
    });

    const translationSet = {
      title: titleInput,
      folderId: folderId,
      translations: translations,
    };

    push(ref(database, FIREBASE_SET_PATH), translationSet)
      .then(() => {
        setTitleInput("");
        setTranslationList("");

        console.log("Data saved successfully!");

        navigate(-1);
      })
      .catch((error) => {
        console.error("Error saving data:", error);
      });
  };

  return (
    <>
      <div className="import-section">
        <div className="row mx-1 mb-1 mt-2 pt-5">
          <select
            className="form-select w-50"
            aria-label="Default select example"
          >
            {Object.keys(folders).map((key) => (
              <option
                key={key}
                value={key}
                onChange={() => setFolderId(folders[key])}
              >
                {folders[key].name}
              </option>
            ))}
          </select>
        </div>

        <div className="row mx-1 mb-1 mt-2 pt-5">
          <input
            type="text"
            className="form-control w-50"
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
            required
          />
        </div>

        <div className="row mx-1 mb-1 mt-2 pt-5">
          <textarea
            ref={textareaRef}
            className="form-control"
            value={translationList}
            onChange={(e) => {
              const el = textareaRef.current;

              el.style.height = "auto";
              el.style.height = `${el.scrollHeight}px`;

              setTranslationList(e.target.value);
            }}
            required
          />
        </div>

        <div className="row justify-content-end mt-2">
          <div className="col-4 d-flex justify-content-end">
            <button
              type="button"
              className="btn btn-success px-4"
              disabled={isSaveDisabled}
              onClick={save}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ImportTranslationSet;
