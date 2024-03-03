import { useEffect, useState } from "react";
import {} from "../../Library/firebaseStorage";
import { fetchFromFirestore } from "../../Library/firestore";
import { useDocumentInterface } from "../../Library/firestoreHooks";
import {} from "../../Library/googleDocsLibrary";
import {} from "../../Library/useGoogleAuthState";
import { db, storage } from "../../Library/firebase";

// !!! FIX SPELLINGS
// !!! FIX EVERYTHING

export default function ContentManagement() {
  const [firestoreCollection, setFirestoreCollection] = useState([]);
  const {
    objectEntry,
    objectEntryList,
    handleInputChange,
    handleFileInputChange,
    handlePushEntry,
    uploadEntries,
  } = useDocumentInterface(db, storage);

  useEffect(() => {
    fetchFromFirestore("/documents").then((returnedCollection) => {
      setFirestoreCollection(returnedCollection);
    });
  }, []);

  return (
    <>
      <div className="ContentManagement">
        <h1>Content Management</h1>
        <CreateView
          objectEntry={objectEntry}
          handleInputChange={handleInputChange}
          handleFileInputChange={handleFileInputChange}
          handlePushEntry={handlePushEntry}
        />
        <DocumentListView
          firestoreCollection={firestoreCollection}
          objectEntryList={objectEntryList}
        />
      </div>
    </>
  );
}

function CreateView({
  objectEntry,
  handleInputChange,
  handleFileInputChange,
  handlePushEntry,
}) {
  return (
    <>
      <div className="CreateView">
        <h2>Create new post</h2>

        <label>Title</label>
        <input
          type="text"
          name="title"
          value={objectEntry?.title ? objectEntry?.title : ""}
          id="TitleInput"
          onChange={handleInputChange}
        />
        <label>Author</label>
        <input
          type="text"
          name="author"
          value={objectEntry?.author ? objectEntry?.author : ""}
          id="AuthorInput"
          onChange={handleInputChange}
        />
        <label>Body</label>
        <textarea
          name="body"
          id="TitleInput"
          onChange={handleInputChange}
          value={objectEntry?.body ? objectEntry?.body : ""}
        />
        <input
          type="file"
          name="headerImage"
          id="FileInput"
          onChange={handleFileInputChange}
        />
        <button onClick={handlePushEntry}>Add to drafts</button>
        <button
          onClick={() => {
            console.log(objectEntry);
          }}
        >
          Log entry
        </button>

        <br />
        <br />
        <br />
      </div>
    </>
  );
}

function DocumentListView({ firestoreCollection, objectEntryList }) {
  const [list, setList] = useState("firestore");

  return (
    <>
      <div className="DocumentListView">
        <div className="buttonsTab">
          <button
            onClick={() => {
              setList("firestore");
            }}
            className="tab"
          >
            Firestore
          </button>
          <button
            onClick={() => {
              setList("drafts");
            }}
            className="tab"
          >
            Drafts
          </button>
        </div>
        {list === "firestore" && (
          <FirestoreList firestoreCollection={firestoreCollection} />
        )}
        {list === "drafts" && <DraftList objectEntryList={objectEntryList} />}
      </div>
    </>
  );
}

function FirestoreList({ firestoreCollection }) {
  return (
    <>
      <div className="FirestoreList">
        {firestoreCollection.map((firestoreDocument) => {
          return (
            <>
              <FirestoreListItem
                firestoreDocument={firestoreDocument}
                key={firestoreDocument.id}
              />
            </>
          );
        })}
      </div>
    </>
  );
}
function FirestoreListItem({ firestoreDocument }) {
  return (
    <>
      <button className="FirestoreListItem">
        <h3>{firestoreDocument?.head?.title}</h3>
        <p>{firestoreDocument?.head?.author}</p>
      </button>
    </>
  );
}

function DraftList(objectEntryList) {
  return (
    <>
      <div className="DraftList">
        Draft list
        {objectEntryList.map((objectEntryItem) => {
          return (
            <>
              <DraftListItem objectEntryItem={objectEntryItem} />
            </>
          );
        })}
      </div>
    </>
  );
}
function DraftListItem({ objectEntryItem }) {
  return (
    <>
      <button className="DraftEntryItem">
        <p> {objectEntryItem.title} </p>
      </button>
    </>
  );
}
