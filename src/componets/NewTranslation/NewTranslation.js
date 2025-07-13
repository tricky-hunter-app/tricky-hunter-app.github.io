import React, { useState } from 'react';

function NewTransplation({blockKey, onDiscardNewTranslation, onSaveNewTranslation}) {
  const [termInput, setTermInput] = useState("");
  const [definitionInput, setDefinitionInput] = useState("");

  const save = async () => {
    const translation = {
      term: termInput,
      definition: definitionInput
    };

    await onSaveNewTranslation(translation);
    await onDiscardNewTranslation(blockKey);
  }

  return (
    <>
      <div className="row mx-1 mb-1 mt-2">
        <div className="col-4 bg-white p-4 rounded-start-2">
          <input
            type="text"
            className="form-control"
            onChange={(e) => setTermInput(e.target.value)}
            required
          />
        </div>
        <div className="position-relative col-8 bg-white p-4 rounded-end-2">
          <div className="border-start ps-4">
            <input
              type="text"
              className="form-control"
              onChange={(e) => setDefinitionInput(e.target.value)}
              required
            />
          </div>

          <div className="position-absolute remove" onClick={() => onDiscardNewTranslation(blockKey)}></div>
          <div className="position-absolute save-translation" onClick={() => save()}></div>
        </div>
      </div>
    </>
  );
}

export default NewTransplation;