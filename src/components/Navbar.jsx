import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const [account, setAccount] = useState(null);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const offset = window.scrollY;
            setIsScrolled(offset > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                setAccount(accounts[0]);
            } catch (error) {
                console.error('User denied account access', error);
            }
        } else {
            alert('Please install MetaMask!');
        }
    };

    useEffect(() => {
        const checkAccount = async () => {
            if (window.ethereum) {
                const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                if (accounts.length > 0) {
                    setAccount(accounts[0]);
                }
            }
        };
        checkAccount();
    }, []);

    return (
        <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
            <h1 className="logo">My Meme</h1>
            <div className="nav-links">
                <Link to="/" className="nav-link">Feed</Link>
                <Link to="/upload" className="nav-link" id='upload'>Add a meme</Link>
                <Link to="/upload" className="nav-link">About MY-MEME</Link>
            </div>
            <p className="build-text">Build on AIA</p>
            <div className="wallet-info">
                {account ? (
                    <span className="account">{`Connected: ${account.slice(0, 6)}...${account.slice(-4)}`}</span>
                ) : (
                    <button className="connect-button" onClick={connectWallet}>
                        Connect Wallet
                    </button>
                )}
            </div>
        </nav>
    );
};

export default Navbar;