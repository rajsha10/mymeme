import React, { useState } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import config from '../config.json'; // Adjust the path as needed

const ImageUpload = () => {
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null); // State for image preview
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');

    // Handle image selection
    const handleImageChange = (event) => {
        const selectedImage = event.target.files[0];
        setImage(selectedImage);

        // Create a preview URL for the selected image
        if (selectedImage) {
            const previewUrl = URL.createObjectURL(selectedImage);
            setImagePreview(previewUrl);
        }
    };

    // Upload image to IPFS via Pinata
    const uploadToIPFS = async () => {
        const formData = new FormData();
        formData.append('file', image);

        try {
            const res = await axios.post(`https://api.pinata.cloud/pinning/pinFileToIPFS`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    pinata_api_key: import.meta.env.VITE_PINATA_API_KEY,
                    pinata_secret_api_key: import.meta.env.VITE_PINATA_SECRET_API_KEY,
                },
            });
            return `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
        } catch (error) {
            console.error("Error uploading to IPFS:", error);
            setMessage("Failed to upload image to IPFS.");
            return null;
        }
    };

    // Upload image URL to the blockchain
    const uploadToBlockchain = async (imageUrl) => {
        if (!window.ethereum) {
            setMessage("Please install MetaMask!");
            return;
        }

        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contractAddress = config["1320"].ImageStorage.address;
            const contractABI = [
                "function uploadImage(string memory _imageUrl) public",
                "event ImageUploaded(uint256 indexed imageId, string imageUrl, address indexed owner)"
            ];
            const contract = new ethers.Contract(contractAddress, contractABI, signer);

            const tx = await contract.uploadImage(imageUrl);
            setMessage("Uploading to blockchain...");
            await tx.wait();
            setMessage("Image uploaded successfully!");
        } catch (error) {
            console.error("Error uploading to blockchain:", error);
            setMessage("Failed to upload image to blockchain.");
        }
    };

    // Main upload function
    const handleUpload = async () => {
        if (!image) {
            setMessage("Please select an image first.");
            return;
        }

        setUploading(true);
        setMessage("Uploading to IPFS...");

        const imageUrl = await uploadToIPFS();
        if (!imageUrl) {
            setUploading(false);
            return;
        }

        await uploadToBlockchain(imageUrl);
        setUploading(false);
    };

    return (
        <div style={styles.container}>
            <h2>Upload Image to Blockchain</h2>
            <input type="file" onChange={handleImageChange} style={styles.fileInput} />
            {imagePreview && (
                <img src={imagePreview} alt="Image Preview" style={styles.imagePreview} />
            )}
            <button onClick={handleUpload} style={styles.uploadButton} disabled={uploading}>
                {uploading ? "Uploading..." : "Upload"}
            </button>
            {message && <p>{message}</p>}
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '20px',
    },
    fileInput: {
        marginBottom: '10px',
    },
    uploadButton: {
        padding: '10px 20px',
        backgroundColor: '#61dafb',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        color: '#282c34',
    },
    imagePreview: {
        marginTop: '10px',
        maxWidth: '300px', // Set a max width for the preview
        maxHeight: '300px', // Set a max height for the preview
        border: '1px solid #ccc', // Optional: Add a border for better visibility
    },
};

export default ImageUpload;
