import { useEffect, useState, useRef } from 'react';

function TranslationCard({ index, translation, onRevealTerm, onRevealDefinition, onSave, onDelete }) {
    const [editMode, setEditMode] = useState(false);
    const [termInput, setTermInput] = useState("");
    const [definitionInput, setDefinitionInput] = useState("");
    const textareaRef = useRef(null);
  
    useEffect(() => {
      setTermInput(translation.term);
      setDefinitionInput(translation.definition);
    }, [translation.term, translation.definition]);
  
    const cancelEdit = () => {
      setTermInput(translation.term);
      setDefinitionInput(translation.definition);
      setEditMode(false);
    };
  
    const saveEdit = async () => {
      await onSave(index, termInput, definitionInput);
      setEditMode(false);
    };
  
    return (
      <div className="row mx-1 mb-1 mt-2">
        <div
          className={`col-4 bg-white p-4 rounded-start-2 ${translation.hideTerm ? "cursor-pointer" : ""}`}
          onClick={() => onRevealTerm(index)}
        >
          {!editMode ? (
            <span className={translation.hideTerm ? "text-white" : ""}>{translation.term}</span>
          ) : (
            <input
              type="text"
              className="form-control"
              value={termInput}
              onChange={(e) => setTermInput(e.target.value)}
              required
            />
          )}
        </div>

        <div
          className={`position-relative col-8 border-start bg-white p-4 rounded-end-2 ${translation.hideDefinition ? "cursor-pointer" : ""}`}
          onClick={() => onRevealDefinition(index)}
        >
          <>
            {!editMode ? (
              <span className={translation.hideDefinition ? "text-white" : ""}>{translation.definition}</span>
            ) : (
              <textarea
                ref={textareaRef}
                className="form-control"
                value={definitionInput}
                onChange={(e) => {
                  const el = textareaRef.current;
                  el.style.height = "auto";
                  el.style.height = `${el.scrollHeight}px`;
                  setDefinitionInput(e.target.value);
                }}
                required
              />
            )}
          </>
  
          {!editMode && (
            <>
              <div className="position-absolute edit-translation" onClick={() => setEditMode(true)}></div>
              <div className="position-absolute remove" onClick={() => onDelete(index)}></div>
            </>
          )}
          {editMode && (
            <>
              <div className="position-absolute save-translation" onClick={saveEdit}></div>
              <div className="position-absolute decline" onClick={cancelEdit}></div>
            </>
          )}
        </div>
      </div>
    );
  }
  
  export default TranslationCard;
