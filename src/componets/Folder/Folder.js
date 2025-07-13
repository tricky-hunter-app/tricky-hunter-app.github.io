import { useState, useEffect } from "react";
import { Link, useParams } from 'react-router-dom';
import database from '../../firebase';
import { get, query, ref, orderByChild, equalTo } from "firebase/database";

const FIREBASE_SET_PATH = 'sets';

function Folders() {
  const { key } = useParams();
  const [translationSets, setTranslationSets] = useState([]);

  useEffect(() => {
    console.log("Key: " + key);

    const fetchData = async () => {
      const setsRef = ref(database, FIREBASE_SET_PATH);
      const q = query(setsRef, orderByChild("folderId"), equalTo(key));

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
          {Object.keys(translationSets).map(key => <Link to={`/sets/${key}`} class="list-group-item list-group-item-action">{translationSets[key].title}</Link>)}
        </div>
      </>
    );
}

export default Folders;