import { useImageUpload } from "@/hooks/useImageUpload";

export default function UploadPage() {
	const { preview, uploading, error, url, handleImageChange, handleUpload } = useImageUpload();
	
	return (
		<div>
			<h1>Upload Image</h1>
			<input type="file" accept="image/*" onChange={handleImageChange} />
			{preview && <img src={preview} alt="Image preview" style={{ width: "200px" }} />}
			<button onClick={handleUpload} disabled={uploading}>
				{uploading ? "Uploading..." : "Upload"}
			</button>
			{error && <p style={{ color: "red" }}>{error}</p>}
			{url && (
				<div>
					<p>Image uploaded successfully:</p>
					<a href={url} target="_blank" rel="noopener noreferrer">
						{url}
					</a>
				</div>
			)}
		</div>
	);
}