import { Link, useNavigate } from 'react-router-dom';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import InventoryIcon from '@mui/icons-material/Inventory';
import GroupIcon from '@mui/icons-material/Group';
import ReviewsIcon from '@mui/icons-material/Reviews';
import AddBoxIcon from '@mui/icons-material/AddBox';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import CloseIcon from '@mui/icons-material/Close';
import AutoAwesomeMotionIcon from '@mui/icons-material/AutoAwesomeMotion';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import CategoryIcon from '@mui/icons-material/Category'
import BrandingWatermarkIcon from '@mui/icons-material/BrandingWatermark';
import RssFeedIcon from '@mui/icons-material/RssFeed';
import Avatar from '@mui/material/Avatar';
import { useDispatch, useSelector } from 'react-redux';
import './Sidebar.css';
import Collapse from 'react-bootstrap/Collapse';
import { useSnackbar } from 'notistack';
import { logoutUser } from '../../../actions/userAction';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import { useState } from 'react';

const navMenu = [
  {
    icon: <EqualizerIcon />,
    label: "Dashboard",
    ref: "/admin/dashboard",
  },
  {
    icon: <ShoppingBagIcon />,
    label: "Orders",
    ref: "/admin/orders",
  },
  {
    icon: <InventoryIcon />,
    label: "Products",
    ref: "/admin/products",
    isCollapsed: true,
    children: [
      {

        icon: <AddBoxIcon />,
        label: "Add Product",
        ref: "/admin/new_product",
      },
    ]
  },

  {
    icon: <GroupIcon />,
    label: "Users",
    ref: "/admin/users",
  },
  {
    icon: <ReviewsIcon />,
    label: "Reviews",
    ref: "/admin/reviews",
  },
  {
    icon: <CategoryIcon />,
    label: "Category",
    ref: "/admin/category",
  },
  {
    icon: <BrandingWatermarkIcon />,
    label: "Brand",
    ref: "/admin/brand",
  },
  {
    icon: <RssFeedIcon />,
    label: "Blog",
    ref: "/admin/blog",
  },
  {
    icon: <AutoAwesomeMotionIcon />,
    label: "Customize Slider",
    ref: "/admin/customize",
  },
  {
    icon: <CardMembershipIcon />,
    label: "CustomizeSlider",
    ref: "/admin/customize",
  },
  {
    icon: <AccountBoxIcon />,
    label: "My Profile",
    ref: "/account",
  },
  {
    icon: <LogoutIcon />,
    label: "Logout",
  },
];

const Sidebar = ({ activeTab, setToggleSidebar }) => {

  const [open, setOpen] = useState(false);

  const toggleCollapsed = () => {
    setOpen(!open);
  };
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const { user } = useSelector((state) => state.user);

  const handleLogout = () => {
    dispatch(logoutUser());
    enqueueSnackbar("Logout Successfully", { variant: "success" });
    navigate("/login");
  }

  return (
    <aside className="sidebar z-10 sm:z-0 block min-h-screen left-0 pb-14 max-h-screen w-3/4 sm:w-1/5 bg-gray-800 text-white overflow-x-hidden border-r">
      <div className="flex items-center gap-3 bg-gray-700 p-2 rounded-lg shadow-lg my-4 mx-3.5">
        <Avatar
          alt="Avatar"
          src={user.avatar.url}
        />
        <div className="flex flex-col gap-0">
          <span className="font-medium text-lg">{user.name}</span>
          <span className="text-gray-300 text-sm">{user.email}</span>
        </div>
        <button onClick={() => setToggleSidebar(false)} className="sm:hidden bg-gray-800 ml-auto rounded-full w-10 h-10 flex items-center justify-center">
          <CloseIcon />
        </button>
      </div>

      <div className="flex flex-col w-full gap-0 my-8">
        {navMenu.map((item, index) => {
          const { icon, label, ref, children } = item;
          return (
            <>
              {label === "Logout" ? (
                <button onClick={handleLogout} className="hover:bg-gray-700 flex gap-3 items-center py-3 px-4 font-medium">
                  <span>{icon}</span>
                  <span>{label}</span>

                </button>
              ) : (<>
                <Link to={ref} className={`${activeTab === index ? "bg-gray-700" : "hover:bg-gray-700"} flex gap-3 items-center py-3 px-4 font-medium`}>
                  <span>{icon}</span>
                  <span>{label}</span>
                  {children && children.length > 0 &&
                    <span onClick={toggleCollapsed}>{open ? <BsChevronUp /> : <BsChevronDown />}</span>}
                </Link>
                {open && children && children.map((item) => {
                  const { icon, label, ref } = item;
                  return (
                    <Link to={ref} key={label} className={`flex gap-3 py-3 px-4 font-medium`}>
                      <span>{icon}</span>
                      <span>{label}</span>
                    </Link>
                  )
                })
                }</>

                )}
            </>
          )
        }
        )}
      </div>


    </aside>
  )
};

export default Sidebar;