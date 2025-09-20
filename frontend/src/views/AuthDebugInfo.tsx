import { useSelector } from "react-redux";
import { decryptData } from "@/slice/AuthSlice";
import type { RootState } from "@/store";

const AuthDebugInfo = () => {
  const encryptedUser = useSelector((state: RootState) => state.auth.user);
  const user = encryptedUser ? decryptData(encryptedUser) : null;

  return (
    <div
      style={{
        position: "fixed",
        top: 10,
        right: 10,
        background: "rgba(0,0,0,0.8)",
        color: "white",
        padding: "10px",
        fontSize: "12px",
        zIndex: 9999,
      }}
    >
      <div>Encrypted User: {encryptedUser ? "✅" : "❌"}</div>
      <div>Decrypted User: {user ? `✅ ${user.name}` : "❌"}</div>
      <div>Local Storage: {localStorage.getItem("user") ? "✅" : "❌"}</div>
    </div>
  );
};

export default AuthDebugInfo;
