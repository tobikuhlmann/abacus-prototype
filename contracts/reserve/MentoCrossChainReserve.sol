// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.13;

// ============ External Imports ============
import {Router} from "@abacus-network/app/contracts/Router.sol";
import {MentoPrototypeToken} from "../token/MentoPrototypeToken.sol";

/*
 * @title The Mento Cross-chain Reserve
 * @dev This contract holds and rebalances the MentoPrototypeToken
 */
contract MentoCrossChainReserve is Router {
    MentoPrototypeToken public mentoPrototypeToken;
    uint256 internalBalance;
    // A counter of how many messages have been sent from this contract.
    uint256 public sent;
    // A counter of how many messages have been received by this contract.
    uint256 public received;

    // Keyed by domain, a counter of how many messages that have been sent
    // from this contract to the domain.
    mapping(uint32 => uint256) public sentTo;
    // Keyed by domain, a counter of how many messages that have been received
    // by this contract from the domain.
    mapping(uint32 => uint256) public receivedFrom;

    // ============ Events ============
    event SentHelloWorld(
        uint32 indexed origin,
        uint32 indexed destination,
        string message
    );
    event ReceivedHelloWorld(
        uint32 indexed origin,
        uint32 indexed destination,
        bytes32 sender,
        string message
    );

    /**
     * @notice Emitted when a new MentoPrototypeToken is set.
     * @param mentoPrototypeToken The address of the MentoPrototypeToken contract
     */
    event MentoPrototypeTokenSet(address indexed mentoPrototypeToken);

    /**
     * @notice Emitted when a rebalance transfer is sent
     */
    event RebalanceRemoteTransfer(
        uint32 _localDomain,
        uint32 _destinationDomain,
        uint256 rebalanceAmount
    );

    constructor(
        address _mentoPrototypeToken,
        address _abacusConnectionManager,
        address _interchainGasPaymaster
    ) {
        // Transfer ownership of the contract to deployer
        _transferOwnership(msg.sender);
        // Set the addresses for the ACM and IGP
        // Alternatively, this could be done later in an initialize method
        _setAbacusConnectionManager(_abacusConnectionManager);
        _setInterchainGasPaymaster(_interchainGasPaymaster);
        _setMentoPrototypeToken(_mentoPrototypeToken);
    }

    // ============ External functions ============

    /**
     * @notice Sends a message to the _destinationDomain. Any msg.value is
     * used as interchain gas payment.
     * @param _destinationDomain The destination domain to send the message to.
     */
    function sendHelloWorld(uint32 _destinationDomain, string calldata _message)
        external
        payable
    {
        sent += 1;
        sentTo[_destinationDomain] += 1;
        _dispatchWithGas(_destinationDomain, bytes(_message), msg.value);
        emit SentHelloWorld(_localDomain(), _destinationDomain, _message);
    }

    /**
     * @notice Sends a rebalance transfer to a remote chain
     * @param _destinationDomain The destination domain to send the message to.
     * @param _rebalanceAmount The amount to rebalance
     */
    function rebalanceRemote(
        uint32 _destinationDomain,
        address _destinationAddress,
        uint256 _rebalanceAmount
    ) external payable onlyOwner {
        _rebalanceRemote(
            _destinationDomain,
            _destinationAddress,
            _rebalanceAmount
        );
    }

    /**
     * @notice Sets the address of the application's AbacusConnectionManager.
     * @param _mentoPrototypeToken The address of the MentoPrototypeToken contract.
     */
    function setMentoPrototypeToken(address _mentoPrototypeToken)
        external
        virtual
        onlyOwner
    {
        _setMentoPrototypeToken(_mentoPrototypeToken);
    }

    // ============ Internal functions ============

    /**
     * @notice Handles a message from a remote router.
     * @dev Only called for messages sent from a remote router, as enforced by Router.sol.
     * @param _origin The domain of the origin of the message.
     * @param _sender The sender of the message.
     * @param _message The message body.
     */
    function _handle(
        uint32 _origin,
        bytes32 _sender,
        bytes memory _message
    ) internal override {
        received += 1;
        receivedFrom[_origin] += 1;
        emit ReceivedHelloWorld(
            _origin,
            _localDomain(),
            _sender,
            string(_message)
        );
    }

    /**
     * @notice Modify the token contract the reserve uses
     * @param _mentoPrototypeToken The address of the MentoPrototypeToken contract
     */
    function _setMentoPrototypeToken(address _mentoPrototypeToken) internal {
        mentoPrototypeToken = MentoPrototypeToken(_mentoPrototypeToken);
        emit MentoPrototypeTokenSet(_mentoPrototypeToken);
    }

    /**
     * @notice Sends a rebalance transfer to a remote chain
     * @param _destinationDomain The destination domain to send the message to.
     * @param _rebalanceAmount The amount to rebalance
     */
    function _rebalanceRemote(
        uint32 _destinationDomain,
        address _destinationAddress,
        uint256 _rebalanceAmount
    ) internal {
        internalBalance = mentoPrototypeToken.balanceOf(address(this));
        require(
            _rebalanceAmount <= internalBalance,
            "amount to rebalance less than contract balance"
        );
        mentoPrototypeToken.transferRemote(
            _destinationDomain,
            _destinationAddress,
            _rebalanceAmount
        );
        emit RebalanceRemoteTransfer(
            _localDomain(),
            _destinationDomain,
            _rebalanceAmount
        );
    }
}
