import React, { useState } from 'react';
import useDrivePicker from 'react-google-drive-picker';
import './styles/styles.css'; // Ensure your midnight theme is imported

export default function DrivePickerModule() {
  const [openPicker, authRes] = useDrivePicker();
  const [fileId, setFileId] = useState(null);

  const handlePick = () => {
    openPicker({
      clientId: 'YOUR_CLIENT_ID',
      developerKey: 'YOUR_API_KEY',
      viewId: 'DOCS_IMAGES_AND_VIDEOS',
      token: authRes?.access_token,
      showUploadView: true,
      multiselect: false,
      callbackFunction: data => {
        if (data.docs?.[0]?.id) {
          setFileId(data.docs[0].id);
        }
      },
    });
  };

  return (
    <div className="midnight-module midnight-panel">
      <h2 className="midnight-title">Google Drive Picker</h2>
      <button className="midnight-btn" onClick={handlePick}>
        Pick or Upload File
      </button>
      {fileId && (
        <div className="midnight-file-preview">
          <p>Selected File ID:</p>
          <code>{fileId}</code>
          <iframe
            src={`https://drive.google.com/file/d/${fileId}/preview`}
            className="midnight-embed"
            title="Drive Preview"
            allow="autoplay"
          ></iframe>
        </div>
      )}
    </div>
  );
}