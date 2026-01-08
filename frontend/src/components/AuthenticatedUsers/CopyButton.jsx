import React, { useState } from 'react';

const CopyButton = ({ linkToCopy }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
	if (window.isSecureContext && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    		try {
      // Modern API for writing text to the clipboard
      			await navigator.clipboard.writeText(linkToCopy);
      
      // Visual feedback
      			setCopied(true);
      			setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    			} catch (err) {
      				console.error('Ошибка копирования: ', err);
    				} 
	}
   else {
  const textArea = document.createElement("textarea");
  textArea.value = linkToCopy;
  document.body.appendChild(textArea);
  textArea.select();
	try {
		document.execCommand('copy');
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);

	} catch (err) {
		console.error('Fallback copy failed: ', err);
	}
   document.body.removeChild(textArea);
    }
  };

  return (
    <button onClick={handleCopy}>
      {copied ? 'Cкопировано!' : 'Копировать'}
    </button>
  );
};

export default CopyButton;
