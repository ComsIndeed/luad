import { useEffect, useState } from "react";
import { fetchFromFirestore } from "../../Library/firestore";
import { useDocumentInterface } from "../../Library/firestoreHooks";
import handleImportFromDocs from "../../Library/googleDocsLibrary";
import { db, storage } from "../../Library/firebase";
import { CLIENT_ID, useGoogleAuthState } from "../../Library/googleOauth";

export default function ContentManagement() {
  const [firestoreCollection, setFirestoreCollection] = useState([]);
  const CMS = useDocumentInterface(db, storage);

  useEffect(() => {
    fetchFromFirestore("/documents", undefined, true).then(
      (returnedCollection) => {
        setFirestoreCollection(returnedCollection);
      }
    );
  }, []);

  return (
    <>
      <div className="ContentManagement">
        <h1>Content Management</h1>
        <CreateView CMS={CMS} />
        <DocumentListView CMS={CMS} firestoreCollection={firestoreCollection} />
      </div>
    </>
  );
}

function CreateView({ CMS }) {
  const GoogleOauth = useGoogleAuthState(
    "https://www.googleapis.com/auth/documents.readonly"
  );

  return (
    <>
      <div className="CreateView">
        <h2>Create new post</h2>

        <ImportFromDocs GoogleOauth={GoogleOauth} CMS={CMS} />

        <label>Title</label>
        <input
          type="text"
          name="title"
          value={CMS.objectEntry?.title || ""}
          id="TitleInput"
          onChange={CMS.handleInputChange}
        />
        <label>Author</label>
        <input
          type="text"
          name="author"
          value={CMS.objectEntry?.author || ""}
          id="AuthorInput"
          onChange={CMS.handleInputChange}
        />
        <label>Body</label>
        <textarea
          name="body"
          id="TitleInput"
          onChange={CMS.handleInputChange}
          value={CMS.objectEntry?.body || ""}
        />
        <input
          type="file"
          name="headerImage"
          id="FileInput"
          onChange={CMS.handleFileInputChange}
        />
        <button onClick={CMS.handlePushEntry}>Add to drafts</button>

        <br />
        <br />
        <br />
      </div>
    </>
  );
}

function ImportFromDocs({ GoogleOauth, CMS }) {
  const [docLink, setDocLink] = useState("");

  return (
    <>
      <div className="GoogleDocsImport sectionDivider">
        <h3>Google Docs Import</h3>
        <br />
        <p>
          Signed in as:{" "}
          {GoogleOauth?.userInfo
            ? GoogleOauth?.userInfo?.name
            : "Not signed in :("}
          {!GoogleOauth?.userInfo && (
            <>
              <br />
              <button
                onClick={() => {
                  GoogleOauth.login();
                }}
              >
                Authorize Google Docs Access
              </button>
            </>
          )}
        </p>
        {GoogleOauth?.userInfo && (
          <>
            <br />
            <button
              onClick={() => {
                GoogleOauth.logout();
              }}
            >
              Logout
            </button>
            <br />
            <input
              type="text"
              name="DocLinkInput"
              id="docLinkInput"
              placeholder="Google Doc link"
              value={docLink}
              onChange={(e) => {
                setDocLink(e.target.value);
              }}
            />
            <button
              onClick={() => {
                handleImportFromDocs(
                  docLink,
                  GoogleOauth?.loginResponse?.access_token,
                  CMS.pushImportedDocumentEntry
                );
                setDocLink("");
              }}
            >
              Import document
            </button>
          </>
        )}
      </div>
    </>
  );
}

function DocumentListView({ CMS, firestoreCollection }) {
  const [list, setList] = useState("drafts");

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
        {list === "drafts" && <DraftList CMS={CMS} />}
      </div>
    </>
  );
}

function FirestoreList({ firestoreCollection }) {
  return (
    <>
      <div className="FirestoreList">
        {firestoreCollection.map((firestoreDocument, index) => {
          return (
            <FirestoreListItem
              firestoreDocument={firestoreDocument}
              key={firestoreDocument?.id}
              index={index}
            />
          );
        })}
      </div>
    </>
  );
}

function FirestoreListItem({ firestoreDocument, index }) {
  return (
    <>
      <div className="FirestoreListItem">
        <div className="info">
          <h3>{index + 1}</h3>
          <p>{firestoreDocument?.head?.title}</p>
          <p>{firestoreDocument?.head?.author}</p>
        </div>
        <div className="buttons">
          <button>Edit document</button>
          <button>Delete document</button>
        </div>
      </div>
    </>
  );
}

function DraftList({ CMS }) {
  return (
    <>
      <div className="DraftList">
        <h2> DRAFT LIST: {CMS.objectEntryList?.length} </h2>
        {CMS.objectEntryList.length === 0 && "Looking empty in here.."}
        {CMS.objectEntryList.length > 0 &&
          CMS.objectEntryList?.map((objectEntryItem, index) => (
            <DraftListItem
              objectEntryItem={objectEntryItem}
              CMS={CMS}
              key={objectEntryItem.entryID}
              index={index}
            />
          ))}
      </div>
      <button onClick={() => console.log(CMS.objectEntryList)}>Log</button>
      <button onClick={CMS.uploadEntries}>Save and upload changes</button>
      <button onClick={CMS.handleDiscardAllEntries}>Discard changes</button>
    </>
  );
}

function DraftListItem({ objectEntryItem, CMS, index }) {
  const [showEditPanel, setShowEditPanel] = useState(false);
  const [changes, setChanges] = useState({});

  useEffect(() => {
    console.log(changes);
  }, [changes]);

  const handleEditInputChange = (e) => {
    setChanges((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  };

  return (
    <div className="DraftEntryItem">
      <div className="info">
        <h3>{index + 1}</h3>
        <p>{objectEntryItem.operation}</p>
        <p>{objectEntryItem.title}</p>
        <p>{objectEntryItem.author || "Author wasnt provided"}</p>
      </div>
      <div className="buttons">
        <button onClick={() => CMS.removeDraftByUuid(objectEntryItem.entryID)}>
          Discard draft
        </button>
        <button onClick={() => console.log(objectEntryItem)}>Log draft</button>
        <button onClick={() => setShowEditPanel(!showEditPanel)}>
          Edit draft
        </button>
      </div>
      {showEditPanel && (
        <div className="editPanel">
          <input
            type="text"
            defaultValue={objectEntryItem.title}
            placeholder="Title"
            name="title"
            onChange={handleEditInputChange}
          />{" "}
          <br />
          <input
            type="text"
            defaultValue={objectEntryItem.author}
            placeholder="Author"
            name="author"
            onChange={handleEditInputChange}
          />{" "}
          <br />
          <textarea
            defaultValue={objectEntryItem.body}
            placeholder="Body"
            name="body"
            onChange={handleEditInputChange}
          />
          <div className="editButtons">
            <button
              onClick={() => {
                console.log("TEST: ", CMS.getEntryByID(objectEntryItem.id));
                CMS.editEntry(objectEntryItem.entryID, changes);
              }}
            >
              Save changes
            </button>
            <button>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
