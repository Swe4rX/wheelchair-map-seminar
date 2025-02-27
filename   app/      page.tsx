const MyComponent: React.FC = () => {
    const handleUpload = (file: File) => {
        // handle file upload
    };

    const processResponse = (response: Response) => {
        // process the response
    };

    return (
        <div>
            <input type="file" onChange={(e) => e.target.files && handleUpload(e.target.files[0])} />
        </div>
    );
};

export default MyComponent;