import styles from "../styles/pages/submit.module.scss";
import Layout from "../components/layout";
import FileUploader from "../components/file-uploader";
import dynamic from "next/dynamic";
import { useState } from "react";
const MDEditor = dynamic(() => import("@uiw/react-md-editor/lib/esm/unstyled"), { ssr: false });

export default function SubmitPage() {
  const [readme, setReadme] = useState("");

  return (
    <Layout header>
      <div className={`layout-text`}>
        <h1>Submit</h1>

        <div className={styles["submit-page"]}>
          <form>
            <input type="text" placeholder="Title" name="title" required/>

            <div className={styles["editor"]}>
              <MDEditor value={readme} onChange={str => setReadme(str || "")}/>
              <input type="text" name="readme" value={readme} style={{ display: "none" }}/>
            </div>

            <div className={styles["file-uploader"]}>
              <FileUploader/>
            </div>

            <input type="submit" value="Archive"
                   formMethod="post" formAction="/api/archive"/>
          </form>
        </div>
      </div>
    </Layout>
  )
}
