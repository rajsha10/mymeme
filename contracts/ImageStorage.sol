// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ImageStorage {
    struct Image {
        string imageUrl; // The IPFS URL or hash of the image
        address owner;   // The address of the owner
        uint256 tipAmount; // Total tips received for this image
    }

    // Mapping from image ID to Image struct
    mapping(uint256 => Image) public images;
    // Counter for image IDs
    uint256 public imageCount;

    // Event emitted when an image is uploaded
    event ImageUploaded(uint256 indexed imageId, string imageUrl, address indexed owner);
    // Event emitted when a tip is sent to the creator
    event TipSent(uint256 indexed imageId, address indexed sender, uint256 amount);

    // Function to upload an image
    function uploadImage(string memory _imageUrl) public {
        imageCount++; // Increment the image ID counter
        images[imageCount] = Image(_imageUrl, msg.sender, 0); // Store the image URL, owner, and initialize tip amount
        emit ImageUploaded(imageCount, _imageUrl, msg.sender); // Emit an event for the upload
    }

    // Function to retrieve an image by its ID
    function getImage(uint256 _imageId) public view returns (string memory, address, uint256) {
        require(_imageId > 0 && _imageId <= imageCount, "Image does not exist.");
        Image memory img = images[_imageId];
        return (img.imageUrl, img.owner, img.tipAmount);
    }

    // Function to get the total number of images uploaded
    function getTotalImages() public view returns (uint256) {
        return imageCount;
    }

    // Function to tip the creator of an image
    function tipCreator(uint256 _imageId) public payable {
        require(_imageId > 0 && _imageId <= imageCount, "Image does not exist.");
        Image storage img = images[_imageId];

        // Update the tip amount for the image
        img.tipAmount += msg.value;
        
        // Transfer the tip to the image owner
        payable(img.owner).transfer(msg.value);

        // Emit a TipSent event
        emit TipSent(_imageId, msg.sender, msg.value);
    }
}
