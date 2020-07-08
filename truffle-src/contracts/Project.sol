pragma solidity ^0.6.10;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract ProjectContract is ReentrancyGuard {
    
    // STATE VARIABLES
    mapping(address => ClientProperties) public client;
    struct ClientProperties {
        uint256 projectCount;
        mapping(uint256 => Project) projectWithId;
    }

    struct Project {
        address client;
        uint256 project_id;
        string title;
        string description;
        string skills;
        PriceRange price_range;
        uint256 due_date;
        uint256 date_created;
    }
    
    struct PriceRange {
        uint256 low;
        uint256 high;
    }

    // EVENTS
    event ProjectCreated (
        address indexed client,
        uint256 indexed project_id,
        string title,
        string description,
        string skills,
        uint256 price_low,
        uint256 price_high,
        uint256 due_date,
        uint256 date_created
    );
    
    event ProjectUpdated (
        address indexed client,
        uint256 indexed project_id,
        string title,
        string description,
        string skills,
        uint256 price_low,
        uint256 price_high,
        uint256 due_date,
        uint256 date_created
    );

    event ProjectDeleted (
        address indexed client,
        uint256 indexed project_id
    );

    // MODIFIERS
    modifier projectMustExist(uint256 _id) {
        require(_id > 0 && _id <= client[msg.sender].projectCount);
        Project memory _project = client[msg.sender].projectWithId[_id];

        require(bytes(_project.title).length > 0);
        require(bytes(_project.description).length > 0);
        require(bytes(_project.skills).length > 0);
        require(_project.price_range.low > 0);
        require(_project.price_range.high > 0 && _project.price_range.high > _project.price_range.low);
        _;
    }

    // FUNCTIONS
    function createProject (
        string memory _title,
        string memory _description,
        string memory _skills,
        uint256 _price_low,
        uint256 _price_high,
        uint256 _due_date
    ) 
        external
        nonReentrant()
    {
        require(bytes(_title).length > 0);
        require(bytes(_description).length > 0);
        require(bytes(_skills).length > 0);
        require(_price_low > 0);
        require(_price_high > 0 && _price_high > _price_low);
        require(_due_date > now);

        client[msg.sender].projectCount += 1;

        Project memory _project; 
        PriceRange memory _price_range = PriceRange(_price_low, _price_high);
        
        uint256 _id = client[msg.sender].projectCount;

        _project = Project ({
            project_id: _id,
            client: msg.sender,
            title: _title,
            description: _description, 
            skills: _skills,
            price_range: _price_range,
            due_date: _due_date,
            date_created: now
        });
        
        client[msg.sender].projectWithId[_id] = _project;
        
        emit ProjectCreated(
            msg.sender,
            _id,
            _title,
            _description,
            _skills,
            _price_low,
            _price_high,
            _due_date,
            now
        );
    }

    function updateProject(
        uint256 _id,
        string memory _title,
        string memory _description,
        string memory _skills,
        uint256 _price_low,
        uint256 _price_high,
        uint256 _due_date
    )
        external
        projectMustExist(_id)
    {
        require(bytes(_title).length > 0);
        require(bytes(_description).length > 0);
        require(bytes(_skills).length > 0);
        require(_price_low > 0);
        require(_price_high > 0 && _price_high > _price_low);
        require(_due_date > now);

        Project storage project = client[msg.sender].projectWithId[_id];
        PriceRange memory _price_range = PriceRange(_price_low, _price_high);
        
        project.title = _title;
        project.description = _description;
        project.skills = _skills;
        project.price_range = _price_range;
        project.due_date = _due_date;
        
        emit ProjectUpdated(
            msg.sender,
            _id,
            _title,
            _description,
            _skills,
            _price_low,
            _price_high,
            _due_date,
            now
        );
    }

    function getProjectById (
        uint256 _id
    )
        view
        public
        projectMustExist(_id)
        returns (
            uint256 project_id,
            string memory title,
            string memory description,
            string memory skills,
            uint256 price_low,
            uint256 price_high,
            uint256 due_date,
            uint256 date_created
        )
    {
        Project memory _project = client[msg.sender].projectWithId[_id];
        return (
            _project.project_id,
            _project.title,
            _project.description,
            _project.skills,
            _project.price_range.low,
            _project.price_range.high,
            _project.due_date,
            _project.date_created
        );
    }
    
    function deleteProjectById (
        uint256 _id
    )
        external
        projectMustExist(_id)
        returns (
            bool success
        )
    {
        Project memory _project = client[msg.sender].projectWithId[_id];
        delete client[msg.sender].projectWithId[_id];

        emit ProjectDeleted(msg.sender, _id);
        return true;
    }
}