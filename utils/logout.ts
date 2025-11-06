import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase"; // get the auth / keys from our firebase

export async function logOut() {
    try {
        await signOut(auth); // firebase will handle your signout
    } catch(error) {
        console.error("Error signing out: ", error);
    }
}