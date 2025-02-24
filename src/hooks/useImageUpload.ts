// noinspection t

import React, {useState, useCallback} from "react";

interface ImageUploadReturn {
	image: File | null;
	preview: string | null;
	uploading: boolean;
	error: string | null;
	url: string | null;
	handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	handleUpload: () => Promise<void>;
	reset: () => void;
}

export const useImageUpload = (): ImageUploadReturn => {
	const [image, setImage] = useState<File | null>(null);
	const [preview, setPreview] = useState<string | null>(null);
	const [uploading, setUploading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [url, setUrl] = useState<string | null>(null);
	
	const reset = useCallback(() => {
		if (preview) URL.revokeObjectURL(preview);
		setImage(null);
		setPreview(null);
		setError(null);
		setUrl(null);
	}, [preview]);
	
	const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			if (preview) URL.revokeObjectURL(preview);
			setImage(file);
			setPreview(URL.createObjectURL(file));
			setError(null);
		}
	}, [preview]);
	
	const handleUpload = async () => {
		if (!image) {
			setError("No image selected");
			return;
		}
		
		setUploading(true);
		setError(null);
		
		const formData = new FormData();
		formData.append("file", image);
		
		try {
			const res = await fetch("/api/upload", {method: "POST", body: formData});
			const data = await res.json();
			
			if (res.ok) {
				setUrl(data.url);
			}
			else {
				setError(data.error || "Upload failed");
			}
		}
		catch (err) {
			setError(err instanceof Error ? err.message : "An unexpected error occurred");
		}
		finally {
			setUploading(false);
		}
	};
	
	
	return {image, preview, uploading, error, url, handleImageChange, handleUpload, reset};
};