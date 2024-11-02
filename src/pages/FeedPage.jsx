import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import config from '../config.json'; // Adjust the path as needed
import './FeedPage.css';

const FeedPage = () => {
    const [images, setImages] = useState([]);
    const [message, setMessage] = useState('');
    const [selectedImageId, setSelectedImageId] = useState(null); // Track selected image for tipping

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
                    imageArray.push({ id: i, imageUrl, owner, tips: ethers.formatEther(tipAmount), likeCount: 0, liked: false });
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
    const handleTip = async (imageId, amount) => {
        if (!window.ethereum) return alert('Please install MetaMask!');

        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contractAddress = config["1320"].ImageStorage.address;
            const contractABI = [
                "function tipCreator(uint256 _imageId) public payable"
            ];
            const contract = new ethers.Contract(contractAddress, contractABI, signer);

            const tx = await contract.tipCreator(imageId, { value: ethers.parseEther(amount.toString()) });
            setMessage("Sending tip...");
            await tx.wait();
            setMessage("Tip sent successfully!");
            setSelectedImageId(null); // Close the overlay after sending tip
        } catch (error) {
            console.error("Error sending tip:", error);
            setMessage("Failed to send tip.");
        }
    };

    // Handle like action
    const handleLike = (imageId) => {
        setImages((prevImages) =>
            prevImages.map((image) =>
                image.id === imageId
                    ? {
                        ...image,
                        likeCount: image.liked ? image.likeCount - 1 : image.likeCount + 1,
                        liked: !image.liked
                    }
                    : image
            )
        );
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
                                <p className="tips-text">Likes: {image.likeCount}</p>
                            </div>
                            <div className="button-area">
                                <button 
                                    className={`action-button like-button ${image.liked ? 'liked' : ''}`}
                                    onClick={() => handleLike(image.id)}
                                >
                                    👍 Like
                                </button>
                                <button className="action-button dislike-button">👎 Dislike</button>
                                <button 
                                    className="action-button tip-button"
                                    onClick={() => setSelectedImageId(image.id)}
                                >
                                    Tip Creator
                                </button>
                                <button className="action-button rent-button">Rent Meme</button>
                            </div>
                        </div>

                        {selectedImageId === image.id && (
                            <div className="tip-options">
                                <button className="close-button" onClick={() => setSelectedImageId(null)}>✕</button>
                                <p>Select Tip Amount:</p>
                                {[0.1, 1, 2, 5, 10].map(amount => (
                                    <button 
                                        key={amount} 
                                        onClick={() => handleTip(image.id, amount)}
                                    >
                                        {amount} AIA
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FeedPage;
