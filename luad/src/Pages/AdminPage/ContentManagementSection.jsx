import { useEffect, useState } from "react";
import { fetchFromFirestore } from "../../Library/firestore";
import { useDocumentInterface } from "../../Library/firestoreHooks";
import handleImportFromDocs, {
  extractDocId,
  fetchDocument,
} from "../../Library/googleDocsLibrary";
import { db, storage } from "../../Library/firebase";
import {} from "../../Library/googleDocsLibrary";
import { CLIENT_ID, useGoogleAuthState } from "../../Library/googleOauth";

// !!! FIX SPELLINGS
// !!! FIX EVERYTHING

export default function ContentManagement() {
  const [firestoreCollection, setFirestoreCollection] = useState([]);
  const {
    objectEntry,
    objectEntryList,
    handleInputChange,
    handleFileInputChange,
    handleDiscardAllEntries,
    handlePushEntry,
    uploadEntries,
    removeDraftByUuid,
    pushImportedDocumentEntry,
  } = useDocumentInterface(db, storage);

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
        <CreateView
          objectEntry={objectEntry}
          handleInputChange={handleInputChange}
          handleFileInputChange={handleFileInputChange}
          handlePushEntry={handlePushEntry}
          pushImportedDocumentEntry={pushImportedDocumentEntry}
        />
        <DocumentListView
          firestoreCollection={firestoreCollection}
          objectEntryList={objectEntryList}
          removeDraftByUuid={removeDraftByUuid}
          handleDiscardAllEntries={handleDiscardAllEntries}
          uploadEntries={uploadEntries}
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
  pushImportedDocumentEntry,
}) {
  const GoogleOauth = useGoogleAuthState(
    "https://www.googleapis.com/auth/documents.readonly"
  );

  return (
    <>
      <div className="CreateView">
        <h2>Create new post</h2>

        <ImportFromDocs
          GoogleOauth={GoogleOauth}
          pushImportedDocumentEntry={pushImportedDocumentEntry}
        />

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

        <br />
        <br />
        <br />
      </div>
    </>
  );
}

function ImportFromDocs({ GoogleOauth, pushImportedDocumentEntry }) {
  const [docLink, setDocLink] = useState(null);

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
        <br />
        <input
          type="text"
          name="DocLinkInput"
          id="docLinkInput"
          placeholder="Google Doc link"
          onChange={(e) => {
            setDocLink(e.target.value);
          }}
        />
        <button
          onClick={() => {
            handleImportFromDocs(
              docLink,
              GoogleOauth?.loginResponse?.access_token,
              pushImportedDocumentEntry
            );
          }}
        >
          Import document
        </button>
      </div>
    </>
  );
}

function DocumentListView({
  firestoreCollection,
  objectEntryList,
  handleDiscardAllEntries,
  removeDraftByUuid,
  uploadEntries,
}) {
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
        {list === "drafts" && (
          <DraftList
            objectEntryList={objectEntryList}
            handleDiscardAllEntries={handleDiscardAllEntries}
            removeDraftByUuid={removeDraftByUuid}
            uploadEntries={uploadEntries}
          />
        )}
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
            <FirestoreListItem
              firestoreDocument={firestoreDocument}
              key={firestoreDocument?.id}
            />
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

function DraftList({
  objectEntryList,
  removeDraftByUuid,
  handleDiscardAllEntries,
  uploadEntries,
}) {
  return (
    <>
      <ol className="DraftList">
        <h3>Drafts: {objectEntryList.length}</h3>
        {objectEntryList.length > 0 &&
          objectEntryList?.map((objectEntryItem, index) => {
            return (
              <DraftListItem
                objectEntryItem={objectEntryItem}
                removeDraftByUuid={removeDraftByUuid}
                key={objectEntryItem.entryID}
                index={index}
              />
            );
          })}
      </ol>
      <button
        onClick={() => {
          console.log(objectEntryList);
        }}
      >
        Log
      </button>
      <button
        onClick={() => {
          uploadEntries();
        }}
      >
        Save and upload changes
      </button>
      <button onClick={handleDiscardAllEntries}>Discard changes</button>
    </>
  );
}
function DraftListItem({ objectEntryItem, removeDraftByUuid }) {
  const [showEditPanel, setShowEditPanel] = useState(false);
  return (
    <>
      <li className="DraftEntryItem">
        <p> NAME: {objectEntryItem.title} </p> <br />
        <p> AUTHOR: {objectEntryItem.author} </p> <br />
        <p> Entry ID: {objectEntryItem.entryID} </p> <br />
        <button
          onClick={() => {
            removeDraftByUuid(objectEntryItem?.entryID);
          }}
        >
          Discard draft
        </button>
        <button
          onClick={() => {
            console.log(objectEntryItem);
          }}
        >
          Log draft
        </button>
        <button
          onClick={() => {
            setShowEditPanel(!showEditPanel);
          }}
        >
          Edit
        </button>{" "}
        <br />
        {showEditPanel && (
          <div>
            <label>Title</label> <br />
            <input type="text" defaultValue={objectEntryItem?.title} /> <br />
            <label>Author</label> <br />
            <input type="text" defaultValue={objectEntryItem?.author} /> <br />
            <label>Body</label> <br />
            <textarea type="text" defaultValue={objectEntryItem?.body} />
          </div>
        )}
      </li>
    </>
  );
}
