import { useEffect, useState, useRef } from 'react';
import { ref, get, update, set } from "firebase/database";
import { useParams } from 'react-router-dom';
import database from '../../firebase';
import TranslationCard from '../TranslationCard/TranslationCard';
import NewTranslation from '../NewTranslation/NewTranslation';

const FIREBASE_SET_PATH = 'sets';

function TranslationSet() {
  const { key } = useParams();
  const bottomRef = useRef(null);

  const [showTerms, setShowTerms] = useState(true);
  const [showDefinitions, setShowDefinitions] = useState(true);
  const [title, setTitle] = useState(null);
  const [translations, setTranslations] = useState([]);
  const [newTranslationBlocks, setNewTranslationBlocks] = useState([]);

  const newTranslation = () => {
    const key = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);

    setNewTranslationBlocks(prev => [...prev, key]);
  };

  const discardNewTranslation = (blockKey) => {
    setNewTranslationBlocks([...newTranslationBlocks.filter(key => key !== blockKey)])
  };

  const saveNewTranslation = async (translation) => {
    await set(ref(database, `${FIREBASE_SET_PATH}/${key}/translations`), [...translations, translation]);

    setTranslations(prev => [...prev, translation]);
  }

  const toggleTerms = () => {
    const updated = translations.map(t => ({
      ...t,
      hideTerm: showTerms,
      hideDefinition: false
    }));
    setTranslations(updated);
    setShowTerms(!showTerms);
    setShowDefinitions(true);
  };

  const toggleDefinitions = () => {
    const updated = translations.map(t => ({
      ...t,
      hideTerm: false,
      hideDefinition: showDefinitions
    }));
    setTranslations(updated);
    setShowDefinitions(!showDefinitions);
    setShowTerms(true);
  };

  const revealTerm = (id) => {
    const updated = translations.map((t, index) =>
      index === id ? { ...t, hideTerm: false } : t
    );

    setTranslations(updated);
    setShowTerms(updated.every(t => !t.hideTerm));
  };

  const revealDefinition = (id) => {
    const updated = translations.map((t, index) =>
      index === id ? { ...t, hideDefinition: false } : t
    );

    setTranslations(updated);
    setShowDefinitions(updated.every(t => !t.hideDefinition));
  };

  const saveTranslation = async (id, term, definition) => {
    const translation = translations[id];

    translation.term = term;
    translation.definition = definition;

    await update(ref(database, `${FIREBASE_SET_PATH}/${key}/translations/${id}`), translation);

    setTranslations((prev, index) =>
      prev.map(t => (index === id ? { ...t, term, definition } : t))
    );
  };

  const deleteTranslation = async (id) => {
    translations.splice(id, 1);

    await set(ref(database, `${FIREBASE_SET_PATH}/${key}/translations`), translations);

    setTranslations(_ => [...translations]);;
  };

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await get(ref(database, `${FIREBASE_SET_PATH}/${key}`));
      
      if (snapshot.exists()) {
        const data = snapshot.val();
        const translations = data.translations;

        setTitle(data.title);
        setTranslations(translations)
      } else {
        console.error("No data available");
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [newTranslationBlocks ]);

  return (
    <>
      <h4 className="mb-4 mx-1">{title}</h4>
      {translations.map((t, index) => (
        <TranslationCard
          key={index}
          index={index}
          translation={t}
          onRevealTerm={revealTerm}
          onRevealDefinition={revealDefinition}
          onSave={saveTranslation}
          onDelete={deleteTranslation}
        />
      ))}
      {newTranslationBlocks.map(key => 
        <NewTranslation
          key={key}
          blockKey={key}
          onDiscardNewTranslation={discardNewTranslation}
          onSaveNewTranslation={saveNewTranslation} />)}
      <div className="row my-3">
        <div className="col-12">
          <div className="new-translation-btn" ref={bottomRef} onClick={newTranslation}></div>
        </div>
      </div>

      <div className="position-fixed start-50 translate-middle-x bottom-0 mb-3" style={{ width: "444px" }}>
        <div className="container p-3 rounded-3 border border-primary bg-aliceblue box-shadow">
          <div className="row">
            <div className="col-6 pe-1">
              <button className="btn btn-light border w-100" onClick={toggleTerms}>
                {showTerms ? "Hide Terms" : "Show Terms"}
              </button>
            </div>
            <div className="col-6 ps-1 text-end">
              <button className="btn btn-light border w-100" onClick={toggleDefinitions}>
                {showDefinitions ? "Hide Definitions" : "Show Definitions"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TranslationSet;
