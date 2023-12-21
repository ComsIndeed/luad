import { useEffect, useState } from "react";
import { fetchFromFirestore } from "../lib/firestoreControls";
import { Layout, Panel, SubPanel } from "./PageComponents";

export default function Database() {
  const [content, setContent] = useState([]);
  useEffect(() => {
    fetchFromFirestore("/content").then((returned) => {
      setContent(returned);
    });
  }, []);

  return (
    <>
      <Layout>
        <Panel></Panel>
      </Layout>
    </>
  );
}
