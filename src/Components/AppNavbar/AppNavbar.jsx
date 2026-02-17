import { Avatar, Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenu, NavbarMenuItem, NavbarMenuToggle } from "@heroui/react";
import { EmojiHappy } from "iconsax-reactjs";
import { useContext, useRef, useState } from "react";
import { Link, NavLink } from "react-router";
import { createdContext } from "../../Context/CounterContext/CounterContext";
import { AuthUserContext } from "../../Context/AuthContextProvider/AuthContextProvider";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import axios from "axios";

export default function AppNavbar() {
   const [isMenuOpen, setIsMenuOpen] = useState(false);
   const {userData,getUserData,setUserData } = useContext(AuthUserContext);


   const profileImage = useRef()

   const router = useNavigate()

   function handleLogout() {
    localStorage.clear();
    setUserData(null)
    router('/login')
   }


   async function handleUserProfile() {
    const myForm = new FormData()
    myForm.append('photo', profileImage.current.files[0])
    toast.promise(
      axios.put(`${import.meta.env.VITE_BASE_URL}users/upload-photo`, myForm, {
        headers: {
          token: localStorage.getItem('token')
        }
      }), {
        loading: "Update Profile Image....",
        success: function({data:{message}}) {
          getUserData()
          return message
        },
        error: function(error) {
          return error.response.data.error
        }
      }
    )
   }

  return (
    <Navbar isBordered isMenuOpen={isMenuOpen} className="bg-blue-100/40 py-3" onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} />
      </NavbarContent>

      <NavbarContent className="sm:hidden pr-3" justify="center">
        <NavbarBrand>
          <EmojiHappy size="44" color="#37d67a"/>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="end">
        <NavbarBrand as={Link} to='/'>
          <EmojiHappy size="44" color="#37d67a"/>
        </NavbarBrand>
       {userData &&  <NavbarItem>
          <NavLink className={function({isActive}){return `text-3xl ${isActive ? "text-blue-500 border-b-2 border-green-400" : ""}`}}  to="posts">
            Posts
          </NavLink>
        </NavbarItem>}
      </NavbarContent>

      <NavbarContent justify="end">
        {userData ?  <NavbarItem>
            <Dropdown placement="bottom">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="transition-transform cursor-pointer bg-white"
              color="primary"
              name="Jason Hughes"
              size="md"
              src={userData.photo}
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem key="profile" className="h-14 gap-2">
              <p className="font-semibold">Signed in as</p>
              <p className="font-semibold">{userData.email}</p>
            </DropdownItem>
            <DropdownItem key="settings">Name: {userData.name}</DropdownItem>
            <DropdownItem key="team_settings" as={Link} to="/change-password">Change Password</DropdownItem>
            <DropdownItem key="analytics" onClick={function() {profileImage.current.click()}}>Update Profile Image</DropdownItem>
            <DropdownItem key="logout" color="danger" onClick={handleLogout}>
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        </NavbarItem>:    <NavbarItem>
          <Button as={Link} color="primary" to="register" variant="shadow">
            Sign Up
          </Button>
        </NavbarItem>}
     
        
      </NavbarContent>

      <NavbarMenu className="pt-4">
        {userData ? <NavbarMenuItem >
            <Link
            onClick={function(){setIsMenuOpen(false)}}
            to="posts"
            >
                Posts
            </Link>
          </NavbarMenuItem> :  <NavbarMenuItem >
            <Link
            onClick={function(){setIsMenuOpen(false)}}
            to="register"

            >
                Sign Up
            </Link>
          </NavbarMenuItem>}
          

         
     
      </NavbarMenu>
<input type="file" ref={profileImage} onChange={handleUserProfile}  className="hidden" />
{/* controlled elemnt useRef*/}
    </Navbar>
  )
}
