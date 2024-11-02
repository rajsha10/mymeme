import React, { useState } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import config from '../config.json'; // Adjust the path as needed
import './ImageUpload.css';

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

        // Clear all fields after uploading
        setImage(null);
        setImagePreview(null);
        setMessage('');
    };

    return (
        <div className="upload-container">
            <h2 className="upload-title">Upload MEME</h2>
            <div className="upload-card">
                <div className="file-input-container">
                    <input 
                        type="file" 
                        onChange={handleImageChange} 
                        className="file-input"
                        accept="image/*"
                    />
                    <div className="file-input-label">
                        {imagePreview ? 'Change Image' : 'Click or drag image here'}
                    </div>
                </div>
                
                {imagePreview && (
                    <div className="preview-container">
                        <img 
                            src={imagePreview} 
                            alt="Preview" 
                            className="image-preview" 
                        />
                    </div>
                )}
                
                <button 
                    onClick={handleUpload} 
                    className="upload-button" 
                    disabled={uploading || !image}
                >
                    {uploading && <span className="loading-spinner"></span>}
                    {uploading ? "Uploading..." : "Upload to MY-MEME"}
                </button>
                
                {message && (
                    <div className={`message ${message.includes('success') ? 'success-message' : ''}`}>
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageUpload;