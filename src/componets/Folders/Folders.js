import { useState, useEffect } from "react";
import database from '../../firebase';
import { get, ref } from "firebase/database";
import { Link } from "react-router-dom";

const FIREBASE_FOLDER_PATH = 'folders';

function Folders() {
  const [folders, setFolders] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await get(ref(database, FIREBASE_FOLDER_PATH));
      if (snapshot.exists()) {
        const data = snapshot.val();

        setFolders(data);
      } else {
        console.error("No data available");
      }
    };

    fetchData();
  }, []);

  return (
      <>
        <h4 className="mb-4 mx-1">Folders:</h4>
        <div className="list-group">
          {Object.keys(folders).map(key => <Link to={`folders/${key}`} className="list-group-item list-group-item-action">{folders[key].name}</Link>)}
        </div>
      </>
    );
}

export default Folders;