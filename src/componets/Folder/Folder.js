import { useState, useEffect } from "react";
import { Link, useParams } from 'react-router-dom';
import database from '../../firebase';
import { get, query, ref, orderByChild, equalTo } from "firebase/database";

const FIREBASE_SET_PATH = 'sets';

function Folders() {
  const { folderId } = useParams();
  const [translationSets, setTranslationSets] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const setsRef = ref(database, FIREBASE_SET_PATH);
      const q = query(setsRef, orderByChild("folderId"), equalTo(folderId));

      const snapshot = await get(q);

      if (snapshot.exists()) {
        const data = snapshot.val();

        setTranslationSets(data);
      } else {
        console.error("No data available");
      }
    };

    fetchData();
  }, []);

  return (
      <>
        <h4 className="mb-4 mx-1">Translation Sets:</h4>
        <div class="list-group">
          {Object.keys(translationSets).map(setId => <Link to={`/sets/${setId}`} class="list-group-item list-group-item-action">{translationSets[setId].title}</Link>)}
        </div>
      </>
    );
}

export default Folders;