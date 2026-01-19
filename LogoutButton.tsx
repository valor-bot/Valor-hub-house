import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase"; // adjust if needed
import { Button } from "@/components/ui/button";

export default function LogoutButton() {
  const navigate = useNavigate();

  const onLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <Button variant="outline" onClick={onLogout}>
      Logout
    </Button>
  );
}
