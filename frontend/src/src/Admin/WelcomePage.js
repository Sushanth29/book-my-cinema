import { Link } from 'react-router-dom';
import './WelcomePage.css'; 

const AdminWelcomePage = ({bodyClassName}) => {
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        window.location.href = '/admin-login';
    };
    document.body.className = bodyClassName || ''

    return (
        <div className="admin-welcome-page-container">
<br></br>
<div className="top-right">
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </div>
            <h3 className='h3-css'>Book My Cinema</h3> <br></br>
            <div className="admin-welcome-container">
                <h2>Welcome Admin!</h2><br></br>
                <Link to="/admin/create-city">
                    <button className='main-btn'>Create City</button>
                </Link>
                <Link to="/admin/create-venue">
                    <button className='main-btn'>Create Venue</button>
                </Link>
                <Link to="/admin/create-movie">
                    <button className='main-btn'>Create Movie</button>
                </Link>
                <Link to="/admin/open-movies">
                    <button className='main-btn'>Open Movies</button>
                </Link>
            </div>
        </div>
    );
};

export default AdminWelcomePage;
