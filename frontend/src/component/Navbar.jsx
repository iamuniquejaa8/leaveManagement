import { Link } from "react-router-dom";

const Navbar = ({ navigation }) => {
    return (
        <>
        <div className="flex justify-center p-2 items-center bg-[#f97316] text-white h-[6vh] ">
            <div className="flex gap-x-2">
                <Link to="/partner">Partner</Link>
                <Link to="/leave">Leave</Link>
            </div>
        </div>
        </>
    );
}
 
export default Navbar;