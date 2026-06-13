"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
const supabase = createClient();
const router = useRouter();

const [loading, setLoading] = useState(true);
const [updating, setUpdating] = useState(false);
const [password, setPassword] = useState("");
const [confirm, setConfirm] = useState("");
const [error, setError] = useState<string | null>(null);
const [ready, setReady] = useState(false);

// Step 1: detect recovery session from URL hash
useEffect(() => {
const initRecovery = async () => {
try {
const hash = window.location.hash;

    if (!hash.includes("type=recovery")) {
      setError("Invalid or expired reset link");
      setLoading(false);
      return;
    }

    // This ensures Supabase picks up the session from the URL
    const { data, error } = await supabase.auth.getSession();

    if (error || !data.session) {
      setError("Failed to initialize reset session");
    } else {
      setReady(true);
    }
  } catch (err) {
    setError("Something went wrong");
  } finally {
    setLoading(false);
  }
};

initRecovery();

}, [supabase]);

// Step 2: update password
const handleUpdatePassword = async () => {
setError(null);

if (!password || !confirm) {
  setError("Please fill in both fields");
  return;
}

if (password !== confirm) {
  setError("Passwords do not match");
  return;
}

if (password.length < 6) {
  setError("Password must be at least 6 characters");
  return;
}

setUpdating(true);

const { error } = await supabase.auth.updateUser({
  password,
});

setUpdating(false);

if (error) {
  setError(error.message);
  return;
}

alert("Password updated successfully 🔥");

await supabase.auth.signOut();
router.push("/login");

};

if (loading) {
return ( <div className="flex items-center justify-center h-screen">
Loading... </div>
);
}

if (error && !ready) {
return ( <div className="flex items-center justify-center h-screen text-red-500">
{error} </div>
);
}

return ( 
  <div className="flex items-center justify-center h-screen"> <div className="w-full max-w-md p-6 border rounded-lg"> <h1 className="text-2xl font-bold mb-4">Reset Password</h1>

    <p className="text-sm text-gray-500 mb-4">
      Enter your new password below
    </p>

    <input
      type="password"
      placeholder="New password"
      className="w-full p-2 border mb-3"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />

    <input
      type="password"
      placeholder="Confirm password"
      className="w-full p-2 border mb-3"
      value={confirm}
      onChange={(e) => setConfirm(e.target.value)}
    />

    {error && (
      <p className="text-red-500 text-sm mb-2">{error}</p>
    )}

    <button
      onClick={handleUpdatePassword}
      disabled={updating || !ready}
      className="w-full bg-black text-white p-2 disabled:opacity-50"
    >
      {updating ? "Updating..." : "Update Password"}
    </button>
  </div>
</div>

);
}
