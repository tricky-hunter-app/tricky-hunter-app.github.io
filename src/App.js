import 'bootstrap/dist/css/bootstrap.min.css';
import Folder from './componets/Folder/Folder';
import Folders from './componets/Folders/Folders';
import TranslationSet from './componets/TranslationSet/TranslationSet'
import Typing from './componets/Typing/Typing'
import ImportTranslationSet from './componets/ImportTranslationSet/ImportTranslationSet';
import { Link, BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <div className="justify-center">
        <div className="container position-relative my-5 rounded-3 w-50 p-3" style={{ backgroundColor: "#f6f7fb" }}>
          <BrowserRouter>
            <div className="position-absolute end-0 mx-3">
              <Link to="import" className="btn btn-outline-primary mx-1">Import</Link>
            </div>
            <Routes>
              <Route path="/">
                <Route index element={<Folders />} />
                <Route path="folders/:folderId" element={<Folder />} />
                <Route path="import" element={<ImportTranslationSet />} />
                <Route path="sets/:setId" element={<TranslationSet />} />
                <Route path="typing/:setId" element={<Typing />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </div>
      </div>
    </div>
  );
}

export default App;
