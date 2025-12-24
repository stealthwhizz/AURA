// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title AuraCertification
 * @dev Smart contract for managing AURA crop certifications on blockchain
 */
contract AuraCertification {
    
    struct Certification {
        string batchId;
        address farmer;
        string cropType;
        uint256 quantity;
        uint256 harvestDate;
        uint256 certificationDate;
        uint8 averageRiskScore; // 1-10
        string metadataHash; // IPFS hash for additional data
        bool isValid;
    }
    
    // Mapping from batch ID to certification
    mapping(string => Certification) public certifications;
    
    // Mapping from farmer address to their batch IDs
    mapping(address => string[]) public farmerCertifications;
    
    // Events
    event CertificationCreated(
        string indexed batchId,
        address indexed farmer,
        string cropType,
        uint256 certificationDate
    );
    
    event CertificationRevoked(
        string indexed batchId,
        address indexed farmer,
        uint256 revokedDate
    );
    
    // Modifier to check if certification exists
    modifier certificationExists(string memory batchId) {
        require(bytes(certifications[batchId].batchId).length > 0, "Certification does not exist");
        _;
    }
    
    /**
     * @dev Create a new AURA certification
     */
    function createCertification(
        string memory _batchId,
        address _farmer,
        string memory _cropType,
        uint256 _quantity,
        uint256 _harvestDate,
        uint8 _averageRiskScore,
        string memory _metadataHash
    ) public returns (bool) {
        require(bytes(certifications[_batchId].batchId).length == 0, "Batch ID already exists");
        require(_averageRiskScore >= 1 && _averageRiskScore <= 10, "Invalid risk score");
        require(_averageRiskScore < 7, "Risk score too high for certification");
        
        Certification memory newCert = Certification({
            batchId: _batchId,
            farmer: _farmer,
            cropType: _cropType,
            quantity: _quantity,
            harvestDate: _harvestDate,
            certificationDate: block.timestamp,
            averageRiskScore: _averageRiskScore,
            metadataHash: _metadataHash,
            isValid: true
        });
        
        certifications[_batchId] = newCert;
        farmerCertifications[_farmer].push(_batchId);
        
        emit CertificationCreated(_batchId, _farmer, _cropType, block.timestamp);
        
        return true;
    }
    
    /**
     * @dev Verify a certification by batch ID
     */
    function verifyCertification(string memory _batchId) 
        public 
        view 
        certificationExists(_batchId)
        returns (
            address farmer,
            string memory cropType,
            uint256 quantity,
            uint8 riskScore,
            bool isValid,
            uint256 certDate
        ) 
    {
        Certification memory cert = certifications[_batchId];
        return (
            cert.farmer,
            cert.cropType,
            cert.quantity,
            cert.averageRiskScore,
            cert.isValid,
            cert.certificationDate
        );
    }
    
    /**
     * @dev Revoke a certification (admin/farmer only)
     */
    function revokeCertification(string memory _batchId) 
        public 
        certificationExists(_batchId)
        returns (bool) 
    {
        Certification storage cert = certifications[_batchId];
        require(msg.sender == cert.farmer, "Only farmer can revoke");
        require(cert.isValid, "Already revoked");
        
        cert.isValid = false;
        
        emit CertificationRevoked(_batchId, cert.farmer, block.timestamp);
        
        return true;
    }
    
    /**
     * @dev Get all certifications for a farmer
     */
    function getFarmerCertifications(address _farmer) 
        public 
        view 
        returns (string[] memory) 
    {
        return farmerCertifications[_farmer];
    }
    
    /**
     * @dev Get certification count
     */
    function getCertificationCount(address _farmer) 
        public 
        view 
        returns (uint256) 
    {
        return farmerCertifications[_farmer].length;
    }
}
