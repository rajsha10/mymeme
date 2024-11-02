import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import config from '../config.json'; // Adjust the path as needed

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
        <div style={styles.container}>
            <h2>Image Feed</h2>
            {message && <p>{message}</p>}
            <div style={styles.feed}>
                {images.map((image) => (
                    <div key={image.id} style={styles.imageCard}>
                        <img src={image.imageUrl} alt="Blockchain Image" style={styles.image} />
                        <p>Owner: {`${image.owner.slice(0, 6)}...${image.owner.slice(-4)}`}</p>
                        <p>Tipped Amount: {image.tips} AIA</p>
                        <div style={styles.actions}>
                            <button style={styles.button}>👍 Like</button>
                            <button style={styles.button}>👎 Dislike</button>
                            <button style={styles.tipButton} onClick={() => handleTip(image.id, image.owner)}>
                                Tip Creator
                            </button>
                            <button style={styles.tipButton}>Rent Meme</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: '20px',
        textAlign: 'center',
    },
    feed: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '20px',
        marginTop: '20px',
    },
    imageCard: {
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '10px',
        textAlign: 'center',
        backgroundColor: '#f9f9f9',
    },
    image: {
        width: '100%',
        height: '200px',
        objectFit: 'cover',
        borderRadius: '5px',
    },
    actions: {
        display: 'flex',
        justifyContent: 'space-around',
        marginTop: '10px',
    },
    button: {
        padding: '5px 10px',
        border: 'none',
        borderRadius: '5px',
        backgroundColor: '#61dafb',
        cursor: 'pointer',
        color: '#282c34',
    },
    tipButton: {
        padding: '5px 10px',
        border: 'none',
        borderRadius: '5px',
        backgroundColor: '#ffd700',
        cursor: 'pointer',
        color: '#282c34',
    },
};

export default FeedPage;
