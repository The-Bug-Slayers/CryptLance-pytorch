pragma solidity ^0.6.10;

import "./Project.sol";
// import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract BidContract { // is ReentrancyGuard {

    ProjectContract public project;
    
    constructor(ProjectContract _project) public {
        project = _project;
    }

    mapping(address => FreelancerProperties) public freelancer;
    struct FreelancerProperties {
        uint256 bidCount;
        mapping(uint256 => Bid) bidWithId;
    }

    struct Bid {
        uint256 bid_id;
        uint256 project_id;
        string bid_description;
        uint256 bid_price;
        uint256 days_required;
        bool accepted;
        uint256 completed_on;
        bool paid;
    }
    
}