import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import config from '../config.json'; // Adjust the path as needed
import './FeedPage.css';

const FeedPage = () => {
    const [images, setImages] = useState([]);
    const [message, setMessage] = useState('');

    // Load images from the blockchain
    useEffect(() => {
        const fetchImages = async () => {
            if (!window.ethereum) return alert('Please install MetaMask!');

            try {
                const provider = new ethers.BrowserProvider(window.ethereum);
                const contractAddress = config["1320"].ImageStorage.address;
                const contractABI = [
                    "function getTotalImages() public view returns (uint256)",
                    "function getImage(uint256 _imageId) public view returns (string memory, address, uint256)",
                    "function tipCreator(uint256 _imageId) public payable"
                ];

                const contract = new ethers.Contract(contractAddress, contractABI, provider);

                const totalImages = await contract.getTotalImages();
                const imageArray = [];

                for (let i = 1; i <= totalImages; i++) {
                    const [imageUrl, owner, tipAmount] = await contract.getImage(i);
                    imageArray.push({ id: i, imageUrl, owner, tips: ethers.formatEther(tipAmount) }); // Format tips to ether
                }

                setImages(imageArray);
            } catch (error) {
                console.error("Error fetching images:", error);
                setMessage("Failed to load images from the blockchain.");
            }
        };

        fetchImages();
    }, []);

    // Handle tip to creator
    const handleTip = async (imageId, creatorAddress) => {
        if (!window.ethereum) return alert('Please install MetaMask!');

        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contractAddress = config["1320"].ImageStorage.address;
            const contractABI = [
                "function tipCreator(uint256 _imageId) public payable"
            ];
            const contract = new ethers.Contract(contractAddress, contractABI, signer);

            const tx = await contract.tipCreator(imageId, { value: ethers.parseEther("1") });
            setMessage("Sending tip...");
            await tx.wait();
            setMessage("Tip sent successfully!");
        } catch (error) {
            console.error("Error sending tip:", error);
            setMessage("Failed to send tip.");
        }
    };

    return (
        <div className="feed-container">
            <h2 className="feed-title">Image Feed</h2>
            {message && <p className="message">{message}</p>}
            <div className="feed-grid">
                {images.map((image) => (
                    <div key={image.id} className="image-card">
                        <img src={image.imageUrl} alt="Blockchain Image" className="card-image" />
                        <div className="action-buttons">
                            <div className="card-content">
                                <p className="owner-text">Owner: {`${image.owner.slice(0, 6)}...${image.owner.slice(-4)}`}</p>
                                <p className="tips-text">Tipped Amount: {image.tips} AIA</p>
                            </div>
                            <div className='button-area'>
                                <button className="action-button like-button">👍 Like</button>
                                <button className="action-button dislike-button">👎 Dislike</button>
                                <button 
                                    className="action-button tip-button"
                                    onClick={() => handleTip(image.id, image.owner)}
                                >
                                    Tip Creator
                                </button>
                                <button className="action-button rent-button">Rent Meme</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FeedPage;
