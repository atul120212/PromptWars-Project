'use client';
import { useState, useRef, useCallback } from 'react';
import styles from './ImageUpload.module.css';

const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'];

export default function ImageUpload({ onImageAnalyze, isProcessing }) {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [base64, setBase64] = useState(null);
    const [mimeType, setMimeType] = useState(null);
    const [dragging, setDragging] = useState(false);
    const [caption, setCaption] = useState('');
    const inputRef = useRef(null);

    const processFile = useCallback((f) => {
        if (!f) return;
        if (f.size > 10 * 1024 * 1024) {
            alert('File too large. Max 10MB.');
            return;
        }
        setFile(f);
        setMimeType(f.type);

        const reader = new FileReader();
        reader.onload = (e) => {
            const dataUrl = e.target.result;
            // Strip the data URL prefix to get pure base64
            const b64 = dataUrl.split(',')[1];
            setBase64(b64);
            if (f.type.startsWith('image/')) {
                setPreview(dataUrl);
            } else {
                setPreview(null);
            }
        };
        reader.readAsDataURL(f);
    }, []);

    const onDrop = useCallback((e) => {
        e.preventDefault();
        setDragging(false);
        const f = e.dataTransfer.files[0];
        if (f) processFile(f);
    }, [processFile]);

    const onDragOver = (e) => { e.preventDefault(); setDragging(true); };
    const onDragLeave = () => setDragging(false);
    const onChange = (e) => { if (e.target.files[0]) processFile(e.target.files[0]); };

    const handleAnalyze = () => {
        if (base64 && onImageAnalyze) {
            onImageAnalyze({ base64, mimeType, caption, fileName: file?.name });
        }
    };

    const handleClear = () => {
        setFile(null); setPreview(null); setBase64(null); setCaption('');
        if (inputRef.current) inputRef.current.value = '';
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <span className={styles.label}>🖼️ Image / Document Upload</span>
                {file && <span className={styles.fileSize}>{(file.size / 1024).toFixed(1)} KB</span>}
            </div>

            {!file ? (
                <div
                    className={`${styles.dropzone} ${dragging ? styles.dropzoneDragging : ''}`}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onClick={() => inputRef.current?.click()}
                >
                    <div className={styles.dropIcon}>📤</div>
                    <div className={styles.dropText}>
                        Drag & drop or <span className={styles.dropBrowse}>browse files</span>
                    </div>
                    <div className={styles.dropSub}>
                        Photos, medical scans, prescription images, accident photos, documents
                    </div>
                    <div className={styles.dropTypes}>JPG • PNG • WEBP • PDF (max 10MB)</div>
                    <input
                        ref={inputRef}
                        type="file"
                        accept={ACCEPTED.join(',')}
                        onChange={onChange}
                        className={styles.fileInput}
                    />
                </div>
            ) : (
                <div className={styles.filePreview}>
                    {preview ? (
                        <img src={preview} alt={file.name} className={styles.previewImg} />
                    ) : (
                        <div className={styles.pdfPreview}>
                            <span>📄</span>
                            <span>{file.name}</span>
                        </div>
                    )}
                    <div className={styles.fileName}>{file.name}</div>
                </div>
            )}

            {file && (
                <>
                    <textarea
                        className="input-field"
                        placeholder="Optional: Add context or description (e.g. 'This is a medical report from 2024')"
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        rows={3}
                    />
                    <div className={styles.actions}>
                        <button
                            className="btn btn-primary"
                            onClick={handleAnalyze}
                            disabled={isProcessing || !base64}
                        >
                            {isProcessing ? '⏳ Analyzing...' : '⚡ Analyze with Gemini Vision'}
                        </button>
                        <button className="btn btn-secondary" onClick={handleClear}>🗑 Clear</button>
                    </div>
                </>
            )}
        </div>
    );
}
