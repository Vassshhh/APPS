// src/components/DownloadDashboard.jsx
import React, { useState } from "react";
import styles from "./DownloadDashboard.module.css";

const initialFiles = [
  
  { id: "def456", name: "Data_Responden.xlsx" },
];

const DownloadDashboard = () => {
  const [files, setFiles] = useState(initialFiles);
  const [editingFileId, setEditingFileId] = useState(null);
  const [editedFileName, setEditedFileName] = useState("");

  const handleEditClick = (file) => {
    setEditingFileId(file.id);
    setEditedFileName(file.name);
  };

  const handleFileNameChange = (e) => {
    setEditedFileName(e.target.value);
  };

  const handleSaveClick = (id) => {
    setFiles(prevFiles =>
      prevFiles.map(file =>
        file.id === id ? { ...file, name: editedFileName } : file
      )
    );
    setEditingFileId(null);
    setEditedFileName("");
  };

  const handleCancelClick = () => {
    setEditingFileId(null);
    setEditedFileName("");
  };

  const handleDownloadClick = async (id, fileName) => {
    try {
      const response = await fetch(`https://bot.kediritechnopark.com/webhook/download-form?id=${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download the file. Please try again.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Download File</h1>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nama File</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file) => (
              <tr key={file.id}>
                <td>
                  {editingFileId === file.id ? (
                    <input
                      type="text"
                      value={editedFileName}
                      onChange={handleFileNameChange}
                      className={styles.editInput}
                    />
                  ) : (
                    <span>{file.name}</span>
                  )}
                </td>
                <td>
                  {editingFileId === file.id ? (
                    <>
                      <button onClick={() => handleSaveClick(file.id)} className={styles.saveBtn}>
                        <i className="fas fa-check"></i>
                      </button>
                      <button onClick={handleCancelClick} className={styles.cancelBtn}>
                        <i className="fas fa-times"></i>
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleEditClick(file)} className={styles.editBtn}>
                        <i className="fas fa-edit"></i>
                      </button>
                      <button onClick={() => handleDownloadClick(file.id, file.name)} className={styles.downloadBtn}>
                        Download
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DownloadDashboard;
